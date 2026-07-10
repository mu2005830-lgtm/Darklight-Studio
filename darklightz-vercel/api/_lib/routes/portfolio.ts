import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, portfolioProjectsTable } from "../db/index.js";
import {
  ListPortfolioProjectsQueryParams,
  ListPortfolioProjectsResponse,
  GetPortfolioProjectParams,
  GetPortfolioProjectResponse,
} from "../api-zod/index.js";

const router: IRouter = Router();

router.get("/portfolio", async (req, res): Promise<void> => {
  const query = ListPortfolioProjectsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const projects = await db
    .select()
    .from(portfolioProjectsTable)
    .orderBy(portfolioProjectsTable.sortOrder);

  const filtered = query.data.category
    ? projects.filter((p) => p.category === query.data.category)
    : projects;

  res.json(ListPortfolioProjectsResponse.parse(filtered));
});

router.get("/portfolio/:id", async (req, res): Promise<void> => {
  const params = GetPortfolioProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [project] = await db
    .select()
    .from(portfolioProjectsTable)
    .where(eq(portfolioProjectsTable.id, params.data.id));

  if (!project) {
    res.status(404).json({ error: "Portfolio project not found" });
    return;
  }

  res.json(GetPortfolioProjectResponse.parse(project));
});

export default router;
