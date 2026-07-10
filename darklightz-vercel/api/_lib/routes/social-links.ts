import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, socialLinksTable } from "../db/index.js";
import {
  ListSocialLinksResponse,
  SocialLinkItem,
  CreateSocialLinkBody,
  UpdateSocialLinkParams,
  UpdateSocialLinkBody,
  DeleteSocialLinkParams,
} from "../api-zod/index.js";
import { requireAdminKey } from "../lib/auth.js";
import { rejectEmptyUpdate } from "../lib/validate-update.js";

const router: IRouter = Router();

router.get("/social-links", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(socialLinksTable)
    .orderBy(socialLinksTable.sortOrder);
  res.json(ListSocialLinksResponse.parse(rows));
});

router.post("/admin/social-links", requireAdminKey, async (req, res): Promise<void> => {
  const parsed = CreateSocialLinkBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db
    .insert(socialLinksTable)
    .values({
      platform: parsed.data.platform,
      url: parsed.data.url,
      icon: parsed.data.icon ?? "",
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    .returning();
  res.status(201).json(SocialLinkItem.parse(row));
});

router.put("/admin/social-links/:id", requireAdminKey, async (req, res): Promise<void> => {
  const params = UpdateSocialLinkParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateSocialLinkBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  if (rejectEmptyUpdate(parsed.data, res)) return;
  const [row] = await db
    .update(socialLinksTable)
    .set(parsed.data)
    .where(eq(socialLinksTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Social link not found" });
    return;
  }
  res.json(SocialLinkItem.parse(row));
});

router.delete("/admin/social-links/:id", requireAdminKey, async (req, res): Promise<void> => {
  const params = DeleteSocialLinkParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .delete(socialLinksTable)
    .where(eq(socialLinksTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Social link not found" });
    return;
  }
  res.status(204).send();
});

export default router;
