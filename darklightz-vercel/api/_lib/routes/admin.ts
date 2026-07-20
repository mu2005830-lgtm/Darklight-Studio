import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import {
  db,
  servicesTable,
  portfolioProjectsTable,
  caseStudiesTable,
  testimonialsTable,
  blogPostsTable,
  pricingPlansTable,
  contactSubmissionsTable,
  bookingsTable,
} from "../db/index.js";
import {
  GetDashboardSummaryResponse,
  ListContactSubmissionsResponse,
  UpdateContactSubmissionParams,
  UpdateContactSubmissionBody,
  UpdateContactSubmissionResponse,
  ListBookingsResponse,
  UpdateBookingParams,
  UpdateBookingBody,
  UpdateBookingResponse,
} from "../api-zod/index.js";
import { requireAdminKey } from "../lib/auth.js";
import { sendViaEmailJS, ADMIN_EMAIL } from "../lib/email.js";

// EmailJS auto-reply template (customer-facing)
const EJS_AUTOREPLY = "template_o2q56z1";

const router: IRouter = Router();

// Only apply the admin key check to /admin/* routes
router.use("/admin", requireAdminKey);

router.get("/admin/dashboard-summary", async (_req, res): Promise<void> => {
  const [
    [{ count: totalServices }],
    [{ count: totalPortfolioProjects }],
    [{ count: totalCaseStudies }],
    [{ count: totalTestimonials }],
    [{ count: totalBlogPosts }],
    [{ count: totalPricingPlans }],
    [{ count: totalContactSubmissions }],
    [{ count: totalBookings }],
    recentContactSubmissions,
    recentBookings,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(servicesTable),
    db.select({ count: sql<number>`count(*)::int` }).from(portfolioProjectsTable),
    db.select({ count: sql<number>`count(*)::int` }).from(caseStudiesTable),
    db.select({ count: sql<number>`count(*)::int` }).from(testimonialsTable),
    db.select({ count: sql<number>`count(*)::int` }).from(blogPostsTable),
    db.select({ count: sql<number>`count(*)::int` }).from(pricingPlansTable),
    db.select({ count: sql<number>`count(*)::int` }).from(contactSubmissionsTable),
    db.select({ count: sql<number>`count(*)::int` }).from(bookingsTable),
    db
      .select()
      .from(contactSubmissionsTable)
      .orderBy(desc(contactSubmissionsTable.createdAt))
      .limit(5),
    db
      .select()
      .from(bookingsTable)
      .orderBy(desc(bookingsTable.createdAt))
      .limit(5),
  ]);

  res.json(
    GetDashboardSummaryResponse.parse({
      totalServices,
      totalPortfolioProjects,
      totalCaseStudies,
      totalTestimonials,
      totalBlogPosts,
      totalPricingPlans,
      totalContactSubmissions,
      totalBookings,
      recentContactSubmissions,
      recentBookings,
    }),
  );
});

router.get("/admin/contact-submissions", async (_req, res): Promise<void> => {
  const submissions = await db
    .select()
    .from(contactSubmissionsTable)
    .orderBy(desc(contactSubmissionsTable.createdAt));
  res.json(ListContactSubmissionsResponse.parse(submissions));
});

router.patch(
  "/admin/contact-submissions/:id",
  async (req, res): Promise<void> => {
    const params = UpdateContactSubmissionParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const parsed = UpdateContactSubmissionBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [submission] = await db
      .update(contactSubmissionsTable)
      .set({ status: parsed.data.status })
      .where(eq(contactSubmissionsTable.id, params.data.id))
      .returning();

    if (!submission) {
      res.status(404).json({ error: "Contact submission not found" });
      return;
    }

    res.json(UpdateContactSubmissionResponse.parse(submission));
  },
);

router.get("/admin/bookings", async (_req, res): Promise<void> => {
  const bookings = await db
    .select()
    .from(bookingsTable)
    .orderBy(desc(bookingsTable.createdAt));
  res.json(ListBookingsResponse.parse(bookings));
});

router.patch("/admin/bookings/:id", async (req, res): Promise<void> => {
  const params = UpdateBookingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [booking] = await db
    .update(bookingsTable)
    .set({ status: parsed.data.status })
    .where(eq(bookingsTable.id, params.data.id))
    .returning();

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  // Send email to the customer when their booking is confirmed or completed
  const newStatus = parsed.data.status;
  if (newStatus === "confirmed" || newStatus === "completed") {
    const now = new Date();
    const dateTime = now.toLocaleString("en-PK", {
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
    });

    const isConfirmed = newStatus === "confirmed";
    const statusLabel = isConfirmed ? "Booking Confirmed" : "Booking Completed";
    const messageText = isConfirmed
      ? `Great news! Your booking for "${booking.service}" has been confirmed. We will be in touch with all the details shortly. Thank you for choosing Darklightz Studio!`
      : `Your session for "${booking.service}" has been completed. Thank you for working with us! We hope you're delighted with the results. Please don't hesitate to get in touch if you need anything further.`;

    try {
      await sendViaEmailJS(EJS_AUTOREPLY, {
        to_name:    booking.name,
        from_name:  "Darklightz Studio",
        from_email: ADMIN_EMAIL,
        reply_to:   ADMIN_EMAIL,
        subject:    `[Darklightz] ${statusLabel} — ${booking.service}`,
        message:    messageText,
        date_time:  dateTime,
        company:    booking.company ?? "Not provided",
        budget:     "",
        website_url: "https://darklight-studio.vercel.app",
      }, booking.email);
      console.log(`[booking] ${statusLabel} email sent ✓ to: ${booking.email}`);
    } catch (err) {
      // Log the full error — never silently swallow it
      console.error(`[booking] ${statusLabel} email FAILED for ${booking.email}:`, err);
      // Return the updated booking to the admin — DB is committed; email failure
      // is surfaced in the response so the UI can show a warning.
      res.json({ ...UpdateBookingResponse.parse(booking), emailError: String(err) });
      return;
    }
  }

  res.json(UpdateBookingResponse.parse(booking));
});

export default router;
