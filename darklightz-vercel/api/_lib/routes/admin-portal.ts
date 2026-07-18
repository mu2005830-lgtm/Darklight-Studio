/**
 * Admin Portal CRM routes — all require x-admin-key header.
 * Provides full CRUD over portal users, projects, milestones, files,
 * messages, revisions, tickets, and invoices.
 */
import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
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
import { requireAdminKey } from "../lib/auth.js";
import {
  notifyClient,
  emailNewMessage,
  emailStatusChanged,
  emailProjectCompleted,
} from "../lib/email.js";
import { z } from "zod/v4";

const router: IRouter = Router();

// Apply admin key to all /admin/portal-* routes
router.use("/admin/portal", requireAdminKey);

// ── Portal Users (CRM) ────────────────────────────────────────────────────

router.get("/admin/portal/clients", async (_req, res): Promise<void> => {
  const clients = await db
    .select()
    .from(portalUsersTable)
    .orderBy(desc(portalUsersTable.createdAt));
  res.json(clients);
});

router.get("/admin/portal/clients/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [client] = await db
    .select()
    .from(portalUsersTable)
    .where(eq(portalUsersTable.id, id));
  if (!client) { res.status(404).json({ error: "Client not found" }); return; }

  const projects = await db
    .select()
    .from(portalProjectsTable)
    .where(eq(portalProjectsTable.portalUserId, id))
    .orderBy(desc(portalProjectsTable.createdAt));

  res.json({ ...client, projects });
});

router.patch("/admin/portal/clients/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const schema = z.object({
    name: z.string().optional(),
    company: z.string().optional(),
    phone: z.string().optional(),
    avatarUrl: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const updates: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
  const [updated] = await db
    .update(portalUsersTable)
    .set(updates)
    .where(eq(portalUsersTable.id, id))
    .returning();
  if (!updated) { res.status(404).json({ error: "Client not found" }); return; }
  res.json(updated);
});

// ── Projects ──────────────────────────────────────────────────────────────

router.get("/admin/portal/projects", async (_req, res): Promise<void> => {
  const projects = await db
    .select()
    .from(portalProjectsTable)
    .orderBy(desc(portalProjectsTable.createdAt));
  res.json(projects);
});

