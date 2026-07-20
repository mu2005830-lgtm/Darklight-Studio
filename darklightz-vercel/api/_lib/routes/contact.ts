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

  const emailStatus: Record<string, string> = {};

  // 2. Notify admin (darklightzstudiu@gmail.com)
  // template_xege7fl variables: {{name}}, {{email}}, {{title}}, {{time}}, {{message}}
  try {
    await sendViaEmailJS(EJS_NOTIFY, {
      name:    parsed.data.name,
      email:   parsed.data.email,
      title:   `New inquiry from ${parsed.data.name}`,
      time:    dateTime,
      message: parsed.data.message,
    });
    console.log("[contact] Admin notification sent ✓");
    emailStatus.adminNotification = "sent";
  } catch (err) {
    console.error("[contact] Admin notification FAILED:", err);
    emailStatus.adminNotification = `failed: ${String(err)}`;
  }

  // 3. Auto-reply to the customer
  // template_o2q56z1 variables: {{email}} (To), {{name}}, {{title}}
  try {
    await sendViaEmailJS(EJS_AUTOREPLY, {
      email: parsed.data.email,
      name:  parsed.data.name,
      title: "Your inquiry",
    });
    console.log("[contact] Auto-reply sent ✓ to:", parsed.data.email);
    emailStatus.autoReply = "sent";
  } catch (err) {
    console.error("[contact] Auto-reply FAILED:", err);
    emailStatus.autoReply = `failed: ${String(err)}`;
  }

  // Return email delivery status — visible in the browser network tab
  // so you can verify emails are reaching EmailJS without needing server logs.
  res.status(201).json({
    ...CreateContactSubmissionResponse.parse(submission),
    _emailStatus: emailStatus,
  });
});

export default router;
