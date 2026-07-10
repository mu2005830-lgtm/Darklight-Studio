import type { Request, Response, NextFunction } from "express";

/**
 * Express middleware that gates a route behind the ADMIN_DASHBOARD_KEY
 * environment variable. Sends 503 if the key is unconfigured (fail-closed),
 * and 401 if the provided x-admin-key header doesn't match.
 */
export const requireAdminKey = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const secret = process.env.ADMIN_DASHBOARD_KEY;
  if (!secret) {
    res
      .status(503)
      .json({ error: "Admin access is not configured on this server." });
    return;
  }
  const provided = req.header("x-admin-key");
  if (!provided || provided !== secret) {
    res
      .status(401)
      .json({ error: "Unauthorized. Invalid or missing admin key." });
    return;
  }
  next();
};