router.post("/admin/portal/projects", async (req, res): Promise<void> => {
  const schema = z.object({
    portalUserId: z.number().int(),
    title: z.string().min(1),
    orderId: z.string().optional(),
    serviceName: z.string().optional(),
    assignedTeamMember: z.string().optional(),
    status: z.string().optional(),
    progressPct: z.number().int().min(0).max(100).optional(),
    startDate: z.string().optional(),
    estCompletionDate: z.string().optional(),
    latestUpdate: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [project] = await db
    .insert(portalProjectsTable)
    .values({
      portalUserId: parsed.data.portalUserId,
      title: parsed.data.title,
      orderId: parsed.data.orderId ?? "",
      serviceName: parsed.data.serviceName ?? "",
      assignedTeamMember: parsed.data.assignedTeamMember ?? "",
      status: parsed.data.status ?? "pending",
      progressPct: parsed.data.progressPct ?? 0,
      startDate: parsed.data.startDate ?? "",
      estCompletionDate: parsed.data.estCompletionDate ?? "",
      latestUpdate: parsed.data.latestUpdate ?? "",
    })
    .returning();

  res.status(201).json(project);
});

router.get("/admin/portal/projects/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [project] = await db
    .select()
    .from(portalProjectsTable)
    .where(eq(portalProjectsTable.id, id));
  if (!project) { res.status(404).json({ error: "Project not found" }); return; }

  const [milestones, files, messages, revisions] = await Promise.all([
    db.select().from(portalMilestonesTable).where(eq(portalMilestonesTable.projectId, id)).orderBy(portalMilestonesTable.sortOrder),
    db.select().from(portalProjectFilesTable).where(eq(portalProjectFilesTable.projectId, id)).orderBy(desc(portalProjectFilesTable.createdAt)),
    db.select().from(portalMessagesTable).where(eq(portalMessagesTable.projectId, id)).orderBy(desc(portalMessagesTable.createdAt)),
    db.select().from(portalRevisionRequestsTable).where(eq(portalRevisionRequestsTable.projectId, id)).orderBy(desc(portalRevisionRequestsTable.createdAt)),
  ]);

  res.json({ ...project, milestones, files, messages, revisions });
});

router.patch("/admin/portal/projects/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const schema = z.object({
    title: z.string().optional(),
    orderId: z.string().optional(),
    serviceName: z.string().optional(),
    assignedTeamMember: z.string().optional(),
    status: z.string().optional(),
    progressPct: z.number().int().min(0).max(100).optional(),
    startDate: z.string().optional(),
    estCompletionDate: z.string().optional(),
    latestUpdate: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const prevRows = await db.select().from(portalProjectsTable).where(eq(portalProjectsTable.id, id));
  const prev = prevRows[0];
  if (!prev) { res.status(404).json({ error: "Project not found" }); return; }

  const updates: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
  const [updated] = await db
    .update(portalProjectsTable)
    .set(updates)
    .where(eq(portalProjectsTable.id, id))
    .returning();

  // Get client info for notifications
  const [client] = await db.select().from(portalUsersTable).where(eq(portalUsersTable.id, updated.portalUserId));

  // Status change notifications
  if (parsed.data.status && parsed.data.status !== prev.status) {
    await db.insert(portalNotificationsTable).values({
      portalUserId: updated.portalUserId,
      type: "progress",
      title: "Project status updated",
      body: `Your project "${updated.title}" status changed to ${parsed.data.status.replace(/_/g, " ")}.`,
    });

    if (client) {
      if (parsed.data.status === "completed") {
        await notifyClient(client.email, `[Darklightz] "${updated.title}" is complete!`, emailProjectCompleted(client.name, updated.title));
      } else {
        await notifyClient(client.email, `[Darklightz] Project status update: ${updated.title}`, emailStatusChanged(client.name, updated.title, parsed.data.status));
      }
    }
  }

  // Progress update notification
  if (parsed.data.progressPct !== undefined && parsed.data.progressPct !== prev.progressPct) {
    await db.insert(portalNotificationsTable).values({
      portalUserId: updated.portalUserId,
      type: "progress",
      title: "Progress updated",
      body: `"${updated.title}" is now ${parsed.data.progressPct}% complete.`,
    });
  }

  res.json(updated);
});

// ── Milestones ────────────────────────────────────────────────────────────

router.post("/admin/portal/projects/:id/milestones", async (req, res): Promise<void> => {
  const projectId = parseInt(req.params.id, 10);
  if (isNaN(projectId)) { res.status(400).json({ error: "Invalid id" }); return; }

  const schema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    status: z.string().optional(),
    dueDate: z.string().optional(),
    sortOrder: z.number().int().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [milestone] = await db
    .insert(portalMilestonesTable)
    .values({
      projectId,
      title: parsed.data.title,
      description: parsed.data.description ?? "",
      status: parsed.data.status ?? "pending",
      dueDate: parsed.data.dueDate ?? "",
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    .returning();
  res.status(201).json(milestone);
});

router.patch("/admin/portal/milestones/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const schema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.string().optional(),
    dueDate: z.string().optional(),
    sortOrder: z.number().int().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const updates: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.status === "complete") updates.completedAt = new Date();

  const [updated] = await db
    .update(portalMilestonesTable)
    .set(updates)
    .where(eq(portalMilestonesTable.id, id))
    .returning();
  if (!updated) { res.status(404).json({ error: "Milestone not found" }); return; }
  res.json(updated);
});

router.delete("/admin/portal/milestones/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [deleted] = await db
    .delete(portalMilestonesTable)
    .where(eq(portalMilestonesTable.id, id))
    .returning();
  if (!deleted) { res.status(404).json({ error: "Milestone not found" }); return; }
  res.status(204).send();
});

// ── Project Files ─────────────────────────────────────────────────────────

