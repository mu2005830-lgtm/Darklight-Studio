import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import {
  db,
  portfolioProjectsTable,
  caseStudiesTable,
  blogPostsTable,
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

const router: IRouter = Router();

// Apply to every route in this router
router.use(requireAdminKey);

router.get("/admin/dashboard-summary", async (_req, res): Promise<void> => {
  const [
    [{ count: totalPortfolioProjects }],
    [{ count: totalCaseStudies }],
    [{ count: totalBlogPosts }],
    [{ count: newContactSubmissions }],
    [{ count: totalContactSubmissions }],
    [{ count: pendingBookings }],
    [{ count: totalBookings }],
    recentContactSubmissions,
    recentBookings,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(portfolioProjectsTable),
    db.select({ count: sql<number>`count(*)::int` }).from(caseStudiesTable),
    db.select({ count: sql<number>`count(*)::int` }).from(blogPostsTable),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(contactSubmissionsTable)
      .where(eq(contactSubmissionsTable.status, "new")),
    db.select({ count: sql<number>`count(*)::int` }).from(contactSubmissionsTable),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(bookingsTable)
      .where(eq(bookingsTable.status, "pending")),
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
      totalPortfolioProjects,
      totalCaseStudies,
      totalBlogPosts,
      newContactSubmissions,
      totalContactSubmissions,
      pendingBookings,
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

  res.json(UpdateBookingResponse.parse(booking));
});

export default router;
