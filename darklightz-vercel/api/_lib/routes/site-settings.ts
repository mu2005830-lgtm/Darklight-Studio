import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, siteSettingsTable } from "../db/index";
import { SiteSettingsResponse, UpdateSiteSettingsBody } from "../api-zod/index";
import { requireAdminKey } from "../lib/auth";

const router: IRouter = Router();

// Default shape returned when no row exists yet
const DEFAULT_SETTINGS = {
  id: 0,
  siteName: "Darklightz Studio",
  tagline: "",
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
  seoTitle: "Darklightz Studio",
  seoDescription:
    "Darklightz Studio — end-to-end design and engineering. We build products from blank canvas to production scale.",
  ogImageUrl: "",
  faviconUrl: "",
  logoText: "DARKLIGHTZ",
  logoUrl: "",
  primaryColor: "#ffffff",
  accentColor: "#ffffff",
  fontHeading: "Syne",
  fontBody: "Plus Jakarta Sans",
  heroTitle: "",
  heroSubtitle: "",
  heroCtaText: "",
  heroCtaUrl: "",
  updatedAt: new Date(),
};

router.get("/site-settings", async (_req, res): Promise<void> => {
  const [settings] = await db.select().from(siteSettingsTable).limit(1);
  res.json(SiteSettingsResponse.parse(settings ?? DEFAULT_SETTINGS));
});

router.put("/admin/site-settings", requireAdminKey, async (req, res): Promise<void> => {
  const parsed = UpdateSiteSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db.select().from(siteSettingsTable).limit(1);

  if (!existing) {
    const [row] = await db
      .insert(siteSettingsTable)
      .values({ ...parsed.data } as any)
      .returning();
    res.json(SiteSettingsResponse.parse(row));
    return;
  }

  const [row] = await db
    .update(siteSettingsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(siteSettingsTable.id, existing.id))
    .returning();

  res.json(SiteSettingsResponse.parse(row));
});

export default router;
