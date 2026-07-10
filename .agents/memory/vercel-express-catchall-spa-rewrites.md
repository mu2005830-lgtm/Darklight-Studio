---
name: Vercel Express catch-all API + Vite SPA rewrites
description: Gotchas when deploying a Vite SPA + api/[...path].ts Express catch-all function to Vercel with custom vercel.json rewrites.
---

Two pitfalls for a Vite SPA + `api/[...path].ts` Express catch-all function on
Vercel with a custom `vercel.json` (especially with `rootDirectory` pointing
at a monorepo subfolder):

1. **SPA catch-all rewrite can swallow /api paths.** A naive
   `{ "source": "/(.*)", "destination": "/index.html" }` is inserted into the
   routing pipeline *before* Vercel's auto-generated function route, so every
   `/api/*` request matches the SPA fallback first (200 OK, HTML body,
   `x-vercel-cache: HIT` — looks like the API doesn't exist). Fix: exclude
   `/api/` with a negative lookahead: `"source": "/((?!api/).*)"`. Note
   Vercel's route-source regex validator rejects some lookahead variants
   (e.g. alternation with `$` inside `(?!...)`) — keep it to the simple
   `(?!api/)` form; bare `/api` (no trailing segment) falling through to the
   SPA is a harmless edge case, not worth a more exotic pattern.

2. **Zero-config catch-all route can be single-segment only.** Inspect
   `.vercel/output/config.json` (from a local `vercel build`) rather than
   guessing — the auto-generated function route was observed as
   `^/api/([^/]+)$` (single segment only), so nested paths like
   `/api/admin/content` 404'd while `/api/services` worked. Fix: add an
   explicit rewrite *before* the SPA one that captures multiple segments:
   `{ "source": "/api/:path*", "destination": "/api/[...path]" }`. The
   destination/query-param naming doesn't matter much since an Express app
   passed straight through to the function reads the real `req.url`, which
   Vercel preserves from the original request.

**Why:** found by diffing `.vercel/output/config.json` from a local
`vercel build` against live curl behavior (fresh single- vs multi-segment
`/api/...` requests).
**How to apply:** when "API routes 404 or return HTML" on Vercel for an
Express-in-serverless-function + SPA-rewrite setup, run `vercel build`
locally and read the generated `routes` array before iterating on
`vercel.json` syntax blind.
