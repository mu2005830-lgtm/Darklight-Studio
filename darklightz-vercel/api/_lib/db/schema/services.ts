import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const servicesTable = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  // Phase 2 — services system
  category: text("category").notNull().default("website-services"),
  heroImage: text("hero_image").notNull().default(""),
  price: text("price").notNull().default(""),
  deliveryTime: text("delivery_time").notNull().default(""),
  featuredBadge: text("featured_badge").notNull().default(""),
  whatsIncluded: text("whats_included").array().notNull().default([]),
  processSteps: text("process_steps").array().notNull().default([]),
  ctaText: text("cta_text").notNull().default("Get Started"),
});

export const insertServiceSchema = createInsertSchema(servicesTable).omit({
  id: true,
});
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof servicesTable.$inferSelect;
