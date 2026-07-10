import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const testimonialsTable = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  quote: text("quote").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertTestimonialSchema = createInsertSchema(
  testimonialsTable,
).omit({ id: true });
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonialsTable.$inferSelect;
