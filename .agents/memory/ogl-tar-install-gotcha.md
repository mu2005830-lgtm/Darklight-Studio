---
name: ogl / tar install gotcha
description: How to install ogl (and work around the tar-6.2.1 Replit firewall block) in darklightz-vercel
---

## The problem
`pnpm install` inside `darklightz-vercel/` fails with:
```
ERR_PNPM_FETCH_403 GET http://package-firewall.replit.local/npm/tar/-/tar-6.2.1.tgz: Forbidden - 403
```
The dependency chain is: `@vercel/node@3.2.29 → @vercel/nft@0.27.3 → @mapbox/node-pre-gyp@1.0.11 → tar@6.2.1`.
`tar-6.2.1` is blocked by Replit's package firewall (too new).

## Fix
`darklightz-vercel` is NOT a pnpm workspace member, so `pnpm.overrides` in its `package.json` are not applied. Work around:

1. Temporarily remove `@vercel/node` from `devDependencies` in `darklightz-vercel/package.json`
2. Run `pnpm install` (succeeds — vite and all frontend deps install fine)
3. Restore `@vercel/node` to `devDependencies`

**Why:** `@vercel/node` is only needed for the Vercel serverless build, not for the local dev server or frontend. Removing it for the install step avoids the tar-6.2.1 chain.

## ogl manual install (if needed)
ogl is a zero-dependency ESM library. Download the tarball and extract manually:
```bash
curl -s http://package-firewall.replit.local/npm/ogl/-/ogl-1.0.11.tgz -o /tmp/ogl.tgz
mkdir -p darklightz-vercel/node_modules/ogl
mkdir -p /tmp/ogl-extracted
tar -xzf /tmp/ogl.tgz -C /tmp/ogl-extracted
cp -r /tmp/ogl-extracted/package/* darklightz-vercel/node_modules/ogl/
```
Also add `"ogl": "^1.0.11"` to `dependencies` in `darklightz-vercel/package.json`.

**How to apply:** Any time you need to add a new package to darklightz-vercel and hit the tar-6.2.1 block.
