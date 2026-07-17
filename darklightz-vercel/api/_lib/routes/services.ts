import { Router, type IRouter } from "express";
import { eq, ilike } from "drizzle-orm";
import {
  db,
  servicesTable,
  portfolioProjectsTable,
  faqItemsTable,
  testimonialsTable,
} from "../db/index.js";
import { ListServicesResponse } from "../api-zod/index.js";

const router: IRouter = Router();

// List all services — returns empty array if migration hasn't added new columns yet
router.get("/services", async (_req, res): Promise<void> => {
  try {
    const services = await db
      .select()
      .from(servicesTable)
      .orderBy(servicesTable.sortOrder);
    res.json(ListServicesResponse.parse(services));
  } catch {
    // DB schema not yet migrated (e.g. new columns not yet added)
    res.json([]);
  }
});

// Get a single service by slug
router.get("/services/:slug", async (req, res): Promise<void> => {
  const { slug } = req.params;
  const [service] = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.slug, slug));
  if (!service) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json(service);
});

// Portfolio filtered by service slug (matches portfolio category)
router.get("/services/:slug/portfolio", async (req, res): Promise<void> => {
  const { slug } = req.params;
  const projects = await db
    .select()
    .from(portfolioProjectsTable)
    .where(ilike(portfolioProjectsTable.category, `%${slug}%`))
    .orderBy(portfolioProjectsTable.sortOrder);
  res.json(projects);
});

// FAQs filtered by service slug (uses category field)
router.get("/services/:slug/faqs", async (req, res): Promise<void> => {
  const { slug } = req.params;
  const faqs = await db
    .select()
    .from(faqItemsTable)
    .where(eq(faqItemsTable.category, slug))
    .orderBy(faqItemsTable.sortOrder);
  res.json(faqs);
});

// Testimonials filtered by service slug
router.get("/services/:slug/testimonials", async (req, res): Promise<void> => {
  const { slug } = req.params;
  const testimonials = await db
    .select()
    .from(testimonialsTable)
    .where(eq(testimonialsTable.serviceSlug, slug))
    .orderBy(testimonialsTable.sortOrder);
  res.json(testimonials);
});

export default router;