router.post("/admin/portal/projects/:id/files", async (req, res): Promise<void> => {
  const projectId = parseInt(req.params.id, 10);
  if (isNaN(projectId)) { res.status(400).json({ error: "Invalid id" }); return; }

  const schema = z.object({
    name: z.string().min(1),
    url: z.string().min(1),
    sizeBytes: z.number().int().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [file] = await db
    .insert(portalProjectFilesTable)
    .values({
      projectId,
      name: parsed.data.name,
      url: parsed.data.url,
      sizeBytes: parsed.data.sizeBytes ?? 0,
      uploadedBy: "admin",
    })
    .returning();

  // Notify client
  const [project] = await db.select().from(portalProjectsTable).where(eq(portalProjectsTable.id, projectId));
  if (project) {
    await db.insert(portalNotificationsTable).values({
      portalUserId: project.portalUserId,
      type: "info",
      title: "New file available",
      body: `A new file "${parsed.data.name}" has been uploaded for "${project.title}".`,
    });
  }

  res.status(201).json(file);
});

router.delete("/admin/portal/files/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [deleted] = await db
    .delete(portalProjectFilesTable)
    .where(eq(portalProjectFilesTable.id, id))
    .returning();
  if (!deleted) { res.status(404).json({ error: "File not found" }); return; }
  res.status(204).send();
});

// ── Messages ──────────────────────────────────────────────────────────────

router.get("/admin/portal/messages", async (_req, res): Promise<void> => {
  const messages = await db
    .select()
    .from(portalMessagesTable)
    .orderBy(desc(portalMessagesTable.createdAt));
  res.json(messages);
});

router.post("/admin/portal/messages", async (req, res): Promise<void> => {
  const schema = z.object({
    portalUserId: z.number().int(),
    projectId: z.number().int().optional(),
    body: z.string().min(1),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [message] = await db
    .insert(portalMessagesTable)
    .values({
      portalUserId: parsed.data.portalUserId,
      projectId: parsed.data.projectId ?? null,
      sender: "admin",
      body: parsed.data.body,
    })
    .returning();

  // Create notification + email client
  const [client] = await db.select().from(portalUsersTable).where(eq(portalUsersTable.id, parsed.data.portalUserId));

  let projectTitle = "General";
  if (parsed.data.projectId) {
    const [proj] = await db.select().from(portalProjectsTable).where(eq(portalProjectsTable.id, parsed.data.projectId));
    projectTitle = proj?.title ?? "General";
  }

  if (client) {
    await db.insert(portalNotificationsTable).values({
      portalUserId: parsed.data.portalUserId,
      type: "message",
      title: "New message from Darklightz",
      body: parsed.data.body.slice(0, 200),
    });
    await notifyClient(
      client.email,
      `[Darklightz] New message: ${projectTitle}`,
      emailNewMessage(client.name || client.email, "Darklightz Studio", projectTitle, parsed.data.body.slice(0, 200)),
    );
  }

  res.status(201).json(message);
});

router.patch("/admin/portal/messages/:id/read", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  await db.update(portalMessagesTable).set({ isRead: true }).where(eq(portalMessagesTable.id, id));
  res.json({ ok: true });
});

// ── Revision Requests ─────────────────────────────────────────────────────

router.get("/admin/portal/revisions", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(portalRevisionRequestsTable)
    .orderBy(desc(portalRevisionRequestsTable.createdAt));
  res.json(rows);
});

router.patch("/admin/portal/revisions/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const schema = z.object({
    status: z.enum(["pending", "in_progress", "completed"]),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [updated] = await db
    .update(portalRevisionRequestsTable)
    .set({ status: parsed.data.status, updatedAt: new Date() })
    .where(eq(portalRevisionRequestsTable.id, id))
    .returning();
  if (!updated) { res.status(404).json({ error: "Revision not found" }); return; }
  res.json(updated);
});

// ── Support Tickets ───────────────────────────────────────────────────────

router.get("/admin/portal/tickets", async (_req, res): Promise<void> => {
  const tickets = await db
    .select()
    .from(portalSupportTicketsTable)
    .orderBy(desc(portalSupportTicketsTable.createdAt));
  res.json(tickets);
});

router.get("/admin/portal/tickets/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [ticket] = await db.select().from(portalSupportTicketsTable).where(eq(portalSupportTicketsTable.id, id));
  if (!ticket) { res.status(404).json({ error: "Ticket not found" }); return; }

  const replies = await db.select().from(portalSupportRepliesTable).where(eq(portalSupportRepliesTable.ticketId, id)).orderBy(portalSupportRepliesTable.createdAt);
  res.json({ ...ticket, replies });
});

router.patch("/admin/portal/tickets/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const schema = z.object({
    status: z.enum(["open", "in_progress", "closed"]),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [updated] = await db
    .update(portalSupportTicketsTable)
    .set({ status: parsed.data.status, updatedAt: new Date() })
    .where(eq(portalSupportTicketsTable.id, id))
    .returning();
  if (!updated) { res.status(404).json({ error: "Ticket not found" }); return; }
  res.json(updated);
});

