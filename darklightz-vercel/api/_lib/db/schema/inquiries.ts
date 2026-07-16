import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const inquiriesTable = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  company: text("company").notNull().default(""),
  serviceSlug: text("service_slug").notNull(),
  serviceTitle: text("service_title").notNull(),
  price: text("price").notNull().default(""),
  budget: text("budget").notNull().default(""),
  description: text("description").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertInquirySchema = createInsertSchema(inquiriesTable).omit({
  id: true,
  createdAt: true,
});
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiriesTable.$inferSelect;
