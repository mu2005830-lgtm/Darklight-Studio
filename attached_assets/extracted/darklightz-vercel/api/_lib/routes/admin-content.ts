/**
 * Admin CRUD routes for all content tables.
 * All routes require x-admin-key header via requireAdminKey.
 */
import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import {
  db,
  servicesTable,
  portfolioProjectsTable,
  caseStudiesTable,
  testimonialsTable,
  blogPostsTable,
  pricingPlansTable,
} from "../db/index";
import {
  AdminServiceBody,
  AdminServiceResponse,
  AdminUpdateServiceParams,
  AdminDeleteServiceParams,
  AdminPortfolioBody,
  AdminPortfolioResponse,
  AdminUpdatePortfolioParams,
  AdminDeletePortfolioParams,
  AdminCaseStudyBody,
  AdminCaseStudyResponse,
  AdminUpdateCaseStudyParams,
  AdminDeleteCaseStudyParams,
  AdminTestimonialBody,
  AdminTestimonialResponse,
  AdminUpdateTestimonialParams,
  AdminDeleteTestimonialParams,
  AdminBlogPostBody,
  AdminBlogPostResponse,
  AdminUpdateBlogPostParams,
  AdminDeleteBlogPostParams,
  AdminPricingPlanBody,
  AdminPricingPlanResponse,
  AdminUpdatePricingPlanParams,
  AdminDeletePricingPlanParams,
} from "../api-zod/index";
import { requireAdminKey } from "../lib/auth";
import { rejectEmptyUpdate } from "../lib/validate-update";

const router: IRouter = Router();
router.use(requireAdminKey);

// =========================================================================
// SERVICES
// =========================================================================

router.post("/admin/services", async (req, res): Promise<void> => {
  const parsed = AdminServiceBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(servicesTable).values({
    title: parsed.data.title,
    slug: parsed.data.slug,
    summary: parsed.data.summary,
    description: parsed.data.description,
    icon: parsed.data.icon ?? "✦",
    sortOrder: parsed.data.sortOrder ?? 0,
  }).returning();
  res.status(201).json(AdminServiceResponse.parse(row));
});

