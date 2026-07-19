/**
 * SQL Editor — Admin-only route for running raw SQL against the database.
 * Protected by requireAdminKey. Executes any SQL the admin submits and
 * returns columns, rows, row-count, and execution time.
 */
import { Router, type IRouter } from "express";
import { requireAdminKey } from "../lib/auth.js";
import { pool } from "../db/index.js";

const router: IRouter = Router();

router.post("/admin/sql", requireAdminKey, async (req, res): Promise<void> => {
  const { query } = req.body as { query?: string };

  if (!query || !query.trim()) {
    res.status(400).json({ error: "query is required" });
    return;
  }

  if (!process.env.DATABASE_URL) {
    res.status(503).json({ error: "DATABASE_URL is not configured — no database is connected." });
    return;
  }

  const start = Date.now();

  try {
    const result = await pool.query(query);
    const executionMs = Date.now() - start;

    // Normalise — pool.query returns a single QueryResult for a single statement
    // and an array for multiple statements (via semicolon). Handle both.
    const resultArr = Array.isArray(result) ? result : [result];

    const responses = resultArr.map((r: import("pg").QueryResult) => ({
      command: r.command ?? "UNKNOWN",
      rowCount: r.rowCount ?? 0,
      columns: r.fields?.map((f) => f.name) ?? [],
      rows: r.rows ?? [],
    }));

    res.json({
      ok: true,
      executionMs,
      results: responses,
    });
  } catch (e: unknown) {
    const executionMs = Date.now() - start;
    const msg = e instanceof Error ? e.message : "Unknown database error";
    res.status(400).json({ ok: false, executionMs, error: msg });
  }
});

export default router;