router.post("/admin/portal/tickets/:id/replies", async (req, res): Promise<void> => {
  const ticketId = parseInt(req.params.id, 10);
  if (isNaN(ticketId)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [ticket] = await db.select().from(portalSupportTicketsTable).where(eq(portalSupportTicketsTable.id, ticketId));
  if (!ticket) { res.status(404).json({ error: "Ticket not found" }); return; }

  const schema = z.object({ body: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [reply] = await db
    .insert(portalSupportRepliesTable)
    .values({ ticketId, sender: "admin", body: parsed.data.body })
    .returning();

  const [client] = await db.select().from(portalUsersTable).where(eq(portalUsersTable.id, ticket.portalUserId));
  if (client) {
    await db.insert(portalNotificationsTable).values({
      portalUserId: ticket.portalUserId,
      type: "ticket",
      title: "Reply on your ticket",
      body: parsed.data.body.slice(0, 200),
    });
    await notifyClient(
      client.email,
      `[Darklightz] Reply to your ticket: ${ticket.subject}`,
      `<p>Darklightz Studio replied to your support ticket.</p>
       <p><strong>Subject:</strong> ${ticket.subject}</p>
       <p>${parsed.data.body}</p>`,
    );
  }

  res.status(201).json(reply);
});

// ── Invoices ──────────────────────────────────────────────────────────────

router.get("/admin/portal/invoices", async (_req, res): Promise<void> => {
  const invoices = await db
    .select()
    .from(portalInvoicesTable)
    .orderBy(desc(portalInvoicesTable.createdAt));
  res.json(invoices);
});

router.post("/admin/portal/invoices", async (req, res): Promise<void> => {
  const schema = z.object({
    portalUserId: z.number().int(),
    projectId: z.number().int().optional(),
    title: z.string().min(1),
    amountCents: z.number().int().min(0),
    currency: z.string().optional(),
    status: z.string().optional(),
    issuedAt: z.string().optional(),
    dueAt: z.string().optional(),
    invoiceUrl: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [invoice] = await db
    .insert(portalInvoicesTable)
    .values({
      portalUserId: parsed.data.portalUserId,
      projectId: parsed.data.projectId ?? null,
      title: parsed.data.title,
      amountCents: parsed.data.amountCents,
      currency: parsed.data.currency ?? "USD",
      status: parsed.data.status ?? "draft",
      issuedAt: parsed.data.issuedAt ?? "",
      dueAt: parsed.data.dueAt ?? "",
      invoiceUrl: parsed.data.invoiceUrl ?? "",
    })
    .returning();

  // Notify client if invoice is sent
  if (parsed.data.status === "sent") {
    const [client] = await db.select().from(portalUsersTable).where(eq(portalUsersTable.id, parsed.data.portalUserId));
    if (client) {
      await db.insert(portalNotificationsTable).values({
        portalUserId: parsed.data.portalUserId,
        type: "invoice",
        title: "New invoice",
        body: `Invoice "${parsed.data.title}" — ${(parsed.data.amountCents / 100).toFixed(2)} ${parsed.data.currency ?? "USD"}`,
      });
      await notifyClient(
        client.email,
        `[Darklightz] Invoice: ${parsed.data.title}`,
        `<p>A new invoice has been issued for you.</p>
         <p><strong>Title:</strong> ${parsed.data.title}</p>
         <p><strong>Amount:</strong> ${(parsed.data.amountCents / 100).toFixed(2)} ${parsed.data.currency ?? "USD"}</p>`,
      );
    }
  }

  res.status(201).json(invoice);
});

router.patch("/admin/portal/invoices/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const schema = z.object({
    title: z.string().optional(),
    amountCents: z.number().int().optional(),
    currency: z.string().optional(),
    status: z.string().optional(),
    issuedAt: z.string().optional(),
    dueAt: z.string().optional(),
    paidAt: z.string().optional(),
    invoiceUrl: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [updated] = await db
    .update(portalInvoicesTable)
    .set(parsed.data as Record<string, unknown>)
    .where(eq(portalInvoicesTable.id, id))
    .returning();
  if (!updated) { res.status(404).json({ error: "Invoice not found" }); return; }
  res.json(updated);
});

export default router;