router.put("/admin/services/:id", async (req, res): Promise<void> => {
  const params = AdminUpdateServiceParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = AdminServiceBody.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  if (rejectEmptyUpdate(parsed.data, res)) return;
  const [row] = await db.update(servicesTable).set(parsed.data)
    .where(eq(servicesTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Service not found" }); return; }
  res.json(AdminServiceResponse.parse(row));
});

router.delete("/admin/services/:id", async (req, res): Promise<void> => {
  const params = AdminDeleteServiceParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [row] = await db.delete(servicesTable)
    .where(eq(servicesTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Service not found" }); return; }
  res.status(204).send();
});

// =========================================================================
// PORTFOLIO PROJECTS
// =========================================================================

router.post("/admin/portfolio", async (req, res): Promise<void> => {
  const parsed = AdminPortfolioBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(portfolioProjectsTable).values({
    title: parsed.data.title,
    slug: parsed.data.slug,
    category: parsed.data.category,
    summary: parsed.data.summary,
    imageUrl: parsed.data.imageUrl ?? "",
    tags: parsed.data.tags ?? [],
    year: parsed.data.year,
    sortOrder: parsed.data.sortOrder ?? 0,
  }).returning();
  res.status(201).json(AdminPortfolioResponse.parse(row));
});

router.put("/admin/portfolio/:id", async (req, res): Promise<void> => {
  const params = AdminUpdatePortfolioParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = AdminPortfolioBody.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  if (rejectEmptyUpdate(parsed.data, res)) return;
  const [row] = await db.update(portfolioProjectsTable).set(parsed.data)
    .where(eq(portfolioProjectsTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Portfolio project not found" }); return; }
  res.json(AdminPortfolioResponse.parse(row));
});

router.delete("/admin/portfolio/:id", async (req, res): Promise<void> => {
  const params = AdminDeletePortfolioParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [row] = await db.delete(portfolioProjectsTable)
    .where(eq(portfolioProjectsTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Portfolio project not found" }); return; }
  res.status(204).send();
});

// =========================================================================
// CASE STUDIES
// =========================================================================

router.post("/admin/case-studies", async (req, res): Promise<void> => {
  const parsed = AdminCaseStudyBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(caseStudiesTable).values({
    title: parsed.data.title,
    slug: parsed.data.slug,
    client: parsed.data.client,
    summary: parsed.data.summary,
    challenge: parsed.data.challenge,
    solution: parsed.data.solution,
    result: parsed.data.result,
    imageUrl: parsed.data.imageUrl ?? "",
    metricLabel: parsed.data.metricLabel ?? "",
    metricValue: parsed.data.metricValue ?? "",
    sortOrder: parsed.data.sortOrder ?? 0,
  }).returning();
  res.status(201).json(AdminCaseStudyResponse.parse(row));
});

router.put("/admin/case-studies/:id", async (req, res): Promise<void> => {
  const params = AdminUpdateCaseStudyParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = AdminCaseStudyBody.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  if (rejectEmptyUpdate(parsed.data, res)) return;
  const [row] = await db.update(caseStudiesTable).set(parsed.data)
    .where(eq(caseStudiesTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Case study not found" }); return; }
  res.json(AdminCaseStudyResponse.parse(row));
});

router.delete("/admin/case-studies/:id", async (req, res): Promise<void> => {
  const params = AdminDeleteCaseStudyParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [row] = await db.delete(caseStudiesTable)
    .where(eq(caseStudiesTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Case study not found" }); return; }
  res.status(204).send();
});

// =========================================================================
// TESTIMONIALS
// =========================================================================

router.post("/admin/testimonials", async (req, res): Promise<void> => {
  const parsed = AdminTestimonialBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(testimonialsTable).values({
    name: parsed.data.name,
    role: parsed.data.role,
    company: parsed.data.company,
    quote: parsed.data.quote,
    avatarUrl: parsed.data.avatarUrl ?? "",
    sortOrder: parsed.data.sortOrder ?? 0,
  }).returning();
  res.status(201).json(AdminTestimonialResponse.parse(row));
});

router.put("/admin/testimonials/:id", async (req, res): Promise<void> => {
  const params = AdminUpdateTestimonialParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = AdminTestimonialBody.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  if (rejectEmptyUpdate(parsed.data, res)) return;
  const [row] = await db.update(testimonialsTable).set(parsed.data)
    .where(eq(testimonialsTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Testimonial not found" }); return; }
  res.json(AdminTestimonialResponse.parse(row));
});

router.delete("/admin/testimonials/:id", async (req, res): Promise<void> => {
  const params = AdminDeleteTestimonialParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [row] = await db.delete(testimonialsTable)
    .where(eq(testimonialsTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Testimonial not found" }); return; }
  res.status(204).send();
});

// =========================================================================
// BLOG POSTS
// =========================================================================

router.post("/admin/blog", async (req, res): Promise<void> => {
  const parsed = AdminBlogPostBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(blogPostsTable).values({
    title: parsed.data.title,
    slug: parsed.data.slug,
    excerpt: parsed.data.excerpt,
    content: parsed.data.content,
    coverImageUrl: parsed.data.coverImageUrl ?? "",
    author: parsed.data.author,
    category: parsed.data.category,
    publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : new Date(),
  }).returning();
  res.status(201).json(AdminBlogPostResponse.parse(row));
});

router.put("/admin/blog/:id", async (req, res): Promise<void> => {
  const params = AdminUpdateBlogPostParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = AdminBlogPostBody.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  if (rejectEmptyUpdate(parsed.data, res)) return;
  const updateData: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.publishedAt) updateData.publishedAt = new Date(parsed.data.publishedAt);
  const [row] = await db.update(blogPostsTable).set(updateData as any)
    .where(eq(blogPostsTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Blog post not found" }); return; }
  res.json(AdminBlogPostResponse.parse(row));
});

router.delete("/admin/blog/:id", async (req, res): Promise<void> => {
  const params = AdminDeleteBlogPostParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [row] = await db.delete(blogPostsTable)
    .where(eq(blogPostsTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Blog post not found" }); return; }
  res.status(204).send();
});

// =========================================================================
// PRICING PLANS
// =========================================================================

router.post("/admin/pricing", async (req, res): Promise<void> => {
  const parsed = AdminPricingPlanBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(pricingPlansTable).values({
    name: parsed.data.name,
    tagline: parsed.data.tagline,
    price: parsed.data.price,
    billingNote: parsed.data.billingNote ?? "",
    features: parsed.data.features ?? [],
    isFeatured: parsed.data.isFeatured ?? false,
    sortOrder: parsed.data.sortOrder ?? 0,
  }).returning();
  res.status(201).json(AdminPricingPlanResponse.parse(row));
});

router.put("/admin/pricing/:id", async (req, res): Promise<void> => {
  const params = AdminUpdatePricingPlanParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = AdminPricingPlanBody.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  if (rejectEmptyUpdate(parsed.data, res)) return;
  const [row] = await db.update(pricingPlansTable).set(parsed.data)
    .where(eq(pricingPlansTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Pricing plan not found" }); return; }
  res.json(AdminPricingPlanResponse.parse(row));
});

router.delete("/admin/pricing/:id", async (req, res): Promise<void> => {
  const params = AdminDeletePricingPlanParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [row] = await db.delete(pricingPlansTable)
    .where(eq(pricingPlansTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Pricing plan not found" }); return; }
  res.status(204).send();
});

export default router;
