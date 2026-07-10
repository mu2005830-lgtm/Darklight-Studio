// Vercel serverless entry point.
// The `[...path].ts` catch-all filename makes Vercel route every request
// under /api/* (with the full path and query string intact) into this one
// function — no vercel.json rewrite is needed for the API. Express itself
// never calls `.listen()` here; Vercel's Node runtime invokes the exported
// handler per-request.
import type { VercelRequest, VercelResponse } from "@vercel/node";
import serverless from "serverless-http";
import app from "./_lib/app";

const handler = serverless(app);

export default async function (req: VercelRequest, res: VercelResponse) {
  return handler(req as any, res as any);
}
