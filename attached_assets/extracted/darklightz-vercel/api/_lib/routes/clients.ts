import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, clientsTable } from "../db/index";
import {
  ListClientsResponse,
  ClientItem,
  CreateClientBody,
  UpdateClientParams,
  UpdateClientBody,
  DeleteClientParams,
} from "../api-zod/index";
import { requireAdminKey } from "../lib/auth";
import { rejectEmptyUpdate } from "../lib/validate-update";

const router: IRouter = Router();

router.get("/clients", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(clientsTable)
    .orderBy(clientsTable.sortOrder);
  res.json(ListClientsResponse.parse(rows));
});

router.post("/admin/clients", requireAdminKey, async (req, res): Promise<void> => {
  const parsed = CreateClientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db
    .insert(clientsTable)
    .values({
      name: parsed.data.name,
      logoUrl: parsed.data.logoUrl ?? "",
      websiteUrl: parsed.data.websiteUrl ?? "",
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    .returning();
  res.status(201).json(ClientItem.parse(row));
});

router.put("/admin/clients/:id", requireAdminKey, async (req, res): Promise<void> => {
  const params = UpdateClientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateClientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  if (rejectEmptyUpdate(parsed.data, res)) return;
  const [row] = await db
    .update(clientsTable)
    .set(parsed.data)
    .where(eq(clientsTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Client not found" });
    return;
  }
  res.json(ClientItem.parse(row));
});

router.delete("/admin/clients/:id", requireAdminKey, async (req, res): Promise<void> => {
  const params = DeleteClientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .delete(clientsTable)
    .where(eq(clientsTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Client not found" });
    return;
  }
  res.status(204).send();
});

export default router;
