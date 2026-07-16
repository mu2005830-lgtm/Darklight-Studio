/**
 * CMS — additional Zod validators for Phase 2 content management.
 * These are hand-written (not orval-generated) and follow the same
 * conventions as api/_lib/api-zod/generated/api.ts.
 */
import * as zod from "zod";

// =========================================================================
// SITE SETTINGS (single-row config)
// =========================================================================

export const SiteSettingsResponse = zod.object({
  id: zod.number(),
  siteName: zod.string(),
  tagline: zod.string(),
  contactEmail: zod.string(),
  contactPhone: zod.string(),
  contactAddress: zod.string(),
  seoTitle: zod.string(),
  seoDescription: zod.string(),
  ogImageUrl: zod.string(),
  faviconUrl: zod.string(),
  logoText: zod.string(),
  logoUrl: zod.string(),
  primaryColor: zod.string(),
  accentColor: zod.string(),
  fontHeading: zod.string(),
  fontBody: zod.string(),
  heroTitle: zod.string(),
  heroSubtitle: zod.string(),
  heroCtaText: zod.string(),
  heroCtaUrl: zod.string(),
  updatedAt: zod.coerce.date(),
});

export const UpdateSiteSettingsBody = SiteSettingsResponse.omit({
  id: true,
  updatedAt: true,
}).partial();

// =========================================================================
// SOCIAL LINKS
// =========================================================================

export const SocialLinkItem = zod.object({
  id: zod.number(),
  platform: zod.string(),
  url: zod.string(),
  icon: zod.string(),
  sortOrder: zod.number(),
});

export const ListSocialLinksResponse = zod.array(SocialLinkItem);

export const CreateSocialLinkBody = zod.object({
  platform: zod.string().min(1),
  url: zod.string().min(1),
  icon: zod.string().optional(),
  sortOrder: zod.number().optional(),
});

export const UpdateSocialLinkParams = zod.object({ id: zod.coerce.number() });
export const UpdateSocialLinkBody = CreateSocialLinkBody.partial();
export const DeleteSocialLinkParams = zod.object({ id: zod.coerce.number() });

// =========================================================================
// TEAM MEMBERS
// =========================================================================

export const TeamMemberItem = zod.object({
  id: zod.number(),
  name: zod.string(),
  role: zod.string(),
  bio: zod.string(),
  avatarUrl: zod.string(),
  linkedinUrl: zod.string(),
  sortOrder: zod.number(),
});

export const ListTeamMembersResponse = zod.array(TeamMemberItem);

export const CreateTeamMemberBody = zod.object({
  name: zod.string().min(1),
  role: zod.string().min(1),
  bio: zod.string().optional(),
  avatarUrl: zod.string().optional(),
  linkedinUrl: zod.string().optional(),
  sortOrder: zod.number().optional(),
});

export const UpdateTeamMemberParams = zod.object({ id: zod.coerce.number() });
export const UpdateTeamMemberBody = CreateTeamMemberBody.partial();
export const DeleteTeamMemberParams = zod.object({ id: zod.coerce.number() });

// =========================================================================
// FAQ ITEMS
// =========================================================================

export const FaqItemItem = zod.object({
  id: zod.number(),
  question: zod.string(),
  answer: zod.string(),
  category: zod.string(),
  sortOrder: zod.number(),
});

export const ListFaqItemsResponse = zod.array(FaqItemItem);

export const CreateFaqItemBody = zod.object({
  question: zod.string().min(1),
  answer: zod.string().min(1),
  category: zod.string().optional(),
  sortOrder: zod.number().optional(),
});

export const UpdateFaqItemParams = zod.object({ id: zod.coerce.number() });
export const UpdateFaqItemBody = CreateFaqItemBody.partial();
export const DeleteFaqItemParams = zod.object({ id: zod.coerce.number() });

// =========================================================================
// CLIENTS
// =========================================================================

export const ClientItem = zod.object({
  id: zod.number(),
  name: zod.string(),
  logoUrl: zod.string(),
  websiteUrl: zod.string(),
  sortOrder: zod.number(),
});

export const ListClientsResponse = zod.array(ClientItem);

export const CreateClientBody = zod.object({
  name: zod.string().min(1),
  logoUrl: zod.string().optional(),
  websiteUrl: zod.string().optional(),
  sortOrder: zod.number().optional(),
});

export const UpdateClientParams = zod.object({ id: zod.coerce.number() });
export const UpdateClientBody = CreateClientBody.partial();
export const DeleteClientParams = zod.object({ id: zod.coerce.number() });

// =========================================================================
// ADMIN CRUD — SERVICES (Phase 2 extended)
// =========================================================================

export const AdminServiceBody = zod.object({
  title: zod.string().min(1),
  slug: zod.string().min(1),
  summary: zod.string().min(1),
  description: zod.string().min(1),
  icon: zod.string().optional(),
  sortOrder: zod.number().optional(),
  // Phase 2
  category: zod.string().optional(),
  heroImage: zod.string().optional(),
  price: zod.string().optional(),
  deliveryTime: zod.string().optional(),
  featuredBadge: zod.string().optional(),
  whatsIncluded: zod.array(zod.string()).optional(),
  processSteps: zod.array(zod.string()).optional(),
  ctaText: zod.string().optional(),
});

