---
name: Services System v2
description: Details of the complete services system built for Darklightz Studio — schema, routes, frontend pages, and deployment notes.
---

# Services System v2

## What was built
- 11 service pages via `/services/:slug` route — all served by a single `service-detail.tsx` component
- Redesigned `/services` hub with category filter tabs and premium service cards
- `InquiryModal` component — opens on "Get Started", auto-populates service, submits to `/api/inquiries`
- New `inquiries` table (DB schema + route)
- Extended `services` table: category, heroImage, price, deliveryTime, featuredBadge, whatsIncluded (text[]), processSteps (text[]), ctaText
- Extended `testimonials` table: serviceSlug for per-service filtering
- New API routes: `GET /api/services/:slug`, `/services/:slug/portfolio`, `/services/:slug/faqs`, `/services/:slug/testimonials`, `POST /api/inquiries`

## Key decisions
- `faq_items.category` field doubles as service slug — no schema change needed for service-specific FAQs
- `portfolio_projects.category` is filtered by ILIKE `%slug%` for service-specific portfolio
- Frontend uses FALLBACK data per slug when DB hasn't been seeded — graceful degradation

**Why:** The DB is on Supabase and requires manual migration — the app must render correctly before the migration is run.

## Migration file
`darklightz-vercel/supabase-migration-services-v2.sql` — run this in Supabase SQL Editor. Includes ALTER TABLE statements + full seed data for all 11 services.

## What still needs doing
1. Run `supabase-migration-services-v2.sql` against Supabase — now also adds whatsapp_number column to site_settings. Until then, pages show fallback data and inquiry form will 500.
2. Add Inquiries section to admin dashboard (`GET /admin/inquiries` + `PATCH /admin/inquiries/:id/status` routes already built)

## WhatsApp number
+923351468615 — hardcoded in all src files, also configurable via Admin → Site Settings → Contact → WhatsApp Number once DB migration is run.

## Slug → service mapping
website-services: landing-page, business-website, custom-website, shopify, wordpress, website-redesign, bug-fixes, website-maintenance
content-creation: video-editing, ugc-content, content-management
