import { Router, type IRouter } from "express";
import { db, contactSubmissionsTable } from "../db/index";
import {
  CreateContactSubmissionBody,
  CreateContactSubmissionResponse,
} from "../api-zod/index";

const router: IRouter = Router();

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = CreateContactSubmissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [submission] = await db
    .insert(contactSubmissionsTable)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company ?? null,
      budget: parsed.data.budget ?? null,
      message: parsed.data.message,
    })
    .returning();

  res.status(201).json(CreateContactSubmissionResponse.parse(submission));
});

export default router;
