---
name: Darklightz deployment rules
description: Hard constraints on deployment target, git workflow, and Vercel CLI usage for this project.
---

# Darklightz Deployment Rules

## The rule
**Never deploy to Replit.** Replit is a development environment only.

Production workflow:
```
Replit (dev) → git commit → push to GitHub → Vercel (production)
```

- GitHub is the ONLY source of truth — every completed change must be pushed before finishing.
- Vercel is the ONLY production target (team: darklightz, project: darklight-studio).
- Never use Replit Deployments.
- Never replace the GitHub repo or overwrite git history.

## Vercel deploy procedure (from repo root)
1. `git add -A && git commit -m "..."` 
2. Push via `gitPush({})` (Replit's built-in; handles GitHub auth) — fall back to `git push origin main` only if configured.
3. Link (one-time): `npx vercel link --token="$VERCEL_TOKEN" --project=darklight-studio --yes` — **run from monorepo root**.
4. Deploy: `npx vercel --prod --token="$VERCEL_TOKEN" --yes --cwd . --archive=tgz` — **always `--archive=tgz`** in monorepo.

**Why:** If Vercel token is unavailable: push to GitHub, explain what remains, ask the user for the token. Do NOT deploy anywhere else.

## Vercel project rootDirectory
The Vercel project (`darklight-studio`) must have `rootDirectory: darklightz-vercel` set. It was `null` initially, causing `vite build` to exit 127 (vite not found at archive root). Fixed via PATCH `/v9/projects/darklight-studio`. This is a one-time fix — it persists in the Vercel project settings.

## Gotchas
- Always run `vercel link` and deploy from the **monorepo root**, not from `darklightz-vercel/`. Running from inside the subproject makes Vercel look for a nested subfolder that doesn't exist.
- Always pass `--archive=tgz` — without it, Vercel hits the 15k-file limit in a monorepo.
- **Never run `npm install` inside `darklightz-vercel/`** — `darklightz-vercel` is a pnpm workspace member; running npm install creates a `package-lock.json` (gitignored but present on disk) that makes Vercel detect npm instead of pnpm, causing a hard npm crash ("Exit handler never called!"). If it happens, delete `package-lock.json` before deploying. Run `pnpm install` from the workspace root instead.
- **`--cwd` creates a new Vercel project** — passing `--cwd /path/to/darklightz-vercel` makes Vercel look for `.vercel/project.json` inside that dir and creates a new project if not found. Always deploy from repo root without `--cwd`; copy `.vercel/project.json` to `darklightz-vercel/.vercel/` if needed.
- Check `vercel.json` rewrites: catch-all SPA rewrite must not swallow `/api/*` routes.
- After deploy, verify with `curl` on both page routes and `/api/*` routes before declaring success.
- Never print `$VERCEL_TOKEN` or run `env | grep -i vercel`.
