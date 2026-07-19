import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!_resend) _resend = new Resend(key);
  return _resend;
}

const FROM_EMAIL =
  process.env.FROM_EMAIL ?? "Darklightz Studio <noreply@darklightz.studio>";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? "";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

/** Send a transactional email. Silently skips if RESEND_API_KEY is unset. */
export async function sendEmail(payload: EmailPayload): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping email.");
    return;
  }
  try {
    await resend.emails.send({ from: FROM_EMAIL, ...payload });
  } catch (err) {
    // Email failures must never break the main request flow.
    console.error("[email] Failed to send email:", err);
  }
}

/** Send an email notification to the admin. Skips if ADMIN_NOTIFICATION_EMAIL unset. */
export async function notifyAdmin(subject: string, html: string): Promise<void> {
  if (!ADMIN_EMAIL) {
    console.warn("[email] ADMIN_NOTIFICATION_EMAIL not set — skipping admin notification.");
    return;
  }
  return sendEmail({ to: ADMIN_EMAIL, subject, html });
}

/** Send a notification email to a client. */
export async function notifyClient(
  clientEmail: string,
  subject: string,
  html: string,
): Promise<void> {
  return sendEmail({ to: clientEmail, subject, html });
}

// ── Email templates ───────────────────────────────────────────────────────

