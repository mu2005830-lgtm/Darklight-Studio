-- ============================================================
-- Case Study: W Luxury Perfumes (Raja Waqar)
-- Run this in the Supabase SQL Editor to add the case study.
-- ============================================================

INSERT INTO case_studies (
  title, slug, client, summary,
  challenge, solution, result,
  image_url, metric_label, metric_value, sort_order
) VALUES (
  'W Luxury Perfumes — Brand Launch & Digital Presence',
  'w-luxury-perfumes',
  'Raja Waqar — W Luxury Perfumes',

  'A complete brand identity and digital presence build for W Luxury Perfumes, a new premium fragrance brand based in Pakistan. From zero to a fully operational online brand in under 30 days.',

  'Raja Waqar came to us with a vision: launch a premium perfume brand that could compete with established luxury players in the Pakistani market and attract discerning buyers online. The challenge was multi-layered. There was no existing brand identity, no website, no social presence, and no content strategy. The product quality was exceptional — the branding and digital infrastructure needed to match.',

  'We began with a deep discovery session to understand the brand values: luxury, exclusivity, sophistication, and local pride. From there we built the entire brand identity — logo, typography system, colour palette (deep blacks, burnished gold, and ivory), and packaging concepts — all designed to communicate premium quality at a glance.

The website was built on a clean, performance-first architecture with cinematic visuals, smooth animations, and a seamless mobile experience. Product photography direction was provided to ensure visual consistency. We wrote the full copy — from the homepage headline to every product description — in a tone that felt luxurious without being distant.

SEO foundations were laid from day one: proper heading structure, meta tags, schema markup for products, a clean sitemap, and keyword targeting for fragrance-related searches across Pakistan. A content plan was created to give the brand a reason for customers to return.',

  'The brand launched successfully within 28 days of engagement. The website achieved a Lighthouse performance score above 90. Organic search visibility started building within the first three weeks. The client received direct inquiries through the website within days of launch, validating the positioning and the copy.',

  'https://images.unsplash.com/photo-1541643600914-78b084683702?q=80&w=2000&auto=format&fit=crop',
  'Launch Time',
  '28 Days',
  1
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  client = EXCLUDED.client,
  summary = EXCLUDED.summary,
  challenge = EXCLUDED.challenge,
  solution = EXCLUDED.solution,
  result = EXCLUDED.result,
  image_url = EXCLUDED.image_url,
  metric_label = EXCLUDED.metric_label,
  metric_value = EXCLUDED.metric_value,
  sort_order = EXCLUDED.sort_order;
