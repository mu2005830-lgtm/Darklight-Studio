import { Router, type IRouter } from "express";
import { db, bookingsTable } from "../db/index.js";
import { CreateBookingBody, CreateBookingResponse } from "../api-zod/index.js";
import { sendViaEmailJS, ADMIN_EMAIL } from "../lib/email.js";

const router: IRouter = Router();

// EmailJS template IDs
const EJS_NOTIFY    = "template_xege7fl"; // notification → admin
const EJS_AUTOREPLY = "template_o2q56z1"; // confirmation → customer

router.post("/bookings", async (req, res): Promise<void> => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // 1. Save to database
  const [booking] = await db
    .insert(bookingsTable)
    .values({
      name:          parsed.data.name,
      email:         parsed.data.email,
      company:       parsed.data.company ?? null,
      service:       parsed.data.service,
      preferredDate: new Date(parsed.data.preferredDate),
      message:       parsed.data.message ?? null,
    })
    .returning();

  const now = new Date();
  const dateTime = now.toLocaleString("en-PK", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
  const preferredDateStr = new Date(parsed.data.preferredDate).toLocaleDateString("en-PK", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });

  const emailStatus: Record<string, string> = {};

  // 2. Notify admin (darklightzstudiu@gmail.com)
  // template_xege7fl variables: {{name}}, {{email}}, {{title}}, {{time}}, {{message}}
  try {
    await sendViaEmailJS(EJS_NOTIFY, {
      name:    parsed.data.name,
      email:   parsed.data.email,
      title:   `New booking — ${parsed.data.service}`,
      time:    dateTime,
      message: `Service: ${parsed.data.service}\nPreferred Date: ${preferredDateStr}\nCompany: ${parsed.data.company || "Not provided"}\nMessage: ${parsed.data.message || "None"}`,
    });
    console.log("[booking] Admin notification sent ✓ to:", ADMIN_EMAIL);
    emailStatus.adminNotification = "sent";
  } catch (err) {
    console.error("[booking] Admin notification FAILED:", err);
    emailStatus.adminNotification = `failed: ${String(err)}`;
  }

  // 3. Confirmation email to the customer
  // template_o2q56z1 variables: {{to_email}} (To), {{name}}, {{title}}
  // NOTE: must use `to_email` — EmailJS REST API only honours its reserved
  // `to_email` key for dynamic recipient substitution server-side.
  try {
    await sendViaEmailJS(EJS_AUTOREPLY, {
      name:  parsed.data.name,
      title: parsed.data.service,
    }, parsed.data.email);
    console.log("[booking] Customer confirmation sent ✓ to:", parsed.data.email);
    emailStatus.customerConfirmation = "sent";
  } catch (err) {
    console.error("[booking] Customer confirmation FAILED:", err);
    emailStatus.customerConfirmation = `failed: ${String(err)}`;
  }

  res.status(201).json({
    ...CreateBookingResponse.parse(booking),
    _emailStatus: emailStatus, // visible in network tab for debugging
  });
});

export default router;
