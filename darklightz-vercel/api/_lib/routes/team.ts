import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, teamMembersTable } from "../db/index.js";
import {
  ListTeamMembersResponse,
  TeamMemberItem,
  CreateTeamMemberBody,
  UpdateTeamMemberParams,
  UpdateTeamMemberBody,
  DeleteTeamMemberParams,
} from "../api-zod/index.js";
import { requireAdminKey } from "../lib/auth.js";
import { rejectEmptyUpdate } from "../lib/validate-update.js";

const router: IRouter = Router();

router.get("/team", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(teamMembersTable)
    .orderBy(teamMembersTable.sortOrder);
  res.json(ListTeamMembersResponse.parse(rows));
});

router.post("/admin/team", requireAdminKey, async (req, res): Promise<void> => {
  const parsed = CreateTeamMemberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db
    .insert(teamMembersTable)
    .values({
      name: parsed.data.name,
      role: parsed.data.role,
      bio: parsed.data.bio ?? "",
      avatarUrl: parsed.data.avatarUrl ?? "",
      linkedinUrl: parsed.data.linkedinUrl ?? "",
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    .returning();
  res.status(201).json(TeamMemberItem.parse(row));
});

router.put("/admin/team/:id", requireAdminKey, async (req, res): Promise<void> => {
  const params = UpdateTeamMemberParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateTeamMemberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  if (rejectEmptyUpdate(parsed.data, res)) return;
  const [row] = await db
    .update(teamMembersTable)
    .set(parsed.data)
    .where(eq(teamMembersTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Team member not found" });
    return;
  }
  res.json(TeamMemberItem.parse(row));
});

router.delete("/admin/team/:id", requireAdminKey, async (req, res): Promise<void> => {
  const params = DeleteTeamMemberParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .delete(teamMembersTable)
    .where(eq(teamMembersTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Team member not found" });
    return;
  }
  res.status(204).send();
});

export default router;
