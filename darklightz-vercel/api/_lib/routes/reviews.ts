import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { reviewsTable } from "../db/schema/reviews.js";
import { requireAdminKey } from "../lib/auth.js";
import { notifyAdmin } from "../lib/email.js";
import { z } from "zod/v4";

const router: IRouter = Router();

// ── Public: submit a review ───────────────────────────────────────────────

const submitSchema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  rating: z.number().int().min(1).max(5).default(5),
  review: z.string().min(10),
  logoUrl: z.string().optional(),
  imageUrl: z.string().optional(),
});

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [newReview] = await db
    .insert(reviewsTable)
    .values({
      name: parsed.data.name,
      company: parsed.data.company ?? null,
      rating: parsed.data.rating,
      review: parsed.data.review,
      logoUrl: parsed.data.logoUrl ?? null,
      imageUrl: parsed.data.imageUrl ?? null,
      status: "pending",
    })
    .returning();

  // Notify admin of new review
  await notifyAdmin(
    `[Review] New review from ${parsed.data.name}`,
    `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0a0a0a;color:#e5e5e5;">
      <div style="margin-bottom:24px;"><span style="font-size:18px;font-weight:700;letter-spacing:2px;color:#fff;">DARKLIGHTZ STUDIO</span></div>
      <p style="color:#e5e5e5;">A new client review has been submitted and is awaiting your approval.</p>
      <table style="border-collapse:collapse;width:100%;margin:16px 0;">
        <tr><td style="padding:8px 0;color:#888;width:100px;">Name</td><td style="color:#fff;">${parsed.data.name}</td></tr>
        ${parsed.data.company ? `<tr><td style="padding:8px 0;color:#888;">Company</td><td style="color:#fff;">${parsed.data.company}</td></tr>` : ""}
        <tr><td style="padding:8px 0;color:#888;">Rating</td><td style="color:#fff;">${"★".repeat(parsed.data.rating)}${"☆".repeat(5 - parsed.data.rating)} (${parsed.data.rating}/5)</td></tr>
        <tr><td style="padding:8px 0;color:#888;vertical-align:top;">Review</td><td style="color:#ccc;font-style:italic;">"${parsed.data.review}"</td></tr>
      </table>
      <p style="color:#aaa;font-size:13px;">Log in to the Admin Panel to approve or reject this review.</p>
      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #222;font-size:12px;color:#555;">Darklightz Studio — darklightzstudiu@gmail.com</div>
    </div>
    `,
  );

  res.status(201).json({ id: newReview.id, status: "pending" });
});

// ── Public: get approved reviews ──────────────────────────────────────────

router.get("/reviews", async (_req, res): Promise<void> => {
  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.status, "approved"))
    .orderBy(reviewsTable.createdAt);
  res.json(reviews);
});

// ── Admin: get all reviews ────────────────────────────────────────────────

router.get("/admin/reviews", requireAdminKey, async (_req, res): Promise<void> => {
  const reviews = await db
    .select()
    .from(reviewsTable)
    .orderBy(reviewsTable.createdAt);
  res.json(reviews);
});

// ── Admin: approve / reject a review ──────────────────────────────────────

router.patch("/admin/reviews/:id", requireAdminKey, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const schema = z.object({
    status: z.enum(["approved", "rejected", "pending"]),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [updated] = await db
    .update(reviewsTable)
    .set({ status: parsed.data.status, updatedAt: new Date() })
    .where(eq(reviewsTable.id, id))
    .returning();

  if (!updated) { res.status(404).json({ error: "Review not found" }); return; }
  res.json(updated);
});

// ── Admin: delete a review ────────────────────────────────────────────────

router.delete("/admin/reviews/:id", requireAdminKey, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  await db.delete(reviewsTable).where(eq(reviewsTable.id, id));
  res.json({ ok: true });
});

export default router;
