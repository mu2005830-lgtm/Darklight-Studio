import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, faqItemsTable } from "../db/index.js";
import {
  ListFaqItemsResponse,
  FaqItemItem,
  CreateFaqItemBody,
  UpdateFaqItemParams,
  UpdateFaqItemBody,
  DeleteFaqItemParams,
} from "../api-zod/index.js";
import { requireAdminKey } from "../lib/auth.js";
import { rejectEmptyUpdate } from "../lib/validate-update.js";

const router: IRouter = Router();

router.get("/faq", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(faqItemsTable)
    .orderBy(faqItemsTable.sortOrder);
  res.json(ListFaqItemsResponse.parse(rows));
});

router.post("/admin/faq", requireAdminKey, async (req, res): Promise<void> => {
  const parsed = CreateFaqItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db
    .insert(faqItemsTable)
    .values({
      question: parsed.data.question,
      answer: parsed.data.answer,
      category: parsed.data.category ?? "",
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    .returning();
  res.status(201).json(FaqItemItem.parse(row));
});

router.put("/admin/faq/:id", requireAdminKey, async (req, res): Promise<void> => {
  const params = UpdateFaqItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateFaqItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  if (rejectEmptyUpdate(parsed.data, res)) return;
  const [row] = await db
    .update(faqItemsTable)
    .set(parsed.data)
    .where(eq(faqItemsTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "FAQ item not found" });
    return;
  }
  res.json(FaqItemItem.parse(row));
});

router.delete("/admin/faq/:id", requireAdminKey, async (req, res): Promise<void> => {
  const params = DeleteFaqItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .delete(faqItemsTable)
    .where(eq(faqItemsTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "FAQ item not found" });
    return;
  }
  res.status(204).send();
});

export default router;
