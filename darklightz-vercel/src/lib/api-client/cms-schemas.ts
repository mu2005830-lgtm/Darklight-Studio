/**
 * TypeScript interfaces for CMS Phase 2 API responses.
 * Hand-written to match the server-side Zod schemas in api/_lib/api-zod/cms.ts.
 */

export interface SiteSettings {
  id: number;
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  faviconUrl: string;
  logoText: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaUrl: string;
  whatsappNumber: string;
  studioStoryImageUrl: string;
  updatedAt: string;
}

export type UpdateSiteSettingsInput = Partial<Omit<SiteSettings, "id" | "updatedAt">>;

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  sortOrder: number;
}

export interface CreateSocialLinkInput {
  platform: string;
  url: string;
  icon?: string;
  sortOrder?: number;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  linkedinUrl: string;
  sortOrder: number;
}

export interface CreateTeamMemberInput {
  name: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  sortOrder?: number;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

export interface CreateFaqItemInput {
  question: string;
  answer: string;
  category?: string;
  sortOrder?: number;
}

export interface Client {
  id: number;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  sortOrder: number;
}

export interface CreateClientInput {
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  sortOrder?: number;
}

// Admin CRUD input types for existing content tables

export interface AdminServiceInput {
  title: string;
  slug: string;
  summary: string;
  description: string;
  icon?: string;
  sortOrder?: number;
  // Phase 2
  category?: string;
  heroImage?: string;
  price?: string;
  deliveryTime?: string;
  featuredBadge?: string;
  whatsIncluded?: string[];
  processSteps?: string[];
  ctaText?: string;
}

export interface AdminPortfolioInput {
  title: string;
  slug: string;
  category: string;
  summary: string;
  imageUrl?: string;
  tags?: string[];
  year: number;
  sortOrder?: number;
}

export interface AdminCaseStudyInput {
  title: string;
  slug: string;
  client: string;
  summary: string;
  challenge: string;
  solution: string;
  result: string;
  imageUrl?: string;
  metricLabel?: string;
  metricValue?: string;
  sortOrder?: number;
}

export interface AdminTestimonialInput {
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarUrl?: string;
  sortOrder?: number;
  serviceSlug?: string;
}

export interface AdminBlogPostInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  author: string;
  category: string;
  publishedAt?: string;
}

export interface AdminPricingPlanInput {
  name: string;
  tagline: string;
  price: string;
  billingNote?: string;
  features?: string[];
  isFeatured?: boolean;
  sortOrder?: number;
}

// Inquiry
export interface InquiryInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceSlug: string;
  serviceTitle: string;
  price?: string;
  budget?: string;
  description: string;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceSlug: string;
  serviceTitle: string;
  price: string;
  budget: string;
  description: string;
  status: string;
  createdAt: string;
}
