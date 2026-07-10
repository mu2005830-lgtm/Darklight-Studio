import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Supabase's connection poolers (and most managed Postgres providers) require
// TLS for connections coming from outside their network, which is always the
// case for a Vercel serverless function. `rejectUnauthorized: false` accepts
// Supabase's certificate chain without needing to vendor its CA bundle —
// this mirrors Supabase's own documented Node/pg connection snippet.
const useSsl = !/^(localhost|127\.0\.0\.1)$/.test(
  new URL(process.env.DATABASE_URL).hostname,
);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
});
export const db = drizzle(pool, { schema });

export * from "./schema";
