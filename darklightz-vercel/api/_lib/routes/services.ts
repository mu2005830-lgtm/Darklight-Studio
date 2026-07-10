import { Router, type IRouter } from "express";
import { db, servicesTable } from "../db/index.js";
import { ListServicesResponse } from "../api-zod/index.js";

const router: IRouter = Router();

router.get("/services", async (_req, res): Promise<void> => {
  const services = await db
    .select()
    .from(servicesTable)
    .orderBy(servicesTable.sortOrder);
  res.json(ListServicesResponse.parse(services));
});

export default router;
