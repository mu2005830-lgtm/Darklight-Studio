// Vercel serverless entry point.
// The `[...path].ts` catch-all filename makes Vercel route every request
// under /api/* (with the full path and query string intact) into this one
// function — no vercel.json rewrite is needed for the API. Express itself
// never calls `.listen()` here; Vercel's Node runtime invokes the exported
// handler per-request with real Node `http.IncomingMessage`/`ServerResponse`
// objects. An Express app is already a valid `(req, res)` request listener,
// so it's passed straight through. (Do NOT wrap it in `serverless-http` —
// that library translates AWS Lambda-style events, not raw Node req/res, and
// mangles the request path when given real http objects, breaking every
// route.)
import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "./_lib/app.js";

export default async function (req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}
