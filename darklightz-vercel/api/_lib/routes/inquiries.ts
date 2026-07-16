import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, inquiriesTable } from "../db/index.js";
import { requireAdminKey } from "../lib/auth.js";
import * as zod from "zod";

const router: IRouter = Router();

const InquiryBody = zod.object({
  name: zod.string().min(2),
  email: zod.string().email(),
  phone: zod.string().optional(),
  company: zod.string().optional(),
  serviceSlug: zod.string().min(1),
  serviceTitle: zod.string().min(1),
  price: zod.string().optional(),
  budget: zod.string().optional(),
  description: zod.string().min(5),
});

// Public: submit an inquiry
router.post("/inquiries", async (req, res): Promise<void> => {
  const parsed = InquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db
    .insert(inquiriesTable)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? "",
      company: parsed.data.company ?? "",
      serviceSlug: parsed.data.serviceSlug,
      serviceTitle: parsed.data.serviceTitle,
      price: parsed.data.price ?? "",
      budget: parsed.data.budget ?? "",
      description: parsed.data.description,
      status: "new",
    })
    .returning();
  res.status(201).json(row);
});

// Admin: list all inquiries
router.get("/admin/inquiries", requireAdminKey, async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(inquiriesTable)
    .orderBy(inquiriesTable.createdAt);
  res.json(rows);
});

// Admin: update inquiry status
router.patch(
  "/admin/inquiries/:id/status",
  requireAdminKey,
  async (req, res): Promise<void> => {
    const id = Number(req.params.id);
    const { status } = req.body as { status: string };
    if (!status) {
      res.status(400).json({ error: "status required" });
      return;
    }
    const [row] = await db
      .update(inquiriesTable)
      .set({ status })
      .where(eq(inquiriesTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Inquiry not found" });
      return;
    }
    res.json(row);
  }
);

export default router;
