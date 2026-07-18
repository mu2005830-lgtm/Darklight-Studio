import type { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import { db, portalUsersTable } from "../db/index.js";
import { eq } from "drizzle-orm";

// Extend Express Request to carry the authenticated portal user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      portalUser?: typeof portalUsersTable.$inferSelect;
      supabaseUserId?: string;
    }
  }
}

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.");
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Middleware that verifies the Supabase JWT from Authorization: Bearer <token>,
 * then looks up (or auto-provisions) the portal_users row and attaches it to req.portalUser.
 */
export const requirePortalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing authorization token." });
    return;
  }
  const token = authHeader.slice(7);

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({ error: "Invalid or expired session token." });
      return;
    }

    const supabaseUser = data.user;
    req.supabaseUserId = supabaseUser.id;

    // Look up portal user record
    let [portalUser] = await db
      .select()
      .from(portalUsersTable)
      .where(eq(portalUsersTable.supabaseUserId, supabaseUser.id));

    // Auto-provision on first authenticated call
    if (!portalUser) {
      const email = supabaseUser.email ?? "";
      const name =
        (supabaseUser.user_metadata?.name as string | undefined) ??
        (supabaseUser.user_metadata?.full_name as string | undefined) ??
        email.split("@")[0] ??
        "";
      [portalUser] = await db
        .insert(portalUsersTable)
        .values({ supabaseUserId: supabaseUser.id, email, name })
        .returning();
    }

    req.portalUser = portalUser;
    next();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Auth error";
    res.status(500).json({ error: message });
  }
};
