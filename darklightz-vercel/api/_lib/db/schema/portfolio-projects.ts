import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const portfolioProjectsTable = pgTable("portfolio_projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  summary: text("summary").notNull(),
  imageUrl: text("image_url").notNull(),
  tags: text("tags").array().notNull().default([]),
  year: integer("year").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertPortfolioProjectSchema = createInsertSchema(
  portfolioProjectsTable,
).omit({ id: true });
export type InsertPortfolioProject = z.infer<
  typeof insertPortfolioProjectSchema
>;
export type PortfolioProject = typeof portfolioProjectsTable.$inferSelect;