export const AdminServiceResponse = zod.object({
  id: zod.number(),
  title: zod.string(),
  slug: zod.string(),
  summary: zod.string(),
  description: zod.string(),
  icon: zod.string(),
  sortOrder: zod.number(),
  category: zod.string(),
  heroImage: zod.string(),
  price: zod.string(),
  deliveryTime: zod.string(),
  featuredBadge: zod.string(),
  whatsIncluded: zod.array(zod.string()),
  processSteps: zod.array(zod.string()),
  ctaText: zod.string(),
});

export const AdminUpdateServiceParams = zod.object({ id: zod.coerce.number() });
export const AdminDeleteServiceParams = zod.object({ id: zod.coerce.number() });

// =========================================================================
// ADMIN CRUD — PORTFOLIO PROJECTS
// =========================================================================

export const AdminPortfolioBody = zod.object({
  title: zod.string().min(1),
  slug: zod.string().min(1),
  category: zod.string().min(1),
  summary: zod.string().min(1),
  imageUrl: zod.string().optional(),
  tags: zod.array(zod.string()).optional(),
  year: zod.number().int(),
  sortOrder: zod.number().optional(),
});

export const AdminPortfolioResponse = zod.object({
  id: zod.number(),
  title: zod.string(),
  slug: zod.string(),
  category: zod.string(),
  summary: zod.string(),
  imageUrl: zod.string(),
  tags: zod.array(zod.string()),
  year: zod.number(),
  sortOrder: zod.number(),
});

export const AdminUpdatePortfolioParams = zod.object({ id: zod.coerce.number() });
export const AdminDeletePortfolioParams = zod.object({ id: zod.coerce.number() });

// =========================================================================
// ADMIN CRUD — CASE STUDIES
// =========================================================================

export const AdminCaseStudyBody = zod.object({
  title: zod.string().min(1),
  slug: zod.string().min(1),
  client: zod.string().min(1),
  summary: zod.string().min(1),
  challenge: zod.string().min(1),
  solution: zod.string().min(1),
  result: zod.string().min(1),
  imageUrl: zod.string().optional(),
  metricLabel: zod.string().optional(),
  metricValue: zod.string().optional(),
  sortOrder: zod.number().optional(),
});

export const AdminCaseStudyResponse = zod.object({
  id: zod.number(),
  title: zod.string(),
  slug: zod.string(),
  client: zod.string(),
  summary: zod.string(),
  challenge: zod.string(),
  solution: zod.string(),
  result: zod.string(),
  imageUrl: zod.string(),
  metricLabel: zod.string(),
  metricValue: zod.string(),
  sortOrder: zod.number(),
});

export const AdminUpdateCaseStudyParams = zod.object({ id: zod.coerce.number() });
export const AdminDeleteCaseStudyParams = zod.object({ id: zod.coerce.number() });

// =========================================================================
// ADMIN CRUD — TESTIMONIALS (Phase 2: serviceSlug)
// =========================================================================

export const AdminTestimonialBody = zod.object({
  name: zod.string().min(1),
  role: zod.string().min(1),
  company: zod.string().min(1),
  quote: zod.string().min(1),
  avatarUrl: zod.string().optional(),
  sortOrder: zod.number().optional(),
  serviceSlug: zod.string().optional(),
});

export const AdminTestimonialResponse = zod.object({
  id: zod.number(),
  name: zod.string(),
  role: zod.string(),
  company: zod.string(),
  quote: zod.string(),
  avatarUrl: zod.string(),
  sortOrder: zod.number(),
  serviceSlug: zod.string(),
});

export const AdminUpdateTestimonialParams = zod.object({ id: zod.coerce.number() });
export const AdminDeleteTestimonialParams = zod.object({ id: zod.coerce.number() });

// =========================================================================
// ADMIN CRUD — BLOG POSTS
// =========================================================================

export const AdminBlogPostBody = zod.object({
  title: zod.string().min(1),
  slug: zod.string().min(1),
  excerpt: zod.string().min(1),
  content: zod.string().min(1),
  coverImageUrl: zod.string().optional(),
  author: zod.string().min(1),
  category: zod.string().min(1),
  publishedAt: zod.string().optional(),
});

export const AdminBlogPostResponse = zod.object({
  id: zod.number(),
  title: zod.string(),
  slug: zod.string(),
  excerpt: zod.string(),
  content: zod.string(),
  coverImageUrl: zod.string(),
  author: zod.string(),
  category: zod.string(),
  publishedAt: zod.coerce.date(),
});

export const AdminUpdateBlogPostParams = zod.object({ id: zod.coerce.number() });
export const AdminDeleteBlogPostParams = zod.object({ id: zod.coerce.number() });

// =========================================================================
// ADMIN CRUD — PRICING PLANS
// =========================================================================

export const AdminPricingPlanBody = zod.object({
  name: zod.string().min(1),
  tagline: zod.string().min(1),
  price: zod.string().min(1),
  billingNote: zod.string().optional(),
  features: zod.array(zod.string()).optional(),
  isFeatured: zod.boolean().optional(),
  sortOrder: zod.number().optional(),
});

export const AdminPricingPlanResponse = zod.object({
  id: zod.number(),
  name: zod.string(),
  tagline: zod.string(),
  price: zod.string(),
  billingNote: zod.string(),
  features: zod.array(zod.string()),
  isFeatured: zod.boolean(),
  sortOrder: zod.number(),
});

export const AdminUpdatePricingPlanParams = zod.object({ id: zod.coerce.number() });
export const AdminDeletePricingPlanParams = zod.object({ id: zod.coerce.number() });
