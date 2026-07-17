# Darklightz Studio

Darklightz Studio's marketing/agency site — a Vite + React SPA with a Vercel-serverless Express API, deployed standalone to Vercel (not run through Replit's pnpm-workspace artifacts).

## Run & Operate

- The real app lives in `darklightz-vercel/` — a standalone, decoupled export (its own `package.json`, not a pnpm workspace member). See `darklightz-vercel/README.md` for full local-dev and one-time Supabase setup instructions.
- `artifacts/api-server` and `artifacts/mockup-sandbox` at the repo root are generic empty scaffolding auto-created by the Replit import — they are **not** part of this project and are not wired to anything. Their workflows fail (missing deps) and can be ignored/removed.
- Production deploy: pushed to GitHub (`origin` → `mu2005830-lgtm/Darklight-Studio`) and deployed via Vercel CLI to team `darklightz`, project `darklight-studio` → https://darklight-studio.vercel.app.

  **Prerequisites:** GitHub origin remote configured + Replit GitHub account connected (grants push creds automatically — no PAT needed). `VERCEL_TOKEN` secret set in Replit secrets, scoped to the darklightz team.

  **Step 1 — Commit:**
  ```
  git add -A && git commit -m "Describe the change"
  ```
  **Step 2 — Push to GitHub** (use the git-remote skill / `gitPush({})` callback — handles GitHub auth automatically):
  ```
  # via CodeExecution: await gitPush({})
  ```
  **Step 3 — Link Vercel project** (once per session, from repo root):
  ```
  npx vercel projects ls --token="$VERCEL_TOKEN"
  npx vercel link --token="$VERCEL_TOKEN" --project=darklight-studio --yes
  ```
  **Step 4 — Deploy to production** (from repo root):
  ```
  npx vercel --prod --token="$VERCEL_TOKEN" --yes --cwd /home/runner/workspace --archive=tgz
  ```
  **Step 5 — Verify:** curl a few page routes and `/api/*` routes, and screenshot the production URL before declaring success.

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
- `vercel link`/`vercel deploy` must run from the repo root, not `darklightz-vercel/`. Running from inside the subfolder makes Vercel look for a nested `darklightz-vercel/darklightz-vercel/` path and fail with "path does not exist."
- Always pass `--archive=tgz` when deploying from a monorepo. Without it, Vercel tries to upload every file individually and errors with `missing_archive` / "files should NOT have more than 15000 items" once node_modules across workspaces accumulate.
- If `vercel link` was previously run inside a subfolder, `.vercel/project.json` may be in the wrong place — re-run link from the repo root to fix it.
- Never print `$VERCEL_TOKEN` — don't run `env | grep -i vercel` or similar. Reference it only inline in commands.
- Vercel's zero-config catch-all API routes only support a single dynamic segment (e.g. `[...path]`, not deeper nesting).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details (not currently used by the live app, only present as unused scaffolding).
