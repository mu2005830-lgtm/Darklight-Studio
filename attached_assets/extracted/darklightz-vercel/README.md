# Darklightz — standalone Vercel + Supabase project

This is a decoupled export of the Darklightz site, converted from the Replit
pnpm-workspace project into an ordinary, single-package React + Vite app with
a Vercel-serverless API. Same pages, same design, same functionality — no
redesign or rebuild — just Replit/monorepo tooling removed.

## What changed vs. the Replit version

- **No monorepo.** This is one `package.json`, not a pnpm workspace member.
  All `workspace:*` dependencies (`@workspace/db`, `@workspace/api-zod`,
  `@workspace/api-client-react`) were vendored in as plain local files:
  - `api/_lib/db` — the Drizzle schema + Postgres client (unchanged: it
    already used a generic `pg`/`DATABASE_URL` connection, so it works with
    Supabase Postgres with zero code changes).
  - `api/_lib/api-zod` — the generated Zod request/response validators.
  - `src/lib/api-client` — the generated React Query API client used by every
    page (`useListServices`, `useCreateBooking`, etc.).
- **No Replit plugins.** Removed `@replit/vite-plugin-cartographer`,
  `@replit/vite-plugin-dev-banner`, `@replit/vite-plugin-runtime-error-modal`
  from `vite.config.ts` and `package.json`.
- **Express → Vercel serverless function.** The API server
  (`artifacts/api-server`) was an always-on Express app. It's now
  `api/[...path].ts`, a single Vercel Node function (using Vercel's
  catch-all filename convention) that wraps the same Express `app` (routes,
  validation, and business logic are byte-for-byte the same) via
  `serverless-http`. Every `/api/*` request — with the full path and query
  string intact — routes straight into this function; `vercel.json` only
  rewrites non-`/api` paths to `index.html` for client-side routing (via
  `wouter`).
- **Static seed images.** They used to be served by an Express
  `express.static` mount at `/api/assets`. They're now plain files under
  `public/api-assets/`, served directly by Vercel's static hosting — no
  server code needed. If you seed your Supabase database using the
  `portfolio_projects` / `case_studies` / `blog_posts` `image_url` columns,
  point them at `/api-assets/<filename>.jpg`.
- **Database:** unchanged schema, now targets Supabase Postgres instead of
  Neon/Replit's built-in Postgres. See `supabase-schema.sql`.

## One-time setup

1. **Create a Supabase project** (supabase.com), then grab the pooled
   connection string from Project Settings → Database → Connection string
   → URI (use the "Transaction" pooler on port 6543, not the direct
   connection — serverless functions open/close connections per request and
   will exhaust Supabase's direct connection limit otherwise).
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL` and a generated
   `ADMIN_DASHBOARD_KEY`.
3. Create the tables — either:
   - Run `supabase-schema.sql` in the Supabase SQL editor, **or**
   - `pnpm install` then `pnpm run db:push` (Drizzle Kit push, reads the same
     schema files).
4. Seed data. There's no seed script (the original project didn't have one
   either — content was entered by hand). Insert rows into `services`,
   `portfolio_projects`, `case_studies`, `testimonials`, `blog_posts`, and
   `pricing_plans` via the Supabase table editor or SQL, matching the columns
   in `supabase-schema.sql`.
5. `pnpm install`
6. `pnpm run dev` — runs the Vite dev server only. To exercise the API
   locally the way Vercel runs it, use `vercel dev` (Vercel CLI) instead,
   which serves both the static frontend and the `api/` function together.

## Deploying

1. Push this directory to a new GitHub repo.
2. Import the repo in Vercel. It auto-detects `vercel.json`
   (`buildCommand: vite build`, `outputDirectory: dist`) — no manual
   framework configuration needed.
3. In Vercel → Project → Settings → Environment Variables, set:
   - `DATABASE_URL` (Supabase pooled connection string)
   - `ADMIN_DASHBOARD_KEY`
   - `ALLOWED_ORIGIN` — set to your production URL (e.g.
     `https://darklightz.vercel.app`) after your first deploy, so CORS is
     locked down instead of wide open.
4. Deploy. The admin dashboard at `/admin` is gated by the passcode you set
   as `ADMIN_DASHBOARD_KEY` — the server rejects all admin requests if that
   env var is unset, so don't forget step 3.

## Notes / things to sanity-check after deploying

- `serverless-http` wraps the existing Express app as-is. If any single admin
  request (e.g. `dashboard-summary`) does multiple heavy DB calls, watch cold
  start + execution time against Vercel's function duration limits on your
  plan.
- The bundle warns about a >500kB JS chunk (mostly `three.js` /
  `@react-three/fiber` for the hero animation). This is pre-existing, not
  introduced by the migration — consider `build.rollupOptions.output.manualChunks`
  or dynamic `import()` for the 3D hero component if you want to optimize it
  later; functionality is unaffected either way.
- CORS defaults to allow-all when `ALLOWED_ORIGIN` is unset (useful for first
  deploy/testing) — set it once you have a stable production domain.