function baseTemplate(body: string): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0a0a0a;color:#e5e5e5;">
      <div style="margin-bottom:24px;">
        <span style="font-size:18px;font-weight:700;letter-spacing:2px;color:#fff;">DARKLIGHTZ STUDIO</span>
      </div>
      ${body}
      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #222;font-size:12px;color:#555;">
        Darklightz Studio &mdash; Client Portal
      </div>
    </div>
  `;
}

export function emailUpdateRequested(clientName: string, projectTitle: string): string {
  return baseTemplate(`
    <p style="color:#e5e5e5;">A client has requested a progress update.</p>
    <table style="border-collapse:collapse;width:100%;margin:16px 0;">
      <tr><td style="padding:8px 0;color:#888;width:140px;">Client</td><td style="color:#fff;">${clientName}</td></tr>
      <tr><td style="padding:8px 0;color:#888;">Project</td><td style="color:#fff;">${projectTitle}</td></tr>
    </table>
    <p style="color:#aaa;font-size:13px;">Log in to the admin panel to update the project.</p>
  `);
}

export function emailNewMessage(
  recipientName: string,
  senderName: string,
  projectTitle: string,
  preview: string,
): string {
  return baseTemplate(`
    <p style="color:#e5e5e5;">You have a new message from <strong style="color:#fff;">${senderName}</strong>.</p>
    <table style="border-collapse:collapse;width:100%;margin:16px 0;">
      <tr><td style="padding:8px 0;color:#888;width:140px;">Project</td><td style="color:#fff;">${projectTitle}</td></tr>
      <tr><td style="padding:8px 0;color:#888;">Message</td><td style="color:#ccc;font-style:italic;">"${preview}"</td></tr>
    </table>
    <p style="color:#aaa;font-size:13px;">Log in to your portal to view and reply.</p>
  `);
}

export function emailRevisionSubmitted(
  clientName: string,
  projectTitle: string,
  preview: string,
): string {
  return baseTemplate(`
    <p style="color:#e5e5e5;">A revision request has been submitted.</p>
    <table style="border-collapse:collapse;width:100%;margin:16px 0;">
      <tr><td style="padding:8px 0;color:#888;width:140px;">Client</td><td style="color:#fff;">${clientName}</td></tr>
      <tr><td style="padding:8px 0;color:#888;">Project</td><td style="color:#fff;">${projectTitle}</td></tr>
      <tr><td style="padding:8px 0;color:#888;">Details</td><td style="color:#ccc;font-style:italic;">"${preview}"</td></tr>
    </table>
  `);
}

export function emailStatusChanged(
  clientName: string,
  projectTitle: string,
  newStatus: string,
): string {
  return baseTemplate(`
    <p style="color:#e5e5e5;">Your project status has been updated.</p>
    <table style="border-collapse:collapse;width:100%;margin:16px 0;">
      <tr><td style="padding:8px 0;color:#888;width:140px;">Project</td><td style="color:#fff;">${projectTitle}</td></tr>
      <tr><td style="padding:8px 0;color:#888;">New Status</td><td style="color:#fff;text-transform:capitalize;">${newStatus.replace(/_/g, " ")}</td></tr>
    </table>
    <p style="color:#aaa;font-size:13px;">Log in to your portal to view the latest details.</p>
  `);
}

export function emailClientUploadedFile(
  clientName: string,
  projectTitle: string,
  fileName: string,
): string {
  const now = new Date();
  const date = now.toLocaleDateString("en-PK", { day: "2-digit", month: "long", year: "numeric" });
  const time = now.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" });
  return baseTemplate(`
    <p style="color:#e5e5e5;">A client has uploaded a new file to their project.</p>
    <table style="border-collapse:collapse;width:100%;margin:16px 0;">
      <tr><td style="padding:8px 0;color:#888;width:140px;">Client</td><td style="color:#fff;">${clientName}</td></tr>
      <tr><td style="padding:8px 0;color:#888;">Project</td><td style="color:#fff;">${projectTitle}</td></tr>
      <tr><td style="padding:8px 0;color:#888;">File</td><td style="color:#fff;">${fileName}</td></tr>
      <tr><td style="padding:8px 0;color:#888;">Date</td><td style="color:#fff;">${date}</td></tr>
      <tr><td style="padding:8px 0;color:#888;">Time</td><td style="color:#fff;">${time}</td></tr>
    </table>
    <p style="color:#aaa;font-size:13px;">Log in to the admin panel to view the uploaded file inside the client's project.</p>
  `);
}

export function emailProjectCompleted(clientName: string, projectTitle: string): string {
  return baseTemplate(`
    <p style="color:#e5e5e5;font-size:16px;">🎉 Your project has been completed!</p>
    <table style="border-collapse:collapse;width:100%;margin:16px 0;">
      <tr><td style="padding:8px 0;color:#888;width:140px;">Project</td><td style="color:#fff;">${projectTitle}</td></tr>
    </table>
    <p style="color:#aaa;font-size:13px;">Log in to your portal to download your deliverables and leave a review.</p>
  `);
}

export function emailReadyForReview(clientName: string, projectTitle: string): string {
  return baseTemplate(`
    <p style="color:#e5e5e5;font-size:16px;">✅ Your project is ready for review!</p>
    <p style="color:#ccc;">Hi ${clientName || "there"},</p>
    <p style="color:#ccc;">We've completed the work on <strong style="color:#fff;">${projectTitle}</strong> and it's now ready for your review.</p>
    <table style="border-collapse:collapse;width:100%;margin:16px 0;">
      <tr><td style="padding:8px 0;color:#888;width:140px;">Project</td><td style="color:#fff;">${projectTitle}</td></tr>
    </table>
    <p style="color:#ccc;">Please log in to your portal to:</p>
    <ul style="color:#aaa;font-size:13px;line-height:1.8;">
      <li>Review the deliverables</li>
      <li>Leave comments or feedback</li>
      <li>Request changes if needed</li>
      <li>Approve the work</li>
    </ul>
    <p style="color:#aaa;font-size:13px;">Log in to your portal to get started.</p>
  `);
}

export function emailProjectDelivered(clientName: string, projectTitle: string, message: string): string {
  return baseTemplate(`
    <p style="color:#e5e5e5;font-size:16px;">📦 Your project has been delivered!</p>
    <p style="color:#ccc;">Hi ${clientName || "there"},</p>
    <p style="color:#ccc;">Your project <strong style="color:#fff;">${projectTitle}</strong> has been delivered. Here's a message from the team:</p>
    <div style="background:#111;border-left:3px solid #333;padding:12px 16px;margin:16px 0;color:#ccc;font-style:italic;">${message}</div>
    <p style="color:#aaa;font-size:13px;">Log in to your portal to download all files and deliverables.</p>
  `);
}

export function emailReviewInvite(clientName: string, projectTitle: string, reviewUrl: string): string {
  return baseTemplate(`
    <p style="color:#e5e5e5;font-size:16px;">⭐ How was your experience?</p>
    <p style="color:#ccc;">Hi ${clientName || "there"},</p>
    <p style="color:#ccc;">We're thrilled to have completed <strong style="color:#fff;">${projectTitle}</strong> for you. We'd love to hear your feedback!</p>
    <p style="margin:24px 0;">
      <a href="${reviewUrl}" style="background:#fff;color:#000;padding:12px 24px;text-decoration:none;font-weight:700;letter-spacing:1px;font-size:13px;">Leave a Review</a>
    </p>
    <p style="color:#aaa;font-size:12px;">Your review helps us improve and helps other clients make informed decisions. Thank you for trusting Darklightz Studio!</p>
  `);
}

export function emailRequestInfo(clientName: string, projectTitle: string, details: string): string {
  return baseTemplate(`
    <p style="color:#e5e5e5;font-size:16px;">📋 We need more information</p>
    <p style="color:#ccc;">Hi ${clientName || "there"},</p>
    <p style="color:#ccc;">To continue work on <strong style="color:#fff;">${projectTitle}</strong>, we need some additional information from you:</p>
    <div style="background:#111;border-left:3px solid #444;padding:12px 16px;margin:16px 0;color:#ccc;">${details}</div>
    <p style="color:#aaa;font-size:13px;">Please log in to your portal and reply to this request, or send us a message directly.</p>
  `);
}

export function emailRequestFiles(clientName: string, projectTitle: string, details: string): string {
  return baseTemplate(`
    <p style="color:#e5e5e5;font-size:16px;">📁 Missing files needed</p>
    <p style="color:#ccc;">Hi ${clientName || "there"},</p>
    <p style="color:#ccc;">We're missing some files required to continue work on <strong style="color:#fff;">${projectTitle}</strong>:</p>
    <div style="background:#111;border-left:3px solid #444;padding:12px 16px;margin:16px 0;color:#ccc;">${details}</div>
    <p style="color:#aaa;font-size:13px;">Please log in to your portal and upload the required files at your earliest convenience.</p>
  `);
}
