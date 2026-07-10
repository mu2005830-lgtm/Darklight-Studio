import { Router, type IRouter } from "express";
import { db, testimonialsTable } from "../db/index.js";
import { ListTestimonialsResponse } from "../api-zod/index.js";

const router: IRouter = Router();

router.get("/testimonials", async (_req, res): Promise<void> => {
  const testimonials = await db
    .select()
    .from(testimonialsTable)
    .orderBy(testimonialsTable.sortOrder);
  res.json(ListTestimonialsResponse.parse(testimonials));
});

export default router;
