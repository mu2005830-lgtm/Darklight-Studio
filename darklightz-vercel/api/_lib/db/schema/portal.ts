import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// ── Portal Users ──────────────────────────────────────────────────────────
// Linked to Supabase Auth — auto-provisioned on first JWT-authenticated call.
export const portalUsersTable = pgTable("portal_users", {
  id: serial("id").primaryKey(),
  supabaseUserId: text("supabase_user_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name").notNull().default(""),
  company: text("company").notNull().default(""),
  phone: text("phone").notNull().default(""),
  avatarUrl: text("avatar_url").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Projects ──────────────────────────────────────────────────────────────
// Created by admin, assigned to a portal user.
// status: pending | active | in_progress | completed | cancelled
export const portalProjectsTable = pgTable("portal_projects", {
  id: serial("id").primaryKey(),
  portalUserId: integer("portal_user_id")
    .notNull()
    .references(() => portalUsersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  orderId: text("order_id").notNull().default(""),
  serviceName: text("service_name").notNull().default(""),
  assignedTeamMember: text("assigned_team_member").notNull().default(""),
  status: text("status").notNull().default("pending"),
  progressPct: integer("progress_pct").notNull().default(0),
  startDate: text("start_date").notNull().default(""),
  estCompletionDate: text("est_completion_date").notNull().default(""),
  latestUpdate: text("latest_update").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Milestones ────────────────────────────────────────────────────────────
export const portalMilestonesTable = pgTable("portal_milestones", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => portalProjectsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  status: text("status").notNull().default("pending"), // pending | complete
  dueDate: text("due_date").notNull().default(""),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ── Project Files (deliverables) ──────────────────────────────────────────
export const portalProjectFilesTable = pgTable("portal_project_files", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => portalProjectsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  sizeBytes: integer("size_bytes").notNull().default(0),
  uploadedBy: text("uploaded_by").notNull().default("admin"), // admin | client
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Messages ──────────────────────────────────────────────────────────────
export const portalMessagesTable = pgTable("portal_messages", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => portalProjectsTable.id, {
    onDelete: "cascade",
  }),
  portalUserId: integer("portal_user_id")
    .notNull()
    .references(() => portalUsersTable.id, { onDelete: "cascade" }),
  sender: text("sender").notNull().default("client"), // admin | client
  body: text("body").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Revision Requests ─────────────────────────────────────────────────────
// status: pending | in_progress | completed
export const portalRevisionRequestsTable = pgTable("portal_revision_requests", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => portalProjectsTable.id, { onDelete: "cascade" }),
  portalUserId: integer("portal_user_id")
    .notNull()
    .references(() => portalUsersTable.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Support Tickets ───────────────────────────────────────────────────────
// status: open | in_progress | closed
export const portalSupportTicketsTable = pgTable("portal_support_tickets", {
  id: serial("id").primaryKey(),
  portalUserId: integer("portal_user_id")
    .notNull()
    .references(() => portalUsersTable.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Support Replies ───────────────────────────────────────────────────────
export const portalSupportRepliesTable = pgTable("portal_support_replies", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id")
    .notNull()
    .references(() => portalSupportTicketsTable.id, { onDelete: "cascade" }),
  sender: text("sender").notNull().default("admin"), // admin | client
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Invoices ──────────────────────────────────────────────────────────────
// status: draft | sent | paid | overdue
export const portalInvoicesTable = pgTable("portal_invoices", {
  id: serial("id").primaryKey(),
  portalUserId: integer("portal_user_id")
    .notNull()
    .references(() => portalUsersTable.id, { onDelete: "cascade" }),
  projectId: integer("project_id").references(() => portalProjectsTable.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  amountCents: integer("amount_cents").notNull().default(0),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("draft"),
  issuedAt: text("issued_at").notNull().default(""),
  dueAt: text("due_at").notNull().default(""),
  paidAt: text("paid_at").notNull().default(""),
  invoiceUrl: text("invoice_url").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Notifications ─────────────────────────────────────────────────────────
// type: info | progress | message | revision | ticket | invoice
export const portalNotificationsTable = pgTable("portal_notifications", {
  id: serial("id").primaryKey(),
  portalUserId: integer("portal_user_id")
    .notNull()
    .references(() => portalUsersTable.id, { onDelete: "cascade" }),
  type: text("type").notNull().default("info"),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  isRead: boolean("is_read").notNull().default(false),
  relatedId: integer("related_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Insert schemas ────────────────────────────────────────────────────────
export const insertPortalUserSchema = createInsertSchema(portalUsersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertPortalProjectSchema = createInsertSchema(portalProjectsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertPortalMilestoneSchema = createInsertSchema(portalMilestonesTable).omit({
  id: true,
});
export const insertPortalProjectFileSchema = createInsertSchema(portalProjectFilesTable).omit({
  id: true,
  createdAt: true,
});
export const insertPortalMessageSchema = createInsertSchema(portalMessagesTable).omit({
  id: true,
  createdAt: true,
});
export const insertPortalRevisionSchema = createInsertSchema(portalRevisionRequestsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertPortalTicketSchema = createInsertSchema(portalSupportTicketsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertPortalReplySchema = createInsertSchema(portalSupportRepliesTable).omit({
  id: true,
  createdAt: true,
});
export const insertPortalInvoiceSchema = createInsertSchema(portalInvoicesTable).omit({
  id: true,
  createdAt: true,
});
export const insertPortalNotificationSchema = createInsertSchema(portalNotificationsTable).omit({
  id: true,
  createdAt: true,
});

// ── Types ─────────────────────────────────────────────────────────────────
export type PortalUser = typeof portalUsersTable.$inferSelect;
export type PortalProject = typeof portalProjectsTable.$inferSelect;
export type PortalMilestone = typeof portalMilestonesTable.$inferSelect;
export type PortalProjectFile = typeof portalProjectFilesTable.$inferSelect;
export type PortalMessage = typeof portalMessagesTable.$inferSelect;
export type PortalRevisionRequest = typeof portalRevisionRequestsTable.$inferSelect;
export type PortalSupportTicket = typeof portalSupportTicketsTable.$inferSelect;
export type PortalSupportReply = typeof portalSupportRepliesTable.$inferSelect;
export type PortalInvoice = typeof portalInvoicesTable.$inferSelect;
export type PortalNotification = typeof portalNotificationsTable.$inferSelect;

// For Zod inference
export type InsertPortalUser = z.infer<typeof insertPortalUserSchema>;
export type InsertPortalProject = z.infer<typeof insertPortalProjectSchema>;
