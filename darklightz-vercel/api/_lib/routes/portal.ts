/**
 * Client Portal API — all routes require a valid Supabase JWT.
 * The requirePortalAuth middleware verifies the token and attaches
 * req.portalUser to every request.
 */
import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  portalUsersTable,
  portalProjectsTable,
  portalMilestonesTable,
  portalProjectFilesTable,
  portalMessagesTable,
  portalRevisionRequestsTable,
  portalSupportTicketsTable,
  portalSupportRepliesTable,
  portalInvoicesTable,
  portalNotificationsTable,
} from "../db/schema/portal.js";
import { requirePortalAuth } from "../lib/portal-auth.js";
import {
  notifyAdmin,
  notifyClient,
  emailUpdateRequested,
  emailNewMessage,
  emailRevisionSubmitted,
} from "../lib/email.js";
import { z } from "zod/v4";

const router: IRouter = Router();

// Apply portal auth to all /portal/* routes
router.use("/portal", requirePortalAuth);

// ── Me ────────────────────────────────────────────────────────────────────

router.get("/portal/me", async (req, res): Promise<void> => {
  res.json(req.portalUser);
});

router.patch("/portal/me", async (req, res): Promise<void> => {
  const schema = z.object({
    name: z.string().optional(),
    company: z.string().optional(),
    phone: z.string().optional(),
    avatarUrl: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updates: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (parsed.data.company !== undefined) updates.company = parsed.data.company;
  if (parsed.data.phone !== undefined) updates.phone = parsed.data.phone;
  if (parsed.data.avatarUrl !== undefined) updates.avatarUrl = parsed.data.avatarUrl;
  updates.updatedAt = new Date();

  const [updated] = await db
    .update(portalUsersTable)
    .set(updates)
    .where(eq(portalUsersTable.id, req.portalUser!.id))
    .returning();
  res.json(updated);
});

// ── Projects ──────────────────────────────────────────────────────────────

router.get("/portal/projects", async (req, res): Promise<void> => {
  const projects = await db
    .select()
    .from(portalProjectsTable)
    .where(eq(portalProjectsTable.portalUserId, req.portalUser!.id))
    .orderBy(desc(portalProjectsTable.createdAt));
  res.json(projects);
});

router.get("/portal/projects/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid project id" }); return; }

  const [project] = await db
    .select()
    .from(portalProjectsTable)
    .where(
      and(
        eq(portalProjectsTable.id, id),
        eq(portalProjectsTable.portalUserId, req.portalUser!.id),
      ),
    );
  if (!project) { res.status(404).json({ error: "Project not found" }); return; }

  const [milestones, files] = await Promise.all([
    db
      .select()
      .from(portalMilestonesTable)
      .where(eq(portalMilestonesTable.projectId, id))
      .orderBy(portalMilestonesTable.sortOrder),
    db
      .select()
      .from(portalProjectFilesTable)
      .where(eq(portalProjectFilesTable.projectId, id))
      .orderBy(desc(portalProjectFilesTable.createdAt)),
  ]);

  res.json({ ...project, milestones, files });
});

// Request a progress update — creates a notification + emails admin
router.post("/portal/projects/:id/request-update", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid project id" }); return; }

  const [project] = await db
    .select()
    .from(portalProjectsTable)
    .where(
      and(
        eq(portalProjectsTable.id, id),
        eq(portalProjectsTable.portalUserId, req.portalUser!.id),
      ),
    );
  if (!project) { res.status(404).json({ error: "Project not found" }); return; }

  // Create notification for client
  await db.insert(portalNotificationsTable).values({
    portalUserId: req.portalUser!.id,
    type: "progress",
    title: "Update requested",
    body: `You requested an update on "${project.title}". We'll get back to you soon.`,
  });

  // Email admin
  await notifyAdmin(
    `[Portal] Update requested: ${project.title}`,
    emailUpdateRequested(req.portalUser!.name || req.portalUser!.email, project.title),
  );

  res.json({ ok: true });
});

// ── Messages ──────────────────────────────────────────────────────────────

