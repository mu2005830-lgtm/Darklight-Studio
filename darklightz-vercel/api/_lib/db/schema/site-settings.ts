import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").notNull().default("Darklightz Studio"),
  tagline: text("tagline").notNull().default(""),
  contactEmail: text("contact_email").notNull().default(""),
  contactPhone: text("contact_phone").notNull().default(""),
  contactAddress: text("contact_address").notNull().default(""),
  seoTitle: text("seo_title").notNull().default(""),
  seoDescription: text("seo_description").notNull().default(""),
  ogImageUrl: text("og_image_url").notNull().default(""),
  faviconUrl: text("favicon_url").notNull().default(""),
  logoText: text("logo_text").notNull().default("DARKLIGHTZ"),
  logoUrl: text("logo_url").notNull().default(""),
  primaryColor: text("primary_color").notNull().default("#ffffff"),
  accentColor: text("accent_color").notNull().default("#ffffff"),
  fontHeading: text("font_heading").notNull().default("Syne"),
  fontBody: text("font_body").notNull().default("Plus Jakarta Sans"),
  heroTitle: text("hero_title").notNull().default(""),
  heroSubtitle: text("hero_subtitle").notNull().default(""),
  heroCtaText: text("hero_cta_text").notNull().default(""),
  heroCtaUrl: text("hero_cta_url").notNull().default(""),
  whatsappNumber: text("whatsapp_number").notNull().default("+923351468615"),
  studioStoryImageUrl: text("studio_story_image_url").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type SiteSettings = typeof siteSettingsTable.$inferSelect;
