import { Router, type IRouter } from "express";
import healthRouter from "./health";
import servicesRouter from "./services";
import portfolioRouter from "./portfolio";
import caseStudiesRouter from "./case-studies";
import testimonialsRouter from "./testimonials";
import blogRouter from "./blog";
import pricingRouter from "./pricing";
import contactRouter from "./contact";
import bookingsRouter from "./bookings";
import adminRouter from "./admin";
// CMS Phase 2
import siteSettingsRouter from "./site-settings";
import socialLinksRouter from "./social-links";
import teamRouter from "./team";
import faqRouter from "./faq";
import clientsRouter from "./clients";
import adminContentRouter from "./admin-content";

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
