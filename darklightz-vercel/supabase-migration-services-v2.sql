-- ============================================================================
-- Darklightz Studio — Services System v2 Migration
-- Run this against your Supabase database (SQL Editor tab).
-- All statements use IF NOT EXISTS / IF EXISTS so it is safe to re-run.
-- ============================================================================

-- 1. Extend the services table
ALTER TABLE services
  ADD COLUMN IF NOT EXISTS category        text NOT NULL DEFAULT 'website-services',
  ADD COLUMN IF NOT EXISTS hero_image      text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS price           text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS delivery_time   text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS featured_badge  text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS whats_included  text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS process_steps   text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS cta_text        text NOT NULL DEFAULT 'Get Started';

-- 2. Add service slug to testimonials for service-specific filtering
ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS service_slug text NOT NULL DEFAULT '';

-- 3. Create the inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id            serial PRIMARY KEY,
  name          text NOT NULL,
  email         text NOT NULL,
  phone         text NOT NULL DEFAULT '',
  company       text NOT NULL DEFAULT '',
  service_slug  text NOT NULL,
  service_title text NOT NULL,
  price         text NOT NULL DEFAULT '',
  budget        text NOT NULL DEFAULT '',
  description   text NOT NULL,
  status        text NOT NULL DEFAULT 'new',
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 4. Seed the 11 services (update existing rows or insert new ones)
--    Run only once. If you already have services data, skip this section
--    or adjust slugs to match your existing records.
-- ============================================================================

