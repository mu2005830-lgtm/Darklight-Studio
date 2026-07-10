import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, caseStudiesTable } from "../db/index.js";
import {
  ListCaseStudiesResponse,
  GetCaseStudyParams,
  GetCaseStudyResponse,
} from "../api-zod/index.js";

const router: IRouter = Router();

router.get("/case-studies", async (_req, res): Promise<void> => {
  const caseStudies = await db
    .select()
    .from(caseStudiesTable)
    .orderBy(caseStudiesTable.sortOrder);
  res.json(ListCaseStudiesResponse.parse(caseStudies));
});

router.get("/case-studies/:slug", async (req, res): Promise<void> => {
  const params = GetCaseStudyParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [caseStudy] = await db
    .select()
    .from(caseStudiesTable)
    .where(eq(caseStudiesTable.slug, params.data.slug));

  if (!caseStudy) {
    res.status(404).json({ error: "Case study not found" });
    return;
  }

  res.json(GetCaseStudyResponse.parse(caseStudy));
});

export default router;