router.get("/portal/messages", async (req, res): Promise<void> => {
  const messages = await db
    .select()
    .from(portalMessagesTable)
    .where(eq(portalMessagesTable.portalUserId, req.portalUser!.id))
    .orderBy(desc(portalMessagesTable.createdAt));
  res.json(messages);
});

router.get("/portal/messages/project/:projectId", async (req, res): Promise<void> => {
  const projectId = parseInt(req.params.projectId, 10);
  if (isNaN(projectId)) { res.status(400).json({ error: "Invalid project id" }); return; }

  const messages = await db
    .select()
    .from(portalMessagesTable)
    .where(
      and(
        eq(portalMessagesTable.portalUserId, req.portalUser!.id),
        eq(portalMessagesTable.projectId, projectId),
      ),
    )
    .orderBy(portalMessagesTable.createdAt);
  res.json(messages);
});

router.post("/portal/messages", async (req, res): Promise<void> => {
  const schema = z.object({
    body: z.string().min(1),
    projectId: z.number().int().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [message] = await db
    .insert(portalMessagesTable)
    .values({
      portalUserId: req.portalUser!.id,
      projectId: parsed.data.projectId ?? null,
      sender: "client",
      body: parsed.data.body,
    })
    .returning();

  // Email admin
  let projectTitle = "General";
  if (parsed.data.projectId) {
    const [proj] = await db
      .select()
      .from(portalProjectsTable)
      .where(eq(portalProjectsTable.id, parsed.data.projectId));
    projectTitle = proj?.title ?? "General";
  }

  await notifyAdmin(
    `[Portal] New message from ${req.portalUser!.name || req.portalUser!.email}`,
    emailNewMessage(
      "Admin",
      req.portalUser!.name || req.portalUser!.email,
      projectTitle,
      parsed.data.body.slice(0, 200),
    ),
  );

  res.status(201).json(message);
});

router.patch("/portal/messages/:id/read", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  await db
    .update(portalMessagesTable)
    .set({ isRead: true })
    .where(
      and(
        eq(portalMessagesTable.id, id),
        eq(portalMessagesTable.portalUserId, req.portalUser!.id),
      ),
    );
  res.json({ ok: true });
});

// ── Revision Requests ─────────────────────────────────────────────────────

router.get("/portal/revisions", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(portalRevisionRequestsTable)
    .where(eq(portalRevisionRequestsTable.portalUserId, req.portalUser!.id))
    .orderBy(desc(portalRevisionRequestsTable.createdAt));
  res.json(rows);
});

