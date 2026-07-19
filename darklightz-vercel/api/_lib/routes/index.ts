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
// Services System Phase 2
import inquiriesRouter from "./inquiries.js";
import uploadRouter from "./upload.js";
// Client Portal — Phase 3
import portalRouter from "./portal.js";
import adminPortalRouter from "./admin-portal.js";
// Reviews System
import reviewsRouter from "./reviews.js";
// Media Center
import mediaRouter from "./media.js";
// SQL Editor
import sqlRouter from "./sql.js";

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
// Services System Phase 2
router.use(inquiriesRouter);
router.use(uploadRouter);
// Client Portal — Phase 3
router.use(portalRouter);
router.use(adminPortalRouter);
router.use(reviewsRouter);
router.use(mediaRouter);
router.use(sqlRouter);

export default router;