INSERT INTO services (title, slug, summary, description, icon, sort_order, category, hero_image, price, delivery_time, featured_badge, whats_included, process_steps, cta_text)
VALUES
  ('Landing Page',               'landing-page',       'High-converting single-page websites that turn visitors into leads.',                        'A single, conversion-focused page designed to turn visitors into leads or buyers. Ideal for product launches, campaigns, and lead generation.',                                    '✦', 1,  'website-services',  '', 'From PKR 15,000',     '3–5 days',    'Popular',  ARRAY['Custom design','Mobile responsive','Contact / lead form','SEO meta tags','Fast loading (< 2s)','1 round of revisions'],                                                                          ARRAY['We learn your goals, target audience, and offer.','We plan the page structure and copywriting flow.','We design a premium custom layout.','We build it clean with optimised code.','You review and request changes.','We hand over the live page with a full walkthrough.','30-day support for any issues post-launch.'], 'Get Started'),
  ('Business Website',           'business-website',   'Professional multi-page websites that build credibility and drive growth.',                   'A professional multi-page website that builds credibility, communicates your offer clearly, and drives enquiries. Perfect for established businesses ready to grow.',              '✦', 2,  'website-services',  '', 'From PKR 25,000',     '7–10 days',   '',         ARRAY['Up to 6 pages','Custom design system','Mobile & tablet responsive','Blog / news section','Contact form','SEO optimisation','Google Analytics setup','2 rounds of revisions'],                              ARRAY['Stakeholder discovery call to understand your business.','Sitemap and content plan agreed.','Design concept and style guide.','Full development across all pages.','Client review with consolidated feedback.','Launch and domain handover.','30-day post-launch support.'],                              'Get Started'),
  ('Custom-Coded Website',       'custom-website',     'Fully bespoke websites with hand-crafted code for maximum performance.',                      'Hand-crafted from scratch — no templates, no shortcuts, just precision engineering. For brands that refuse to look like everyone else.',                                           '✦', 3,  'website-services',  '', 'From PKR 50,000',     '14–21 days',  'Premium',  ARRAY['Fully custom codebase','React / Next.js or preferred stack','Advanced animations (GSAP / Framer Motion)','Custom CMS integration','Performance-optimised','SEO architecture','3 rounds of revisions','Full source code handover'], ARRAY['Deep-dive discovery: goals, tech requirements, integrations.','Technical spec and architecture planning.','UI/UX design with interactive prototype.','Full-stack development with CI/CD pipeline.','QA review across devices and browsers.','Production deployment and DNS configuration.','Extended 60-day support included.'], 'Start Project'),
  ('Shopify Website',            'shopify',            'Revenue-optimised Shopify stores built to convert browsers into buyers.',                     'Revenue-optimised Shopify stores designed for conversion. From product pages to checkout — every element built to increase your average order value.',                              '✦', 4,  'website-services',  '', 'From PKR 30,000',     '7–14 days',   '',         ARRAY['Custom Shopify theme','Product pages + collections','Payment gateway setup','Shipping configuration','Inventory management','Email notifications','Mobile-first design','2 rounds of revisions'],             ARRAY['Store goals, product catalogue, and brand review.','Theme and layout planning.','Custom Shopify theme design.','Theme development + product upload.','Payment, shipping, and checkout QA.','Store goes live with launch checklist.','30-day Shopify support.'],                                          'Build My Store'),
  ('WordPress Website',          'wordpress',          'Elegant, scalable WordPress sites with custom themes and plugins.',                           'Elegant WordPress sites built with custom themes. Easy for you to manage, optimised for search engines, and designed to grow with your business.',                                '✦', 5,  'website-services',  '', 'From PKR 20,000',     '7–10 days',   '',         ARRAY['Custom child theme','Page builder setup','Plugin configuration','SEO (Yoast / RankMath)','Speed optimisation','Security hardening','Admin training session','2 rounds of revisions'],                       ARRAY['Brand and content discovery.','Plugin and theme selection.','Design and layout mockup.','WordPress development and setup.','Content migration and QA.','Launch with admin walkthrough.','14-day post-launch support.'],                                                                                 'Get Started'),
  ('Website Redesign',           'website-redesign',   'Transform your outdated site into a premium digital experience.',                             'Transform your outdated website into a premium, high-performing digital experience. We preserve your SEO while elevating your design and speed.',                                '✦', 6,  'website-services',  '', 'From PKR 20,000',     '7–14 days',   '',         ARRAY['Full visual overhaul','Improved user experience','Speed optimisation','Mobile responsiveness','Updated copy (optional)','SEO preservation','2 rounds of revisions','Analytics re-setup'],                   ARRAY['Audit of existing site — performance, design, and UX.','Redesign strategy and priority list.','New design concepts.','Development of new version.','Side-by-side comparison and feedback.','Migration to the new design.','30-day monitoring period.'],                                                  'Redesign My Site'),
  ('Bug Fixes',                  'bug-fixes',          'Fast, reliable fixes for any website issue — guaranteed resolution.',                         'Fast, reliable resolution for any website issue. We diagnose the root cause, fix it properly, and monitor for regression. One-off or retainer basis.',                             '✦', 7,  'website-services',  '', 'From PKR 5,000',      '1–3 days',    '',         ARRAY['Issue diagnosis','Root cause fix','Cross-browser QA','Progress report','Post-fix monitoring','Documentation of changes'],                                                                                        ARRAY['You describe the issue — screenshots welcome.','We diagnose the root cause.','Fix is designed and planned.','Fix is applied in a staging environment.','You review the fix.','Fix is deployed to production.','7-day monitoring for regression.'],                                                       'Fix My Site'),
  ('Monthly Website Maintenance','website-maintenance','Ongoing care to keep your site secure, fast, and up-to-date.',                                 'Ongoing care to keep your site secure, fast, and up-to-date — every month. No surprises, no emergency fees, just a reliable partner keeping your site healthy.',             '✦', 8,  'website-services',  '', 'From PKR 8,000/mo',   'Ongoing',     '',         ARRAY['Monthly security updates','Plugin/theme updates','Performance monitoring','Uptime monitoring','Monthly report','1 minor edit per month','Priority bug fixes','24h response SLA'],                             ARRAY['Onboarding: access review and baseline audit.','Monthly maintenance schedule agreed.','Design of recurring task checklist.','Monthly updates and monitoring.','Report delivered on the 1st of each month.','Ongoing priority support.','Quarterly performance deep-dive.'],                              'Start Maintenance'),
  ('Video Editing',              'video-editing',       'Cinematic edits that capture attention and keep viewers watching.',                            'Cinematic edits that capture attention in the first 3 seconds and hold viewers to the end. Reels, YouTube, ads, promos — platform-optimised every time.',                         '✦', 9,  'content-creation',  '', 'From PKR 5,000',      '2–4 days',    '',         ARRAY['Full video edit','Colour grading','Sound design & music','Captions / subtitles','Thumbnail design','2 rounds of revisions','Multiple aspect ratios (16:9, 9:16, 1:1)','Delivered in 4K / HD'],              ARRAY['You share raw footage and style reference.','Edit plan and pacing review.','Rough cut with initial colour grading.','Full edit with sound and graphics.','You review with timestamped feedback.','Final export in all required formats.','7-day support for minor tweaks.'],                            'Edit My Video'),
  ('UGC Content',                'ugc-content',         'Authentic user-generated style content that builds trust and drives sales.',                   'Authentic, creator-style content that builds trust with your audience and drives sales for your brand. UGC that converts because it feels real.',                                   '✦', 10, 'content-creation',  '', 'From PKR 10,000',     '3–5 days',    'Trending', ARRAY['Script writing','Professional filming','On-brand editing','Hook-first structure','Captions & B-roll','Platform-optimised output','Usage rights','2 rounds of revisions'],                                    ARRAY['Brand brief: product, audience, and tone.','Scripting and hook development.','Visual style and creator match.','Filming session.','Editing with platform optimisation.','Final delivery with usage rights.','Performance review after 30 days.'],                                                          'Create My Content'),
  ('Monthly Content Management', 'content-management',  'Done-for-you content strategy, creation, and publishing every month.',                        'Done-for-you content strategy, creation, scheduling, and analytics. We run your social presence so you can focus on running your business.',                                      '✦', 11, 'content-creation',  '', 'From PKR 15,000/mo',  'Ongoing',     '',         ARRAY['Monthly content calendar','12–16 posts per month','Graphic design','Caption copywriting','Scheduling & publishing','Community management','Monthly analytics report','Strategy review call'],                  ARRAY['Onboarding: brand voice, audience, and goals.','30-day content strategy document.','Content calendar design and approval.','Weekly creation and scheduling.','You review before posts go live.','Publishing and real-time monitoring.','Monthly performance report + strategy iteration.'],                  'Manage My Content')
ON CONFLICT (slug) DO UPDATE SET
  category       = EXCLUDED.category,
  price          = EXCLUDED.price,
  delivery_time  = EXCLUDED.delivery_time,
  featured_badge = EXCLUDED.featured_badge,
  whats_included = EXCLUDED.whats_included,
  process_steps  = EXCLUDED.process_steps,
  cta_text       = EXCLUDED.cta_text;

-- Done! Verify with:
-- SELECT id, title, slug, category, price FROM services ORDER BY sort_order;
-- SELECT id, name, service_slug FROM testimonials;
-- SELECT id, name, email, service_slug FROM inquiries;
