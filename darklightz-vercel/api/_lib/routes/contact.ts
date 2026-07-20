import { Router, type IRouter } from "express";
import { db, contactSubmissionsTable } from "../db/index.js";
import {
  CreateContactSubmissionBody,
  CreateContactSubmissionResponse,
} from "../api-zod/index.js";
import { sendViaEmailJS, ADMIN_EMAIL } from "../lib/email.js";

const router: IRouter = Router();

// EmailJS template IDs
const EJS_NOTIFY    = "template_xege7fl"; // notification → admin
const EJS_AUTOREPLY = "template_o2q56z1"; // auto-reply   → customer

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = CreateContactSubmissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // 1. Save to database
  const [submission] = await db
    .insert(contactSubmissionsTable)
    .values({
      name:    parsed.data.name,
      email:   parsed.data.email,
      company: parsed.data.company ?? null,
      budget:  parsed.data.budget  ?? null,
      message: parsed.data.message,
    })
    .returning();

  const now = new Date();
  const dateTime = now.toLocaleString("en-PK", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });

  const sharedParams: Record<string, string> = {
    from_name:   parsed.data.name,
    from_email:  parsed.data.email,
    reply_to:    parsed.data.email,
    company:     parsed.data.company  || "Not provided",
    budget:      parsed.data.budget   || "Not specified",
    message:     parsed.data.message,
    date_time:   dateTime,
    website_url: "https://darklight-studio.vercel.app",
  };

  // 2. Notify admin (darklightzstudiu@gmail.com)
  try {
    await sendViaEmailJS(EJS_NOTIFY, {
      ...sharedParams,
      to_email: ADMIN_EMAIL,
      to_name:  "Darklightz Studio",
      subject:  `New inquiry from ${parsed.data.name}`,
    });
    console.log("[contact] Admin notification sent ✓");
  } catch (err) {
    console.error("[contact] Admin notification FAILED:", err);
    // Do NOT abort — DB entry is saved; log is enough
  }

  // 3. Auto-reply to the customer
  try {
    await sendViaEmailJS(EJS_AUTOREPLY, {
      ...sharedParams,
      to_email: parsed.data.email,
      to_name:  parsed.data.name,
      subject:  "Thank you for contacting Darklightz Studio!",
    });
    console.log("[contact] Auto-reply sent ✓ to:", parsed.data.email);
  } catch (err) {
    console.error("[contact] Auto-reply FAILED:", err);
  }

  res.status(201).json(CreateContactSubmissionResponse.parse(submission));
});

export default router;
