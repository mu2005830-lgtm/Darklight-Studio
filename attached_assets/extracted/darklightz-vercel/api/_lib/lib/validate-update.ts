import type { Response } from "express";

/**
 * Guard for PATCH/PUT handlers: rejects an empty body with HTTP 400.
 * Returns `true` when the caller should abort (response already sent).
 *
 * Usage:
 *   if (rejectEmptyUpdate(parsed.data, res)) return;
 */
export function rejectEmptyUpdate(
  data: Record<string, unknown>,
  res: Response,
): boolean {
  if (Object.keys(data).length === 0) {
    res
      .status(400)
      .json({ error: "Update body must contain at least one field." });
    return true;
  }
  return false;
}
