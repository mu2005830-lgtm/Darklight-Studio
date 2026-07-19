# Darklightz Studio — Replit Workspace Guide

> **Read this first, every time, before touching anything.**

---

## 🔴 The #1 Rule

**This website runs on Vercel. Not Replit.**

Replit is used ONLY as a code editor and deployment launcher.

```
Make changes in Replit
         ↓
  git commit + push
         ↓
    GitHub (source of truth)
         ↓
    Deploy to Vercel
         ↓
  darklight-studio.vercel.app (live site)
```

- ❌ NEVER deploy on Replit
- ❌ NEVER use Replit Deployments
- ❌ NEVER replace the GitHub repository
- ❌ NEVER overwrite Git history
- ✅ GitHub is the ONLY permanent home for this code
- ✅ Vercel is the ONLY production environment

---

## 📁 Project Structure

```
workspace/
├── darklightz-vercel/         ← THE ACTUAL WEBSITE (everything is here)
│   ├── src/                   ← React frontend (Vite)
│   │   ├── pages/             ← All pages
│   │   ├── components/        ← Shared components
│   │   └── lib/               ← API client hooks, portal auth, etc.
│   ├── api/                   ← Vercel serverless functions
│   │   └── _lib/              ← Express app, DB schema, routes, email
│   ├── public/                ← Static assets (logo, favicon, robots.txt, sitemap.xml)
│   ├── vercel.json            ← Vercel build config
│   ├── vite.config.ts         ← Frontend build config
│   └── package.json           ← Dependencies
│
├── REPLIT-WORKSPACE-GUIDE.md  ← This file
└── (other pnpm workspace files — workspace plumbing, ignore)
```

---

## 🚀 How to Deploy (The Exact Method That Works)

This is the process that was used successfully. Follow it exactly.

### Prerequisites (one-time setup, already done)
- GitHub repo connected: `https://github.com/mu2005830-lgtm/Darklight-Studio`
- Replit secret `VERCEL_TOKEN` is set (the only external credential needed)
- Vercel project `darklight-studio` under team `darklightz` is linked
- Vercel project `rootDirectory` is set to `darklightz-vercel` (already configured)

### Deploy Steps

**Step 1 — Make your changes** in `darklightz-vercel/`

**Step 2 — Build locally to check for errors** (optional but recommended)
```bash
cd darklightz-vercel && npx vite build
```

**Step 3 — Commit**
```bash
cd /home/runner/workspace
git add -A
git commit -m "Describe what you changed"
```

