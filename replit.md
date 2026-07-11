# Darklightz Studio

Darklightz Studio's marketing/agency site — a Vite + React SPA with a Vercel-serverless Express API, deployed standalone to Vercel (not run through Replit's pnpm-workspace artifacts).

## Run & Operate

- The real app lives in `darklightz-vercel/` — a standalone, decoupled export (its own `package.json`, not a pnpm workspace member). See `darklightz-vercel/README.md` for full local-dev and one-time Supabase setup instructions.
- `artifacts/api-server` and `artifacts/mockup-sandbox` at the repo root are generic empty scaffolding auto-created by the Replit import — they are **not** part of this project and are not wired to anything. Their workflows fail (missing deps) and can be ignored/removed.
- Production deploy: pushed to GitHub (`origin` → `mu2005830-lgtm/Darklight-Studio`) and deployed via Vercel CLI to team `darklightz`, project `darklight-studio` → https://darklight-studio.vercel.app. Redeploy with:
  ```
  git add -A && git commit -m "..." && gitPush   # via git-remote skill
  npx vercel link --token="$VERCEL_TOKEN" --project=darklight-studio --yes   # from repo root
  npx vercel --prod --token="$VERCEL_TOKEN" --yes --cwd <repo-root> --archive=tgz
  ```
  Always run `vercel link`/`vercel deploy` from the monorepo root (not `darklightz-vercel/`) since Vercel's project root-directory setting expects that.
- Required secret: `VERCEL_TOKEN` (scoped to the darklightz team/project).
- DB: Supabase Postgres (not Replit's built-in Postgres) — connection string goes in `darklightz-vercel/.env` as `DATABASE_URL`.

## Stack

- Frontend: Vite + React, `wouter` for routing
- API: Express app wrapped as a single Vercel serverless function (`darklightz-vercel/api/[...path].ts`) via `serverless-http`
- DB: PostgreSQL (Supabase) + Drizzle ORM
- Validation: Zod, `drizzle-zod`
- Animation: GSAP (site follows a "light emerging from darkness" cinematic brand concept — see `attached_assets` for the original creative brief)

## Where things live

- `darklightz-vercel/` — the entire app (frontend `src/`, API `api/`, DB schema, Vercel config)
- `darklightz-vercel/vercel.json` — routing rewrites (SPA fallback + `/api/*` catch-all)
- `darklightz-vercel/supabase-schema.sql` — DB schema for manual Supabase setup

## Architecture decisions

- This app was originally built on Replit's pnpm-workspace/artifacts model, then exported to a standalone Vercel+Supabase project (see `darklightz-vercel/README.md` "What changed vs the Replit version"). The repo-root pnpm-workspace scaffolding present here is leftover from re-importing that export into Replit — it was not restored to the artifacts model, since the user chose to keep it running standalone on Vercel.

## Product

Darklightz Studio agency marketing site: home/hero, services, work/portfolio, case studies, pricing, journal/blog, contact, and a passcode-gated `/admin` content dashboard.

## User preferences

- Keep this project as a standalone Vercel/Supabase app rather than migrating it into Replit's pnpm-workspace artifacts model.

## Gotchas

- A naive SPA catch-all rewrite can swallow `/api/*` requests if ordered before the API route — see `.agents/memory/vercel-express-catchall-spa-rewrites.md`.
- `vercel link`/`vercel deploy` must run from the repo root, not `darklightz-vercel/`, or Vercel looks for a nested duplicate folder and fails.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details (not currently used by the live app, only present as unused scaffolding).
