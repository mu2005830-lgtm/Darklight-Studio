import { Router, type IRouter } from "express";
import { db, contactSubmissionsTable } from "../db/index.js";
import {
  CreateContactSubmissionBody,
  CreateContactSubmissionResponse,
} from "../api-zod/index.js";
import { notifyAdmin } from "../lib/email.js";

const router: IRouter = Router();

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = CreateContactSubmissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [submission] = await db
    .insert(contactSubmissionsTable)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company ?? null,
      budget: parsed.data.budget ?? null,
      message: parsed.data.message,
    })
    .returning();

  // Notify admin of new contact inquiry
  await notifyAdmin(
    `[Inquiry] New message from ${parsed.data.name}`,
    `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0a0a0a;color:#e5e5e5;">
      <div style="margin-bottom:24px;">
        <span style="font-size:18px;font-weight:700;letter-spacing:2px;color:#fff;">DARKLIGHTZ STUDIO</span>
      </div>
      <p style="color:#e5e5e5;font-size:16px;">New contact form submission received.</p>
      <table style="border-collapse:collapse;width:100%;margin:16px 0;">
        <tr><td style="padding:8px 0;color:#888;width:120px;">Name</td><td style="color:#fff;">${parsed.data.name}</td></tr>
        <tr><td style="padding:8px 0;color:#888;">Email</td><td style="color:#fff;"><a href="mailto:${parsed.data.email}" style="color:#aaa;">${parsed.data.email}</a></td></tr>
        ${parsed.data.company ? `<tr><td style="padding:8px 0;color:#888;">Business</td><td style="color:#fff;">${parsed.data.company}</td></tr>` : ""}
        ${parsed.data.budget ? `<tr><td style="padding:8px 0;color:#888;">Budget</td><td style="color:#fff;">${parsed.data.budget}</td></tr>` : ""}
        <tr><td style="padding:8px 0;color:#888;vertical-align:top;">Message</td><td style="color:#ccc;font-style:italic;">"${parsed.data.message}"</td></tr>
      </table>
      <p style="color:#aaa;font-size:13px;">Log in to the Admin Panel to manage this inquiry.</p>
      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #222;font-size:12px;color:#555;">
        Darklightz Studio — darklightzstudiu@gmail.com
      </div>
    </div>
    `,
  );

  res.status(201).json(CreateContactSubmissionResponse.parse(submission));
});

export default router;
