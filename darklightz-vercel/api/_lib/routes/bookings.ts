import { Router, type IRouter } from "express";
import { db, bookingsTable } from "../db/index.js";
import { CreateBookingBody, CreateBookingResponse } from "../api-zod/index.js";

const router: IRouter = Router();

router.post("/bookings", async (req, res): Promise<void> => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [booking] = await db
    .insert(bookingsTable)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company ?? null,
      service: parsed.data.service,
      preferredDate: new Date(parsed.data.preferredDate),
      message: parsed.data.message ?? null,
    })
    .returning();

  res.status(201).json(CreateBookingResponse.parse(booking));
});

export default router;