**Step 4 — Push to GitHub** (use Replit's built-in push, NOT raw git push)

In the AI agent, run:
```javascript
const result = await gitPush({});
console.log(result);
```

Or from the shell (only if the agent's gitPush isn't available):
```bash
git push origin main
```

**Step 5 — Deploy to Vercel**
```bash
cd /home/runner/workspace
npx vercel --prod --token="$VERCEL_TOKEN" --yes --cwd /home/runner/workspace --archive=tgz
```

**CRITICAL FLAGS — all three are required:**
- `--cwd /home/runner/workspace` — always run from the monorepo root
- `--archive=tgz` — required in a monorepo (without it, Vercel hits file count limits)
- `--prod` — deploys to production (not a preview URL)

**Step 6 — Verify**
```bash
curl -o /dev/null -w "%{http_code}" https://darklight-studio.vercel.app/
curl -o /dev/null -w "%{http_code}" https://darklight-studio.vercel.app/api/services
```
Both should return `200`.

---

## ⚠️ Known Gotchas (Read Before Deploying)

### 1. Never commit `package-lock.json` inside `darklightz-vercel/`
If you run `npm install` inside `darklightz-vercel/`, it creates a `package-lock.json`. **Delete it before committing.** Its presence tells Vercel to switch from pnpm to npm, which crashes the build with `npm error Exit handler never called!`

Check before committing:
```bash
ls darklightz-vercel/package-lock.json 2>/dev/null && echo "DELETE THIS FILE" || echo "OK"
```

### 2. Always run Vercel commands from the monorepo root
Vercel's `rootDirectory` is set to `darklightz-vercel/` in the project settings. Running `vercel` from inside `darklightz-vercel/` makes Vercel look for a nested `darklightz-vercel/darklightz-vercel/` folder that doesn't exist, causing the build to fail.

Always: `cd /home/runner/workspace && npx vercel ...`

### 3. The `VERCEL_TOKEN` secret is already in Replit
Do not ask for it again. It's stored as a Replit secret and available as `$VERCEL_TOKEN` in shell commands. Never print it or log it.

### 4. `--archive=tgz` is mandatory
Without this flag, Vercel tries to upload every file individually and fails with `files should NOT have more than 15000 items` in a monorepo.

### 5. If the build fails, check Vercel build logs
```bash
# Get the deployment ID from the failed deploy output, then:
curl -s "https://api.vercel.com/v2/deployments/dpl_XXXX/events?limit=100" \
  -H "Authorization: Bearer $VERCEL_TOKEN" | node -e "
let d=''; process.stdin.on('data',c=>d+=c).on('end',()=>{
  JSON.parse(d).forEach(l=>{ if(l.payload?.text) console.log(l.payload.text) });
})" | tail -40
```

---

## 🔑 Environment Variables

### Already Set in Replit Secrets
| Secret | Purpose |
|--------|---------|
| `VERCEL_TOKEN` | Required for deploying to Vercel from Replit |
| `SESSION_SECRET` | General session secret |

### Required in Vercel (set at vercel.com → Project → Settings → Environment Variables)
| Variable | Where to Get It | Purpose |
|----------|-----------------|---------|
| `DATABASE_URL` | Supabase → Settings → Database → Connection string (Transaction pooler, port 6543) | Main database connection |
| `SUPABASE_URL` | Supabase → Settings → API → Project URL | Server-side Supabase client |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role key | File uploads, portal auth verification |
| `VITE_SUPABASE_URL` | Same as SUPABASE_URL | Client portal auth (exposed to frontend) |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon/public key | Client portal auth (exposed to frontend) |
| `ADMIN_DASHBOARD_KEY` | Any long random string (`openssl rand -base64 24`) | Protects /admin panel |
| `RESEND_API_KEY` | resend.com → API Keys | All email notifications |
| `ADMIN_NOTIFICATION_EMAIL` | Your email address | Receives admin alerts (reviews, uploads, etc.) |
| `FROM_EMAIL` | e.g. `Darklightz Studio <noreply@darklightz.studio>` | Outbound email sender |
| `ALLOWED_ORIGIN` | `https://darklight-studio.vercel.app` | CORS restriction in production |

---

## 🗄️ Supabase Setup

### Database
- Provider: Supabase Postgres
- Schema files: `darklightz-vercel/supabase-schema.sql` (main), plus migration files
- Run migrations in Supabase Dashboard → SQL Editor

### Migration Files (run in order)
| File | What it does |
|------|-------------|
| `supabase-schema.sql` | Main schema — all tables |
| `supabase-migration-portal.sql` | Portal phase additions |
| `supabase-migration-reviews.sql` | Reviews table |
| `supabase-migration-services-v2.sql` | Services table v2 |
| `supabase-migration-case-study.sql` | W Luxury Perfumes case study |
| `supabase-migration-journal.sql` | 10 journal article templates |

### Storage Bucket
- Bucket name: `darklightz-media`
- Must be set to **Public**
- Create at: Supabase → Storage → New bucket

### Folder Structure in `darklightz-media` bucket
```
darklightz-media/
├── uploads/          ← Admin image uploads (general)
├── portal-uploads/   ← Client-uploaded files (per project)
├── Hero Images/
├── Studio Story/
├── Portfolio/
├── Case Studies/
├── Journal/
├── Services/
├── Team/
├── Testimonials/
├── Client Logos/
├── SEO Images/
├── Invoices/
├── Documents/
└── Brand Assets/
```

---

## 🏗️ What Was Built (Feature Map)

### Public Site
| Page | Route | Notes |
|------|-------|-------|
| Home | `/` | Hero, services preview, testimonials, CTA |
| Services | `/services` | DB-driven via admin |
| Portfolio | `/portfolio` | DB-driven |
| Case Studies | `/case-studies` | DB-driven; W Luxury Perfumes case study added |
| About / Studio | `/about` | Studio story, timeline, team |
| Pricing | `/pricing` | DB-driven |
| Journal | `/blog` | DB-driven; 10 article templates added |
| Contact | `/contact` | Form → DB + email to admin |
| Book a Call | `/book-a-call` | Booking form |
| Leave a Review | `/submit-review` | Linked from footer |

### Admin Panel (`/admin`)
Protected by `ADMIN_DASHBOARD_KEY`.

| Section | What you can manage |
|---------|-------------------|
| Dashboard | Overview stats |
| Services | Add/edit/delete services |
| Portfolio | Add/edit/delete portfolio projects |
| Case Studies | Add/edit/delete case studies |
| Testimonials | Add/edit/delete testimonials |
| Blog Posts | Add/edit/delete journal articles |
| Pricing | Add/edit/delete pricing plans |
| FAQ | Add/edit/delete FAQ items |
| Team | Add/edit/delete team members |
| Clients | CRM client list |
| Contacts | View contact form submissions |
| Bookings | View booking requests |
| Site Settings | Global settings (site name, SEO, etc.) |
| Social Links | Edit social media URLs |
| **Media Center** | Upload/delete/copy URL for all files in Supabase Storage |
| Client Portal | Manage portal clients, projects, milestones, messages, invoices |
| Reviews | Approve/reject client reviews |

### Client Portal (`/portal`)
| Feature | Status |
|---------|--------|
| Login / Signup | Supabase Auth |
| Project dashboard | Project progress, milestones |
| File downloads | Admin-uploaded deliverables |
| Client file upload | Drag & drop — emails admin immediately |
| Messaging | Two-way client ↔ admin |
| Revision requests | Emails admin |
| Support tickets | Full thread |
| Invoices | View, download (custom PDF or generated) |
| Notifications | Real-time portal notifications |

### Email Notifications (via Resend)
All these events send email when `RESEND_API_KEY` and `ADMIN_NOTIFICATION_EMAIL` are set:
- New contact form submission
- New booking request
- New review submitted (pending approval)
- Client sent a message
- Client submitted a revision request
- Client requested a progress update
- Client uploaded a file ← added in polish sprint
- Support ticket / reply
- Project status changed (to client)
- Project completed (to client)

---

## 🔄 Working in Replit (for future AI agents)

### Before Making Any Change
1. Read this file (`REPLIT-WORKSPACE-GUIDE.md`)
2. Read `.agents/memory/darklightz-deployment-rules.md`
3. Understand: all changes go to `darklightz-vercel/`

### Making Changes
1. Edit files in `darklightz-vercel/`
2. Test the build: `cd darklightz-vercel && npx vite build`
3. Fix any TypeScript errors before committing

### Deploying
Follow the **Deploy Steps** section above exactly. One token (`VERCEL_TOKEN`) is all you need — it's already in Replit secrets. Do not ask the user for Vercel credentials, project names, team names, or any other Vercel details — they are all already configured.

### What NOT to Do
- Do not run the site on Replit
- Do not create Replit workflows for the Darklightz site
- Do not create new Replit artifacts for this project
- Do not ask the user for their Vercel token (it's already saved as a secret)
- Do not ask for Supabase keys before checking if they're already set in Vercel
- Do not restructure the project layout
- Do not migrate to a different database
- Do not redesign anything without explicit user instruction

---

## 📞 Project Contact Details (hardcoded in site)
- **Email:** darklightzstudiu@gmail.com
- **WhatsApp:** +92 335 0501287
- **Instagram:** @darklightzstudio
- **Location:** Walton, Lahore, Punjab, Pakistan

---

## 🌐 URLs
| Environment | URL |
|------------|-----|
| Production | https://darklight-studio.vercel.app |
| GitHub | https://github.com/mu2005830-lgtm/Darklight-Studio |
| Vercel Dashboard | https://vercel.com/darklightz/darklight-studio |
| Supabase Dashboard | https://supabase.com/dashboard |

---

*Last updated by AI agent during production polish sprint — July 2026*
