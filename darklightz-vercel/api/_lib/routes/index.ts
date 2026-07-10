import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import servicesRouter from "./services.js";
import portfolioRouter from "./portfolio.js";
import caseStudiesRouter from "./case-studies.js";
import testimonialsRouter from "./testimonials.js";
import blogRouter from "./blog.js";
import pricingRouter from "./pricing.js";
import contactRouter from "./contact.js";
import bookingsRouter from "./bookings.js";
import adminRouter from "./admin.js";
// CMS Phase 2
import siteSettingsRouter from "./site-settings.js";
import socialLinksRouter from "./social-links.js";
import teamRouter from "./team.js";
import faqRouter from "./faq.js";
import clientsRouter from "./clients.js";
import adminContentRouter from "./admin-content.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(servicesRouter);
router.use(portfolioRouter);
router.use(caseStudiesRouter);
router.use(testimonialsRouter);
router.use(blogRouter);
router.use(pricingRouter);
router.use(contactRouter);
router.use(bookingsRouter);
router.use(adminRouter);
// CMS Phase 2
router.use(siteSettingsRouter);
router.use(socialLinksRouter);
router.use(teamRouter);
router.use(faqRouter);
router.use(clientsRouter);
router.use(adminContentRouter);

export default router;
