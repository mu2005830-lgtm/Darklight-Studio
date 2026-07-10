import { Router, type IRouter } from "express";
import { db, pricingPlansTable } from "../db/index";
import { ListPricingPlansResponse } from "../api-zod/index";

const router: IRouter = Router();

router.get("/pricing", async (_req, res): Promise<void> => {
  const plans = await db
    .select()
    .from(pricingPlansTable)
    .orderBy(pricingPlansTable.sortOrder);
  res.json(ListPricingPlansResponse.parse(plans));
});

export default router;