router.post("/portal/revisions", async (req, res): Promise<void> => {
  const schema = z.object({
    projectId: z.number().int(),
    description: z.string().min(1),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  // Verify project belongs to user
  const [project] = await db
    .select()
    .from(portalProjectsTable)
    .where(
      and(
        eq(portalProjectsTable.id, parsed.data.projectId),
        eq(portalProjectsTable.portalUserId, req.portalUser!.id),
      ),
    );
  if (!project) { res.status(404).json({ error: "Project not found" }); return; }

  const [revision] = await db
    .insert(portalRevisionRequestsTable)
    .values({
      projectId: parsed.data.projectId,
      portalUserId: req.portalUser!.id,
      description: parsed.data.description,
    })
    .returning();

  // Notify admin
  await notifyAdmin(
    `[Portal] Revision request: ${project.title}`,
    emailRevisionSubmitted(
      req.portalUser!.name || req.portalUser!.email,
      project.title,
      parsed.data.description.slice(0, 300),
    ),
  );

  res.status(201).json(revision);
});

// ── Support Tickets ───────────────────────────────────────────────────────

router.get("/portal/tickets", async (req, res): Promise<void> => {
  const tickets = await db
    .select()
    .from(portalSupportTicketsTable)
    .where(eq(portalSupportTicketsTable.portalUserId, req.portalUser!.id))
    .orderBy(desc(portalSupportTicketsTable.createdAt));
  res.json(tickets);
});

router.post("/portal/tickets", async (req, res): Promise<void> => {
  const schema = z.object({
    subject: z.string().min(1),
    body: z.string().min(1),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [ticket] = await db
    .insert(portalSupportTicketsTable)
    .values({
      portalUserId: req.portalUser!.id,
      subject: parsed.data.subject,
      body: parsed.data.body,
    })
    .returning();

  await notifyAdmin(
    `[Portal] New support ticket: ${parsed.data.subject}`,
    `<p>New support ticket from <strong>${req.portalUser!.name || req.portalUser!.email}</strong>.</p>
     <p><strong>Subject:</strong> ${parsed.data.subject}</p>
     <p>${parsed.data.body}</p>`,
  );

  res.status(201).json(ticket);
});

router.get("/portal/tickets/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [ticket] = await db
    .select()
    .from(portalSupportTicketsTable)
    .where(
      and(
        eq(portalSupportTicketsTable.id, id),
        eq(portalSupportTicketsTable.portalUserId, req.portalUser!.id),
      ),
    );
  if (!ticket) { res.status(404).json({ error: "Ticket not found" }); return; }

  const replies = await db
    .select()
    .from(portalSupportRepliesTable)
    .where(eq(portalSupportRepliesTable.ticketId, id))
    .orderBy(portalSupportRepliesTable.createdAt);

  res.json({ ...ticket, replies });
});

router.post("/portal/tickets/:id/replies", async (req, res): Promise<void> => {
  const ticketId = parseInt(req.params.id, 10);
  if (isNaN(ticketId)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [ticket] = await db
    .select()
    .from(portalSupportTicketsTable)
    .where(
      and(
        eq(portalSupportTicketsTable.id, ticketId),
        eq(portalSupportTicketsTable.portalUserId, req.portalUser!.id),
      ),
    );
  if (!ticket) { res.status(404).json({ error: "Ticket not found" }); return; }

  const schema = z.object({ body: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [reply] = await db
    .insert(portalSupportRepliesTable)
    .values({ ticketId, sender: "client", body: parsed.data.body })
    .returning();

  await notifyAdmin(
    `[Portal] Reply on ticket: ${ticket.subject}`,
    `<p><strong>${req.portalUser!.name || req.portalUser!.email}</strong> replied to their ticket.</p>
     <p><strong>Subject:</strong> ${ticket.subject}</p>
     <p>${parsed.data.body}</p>`,
  );

  res.status(201).json(reply);
});

router.patch("/portal/tickets/:id/close", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [ticket] = await db
    .update(portalSupportTicketsTable)
    .set({ status: "closed", updatedAt: new Date() })
    .where(
      and(
        eq(portalSupportTicketsTable.id, id),
        eq(portalSupportTicketsTable.portalUserId, req.portalUser!.id),
      ),
    )
    .returning();
  if (!ticket) { res.status(404).json({ error: "Ticket not found" }); return; }
  res.json(ticket);
});

// ── Invoices ──────────────────────────────────────────────────────────────

router.get("/portal/invoices", async (req, res): Promise<void> => {
  const invoices = await db
    .select()
    .from(portalInvoicesTable)
    .where(eq(portalInvoicesTable.portalUserId, req.portalUser!.id))
    .orderBy(desc(portalInvoicesTable.createdAt));
  res.json(invoices);
});

// ── Notifications ─────────────────────────────────────────────────────────

router.get("/portal/notifications", async (req, res): Promise<void> => {
  const notifications = await db
    .select()
    .from(portalNotificationsTable)
    .where(eq(portalNotificationsTable.portalUserId, req.portalUser!.id))
    .orderBy(desc(portalNotificationsTable.createdAt));
  res.json(notifications);
});

router.patch("/portal/notifications/:id/read", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  await db
    .update(portalNotificationsTable)
    .set({ isRead: true })
    .where(
      and(
        eq(portalNotificationsTable.id, id),
        eq(portalNotificationsTable.portalUserId, req.portalUser!.id),
      ),
    );
  res.json({ ok: true });
});

router.patch("/portal/notifications/read-all", async (req, res): Promise<void> => {
  await db
    .update(portalNotificationsTable)
    .set({ isRead: true })
    .where(eq(portalNotificationsTable.portalUserId, req.portalUser!.id));
  res.json({ ok: true });
});

export default router;
