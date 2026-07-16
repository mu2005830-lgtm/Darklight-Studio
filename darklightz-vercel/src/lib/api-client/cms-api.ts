/**
 * React Query hooks for CMS Phase 2.
 * Uses the same customFetch / setAdminApiKey plumbing as the generated api.ts.
 */
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
  type QueryKey,
} from "@tanstack/react-query";
import { customFetch } from "./custom-fetch";
import type { ErrorType } from "./custom-fetch";
import type {
  SiteSettings,
  UpdateSiteSettingsInput,
  SocialLink,
  CreateSocialLinkInput,
  TeamMember,
  CreateTeamMemberInput,
  FaqItem,
  CreateFaqItemInput,
  Client,
  CreateClientInput,
  AdminServiceInput,
  AdminPortfolioInput,
  AdminCaseStudyInput,
  AdminTestimonialInput,
  AdminBlogPostInput,
  AdminPricingPlanInput,
  InquiryInput,
  Inquiry,
} from "./cms-schemas";
import type { Service, PortfolioProject, CaseStudy, Testimonial, BlogPost, PricingPlan } from "./generated/api.schemas";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function json<T>(url: string, method: string, body?: unknown): Promise<T> {
  return customFetch<T>(url, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

// ---------------------------------------------------------------------------
// SITE SETTINGS
// ---------------------------------------------------------------------------

export const getSiteSettingsQueryKey = (): QueryKey => ["/api/site-settings"];

export function useGetSiteSettings(
  options?: { query?: UseQueryOptions<SiteSettings, ErrorType<unknown>> }
) {
  return useQuery<SiteSettings, ErrorType<unknown>>({
    queryKey: getSiteSettingsQueryKey(),
    queryFn: () => customFetch<SiteSettings>("/api/site-settings"),
    ...options?.query,
  });
}

export function useUpdateSiteSettings(
  options?: UseMutationOptions<SiteSettings, ErrorType<unknown>, UpdateSiteSettingsInput>
) {
  return useMutation<SiteSettings, ErrorType<unknown>, UpdateSiteSettingsInput>({
    mutationFn: (body) => json<SiteSettings>("/api/admin/site-settings", "PUT", body),
    ...options,
  });
}

// ---------------------------------------------------------------------------
// SOCIAL LINKS
// ---------------------------------------------------------------------------

export const getListSocialLinksQueryKey = (): QueryKey => ["/api/social-links"];

export function useListSocialLinks(
  options?: { query?: UseQueryOptions<SocialLink[], ErrorType<unknown>> }
) {
  return useQuery<SocialLink[], ErrorType<unknown>>({
    queryKey: getListSocialLinksQueryKey(),
    queryFn: () => customFetch<SocialLink[]>("/api/social-links"),
    ...options?.query,
  });
}

export function useCreateSocialLink(
  options?: UseMutationOptions<SocialLink, ErrorType<unknown>, CreateSocialLinkInput>
) {
  return useMutation<SocialLink, ErrorType<unknown>, CreateSocialLinkInput>({
    mutationFn: (body) => json<SocialLink>("/api/admin/social-links", "POST", body),
    ...options,
  });
}

export function useUpdateSocialLink(
  options?: UseMutationOptions<SocialLink, ErrorType<unknown>, { id: number; body: Partial<CreateSocialLinkInput> }>
) {
  return useMutation<SocialLink, ErrorType<unknown>, { id: number; body: Partial<CreateSocialLinkInput> }>({
    mutationFn: ({ id, body }) => json<SocialLink>(`/api/admin/social-links/${id}`, "PUT", body),
    ...options,
  });
}

export function useDeleteSocialLink(
  options?: UseMutationOptions<void, ErrorType<unknown>, number>
) {
  return useMutation<void, ErrorType<unknown>, number>({
    mutationFn: (id) => customFetch<void>(`/api/admin/social-links/${id}`, { method: "DELETE" }),
    ...options,
  });
}

// ---------------------------------------------------------------------------
// TEAM MEMBERS
// ---------------------------------------------------------------------------

export const getListTeamMembersQueryKey = (): QueryKey => ["/api/team"];

export function useListTeamMembers(
  options?: { query?: UseQueryOptions<TeamMember[], ErrorType<unknown>> }
) {
  return useQuery<TeamMember[], ErrorType<unknown>>({
    queryKey: getListTeamMembersQueryKey(),
    queryFn: () => customFetch<TeamMember[]>("/api/team"),
    ...options?.query,
  });
}

export function useCreateTeamMember(
  options?: UseMutationOptions<TeamMember, ErrorType<unknown>, CreateTeamMemberInput>
) {
  return useMutation<TeamMember, ErrorType<unknown>, CreateTeamMemberInput>({
    mutationFn: (body) => json<TeamMember>("/api/admin/team", "POST", body),
    ...options,
  });
}

export function useUpdateTeamMember(
  options?: UseMutationOptions<TeamMember, ErrorType<unknown>, { id: number; body: Partial<CreateTeamMemberInput> }>
) {
  return useMutation<TeamMember, ErrorType<unknown>, { id: number; body: Partial<CreateTeamMemberInput> }>({
    mutationFn: ({ id, body }) => json<TeamMember>(`/api/admin/team/${id}`, "PUT", body),
    ...options,
  });
}

export function useDeleteTeamMember(
  options?: UseMutationOptions<void, ErrorType<unknown>, number>
) {
  return useMutation<void, ErrorType<unknown>, number>({
    mutationFn: (id) => customFetch<void>(`/api/admin/team/${id}`, { method: "DELETE" }),
    ...options,
  });
}

// ---------------------------------------------------------------------------
// FAQ ITEMS
// ---------------------------------------------------------------------------

export const getListFaqItemsQueryKey = (): QueryKey => ["/api/faq"];

export function useListFaqItems(
  options?: { query?: UseQueryOptions<FaqItem[], ErrorType<unknown>> }
) {
  return useQuery<FaqItem[], ErrorType<unknown>>({
    queryKey: getListFaqItemsQueryKey(),
    queryFn: () => customFetch<FaqItem[]>("/api/faq"),
    ...options?.query,
  });
}

export function useCreateFaqItem(
  options?: UseMutationOptions<FaqItem, ErrorType<unknown>, CreateFaqItemInput>
) {
  return useMutation<FaqItem, ErrorType<unknown>, CreateFaqItemInput>({
    mutationFn: (body) => json<FaqItem>("/api/admin/faq", "POST", body),
    ...options,
  });
}

export function useUpdateFaqItem(
  options?: UseMutationOptions<FaqItem, ErrorType<unknown>, { id: number; body: Partial<CreateFaqItemInput> }>
) {
  return useMutation<FaqItem, ErrorType<unknown>, { id: number; body: Partial<CreateFaqItemInput> }>({
    mutationFn: ({ id, body }) => json<FaqItem>(`/api/admin/faq/${id}`, "PUT", body),
    ...options,
  });
}

export function useDeleteFaqItem(
  options?: UseMutationOptions<void, ErrorType<unknown>, number>
) {
  return useMutation<void, ErrorType<unknown>, number>({
    mutationFn: (id) => customFetch<void>(`/api/admin/faq/${id}`, { method: "DELETE" }),
    ...options,
  });
}

// ---------------------------------------------------------------------------
// CLIENTS
// ---------------------------------------------------------------------------

export const getListClientsQueryKey = (): QueryKey => ["/api/clients"];

export function useListClients(
  options?: { query?: UseQueryOptions<Client[], ErrorType<unknown>> }
) {
  return useQuery<Client[], ErrorType<unknown>>({
    queryKey: getListClientsQueryKey(),
    queryFn: () => customFetch<Client[]>("/api/clients"),
    ...options?.query,
  });
}

export function useCreateClient(
  options?: UseMutationOptions<Client, ErrorType<unknown>, CreateClientInput>
) {
  return useMutation<Client, ErrorType<unknown>, CreateClientInput>({
    mutationFn: (body) => json<Client>("/api/admin/clients", "POST", body),
    ...options,
  });
}

export function useUpdateClient(
  options?: UseMutationOptions<Client, ErrorType<unknown>, { id: number; body: Partial<CreateClientInput> }>
) {
  return useMutation<Client, ErrorType<unknown>, { id: number; body: Partial<CreateClientInput> }>({
    mutationFn: ({ id, body }) => json<Client>(`/api/admin/clients/${id}`, "PUT", body),
    ...options,
  });
}

export function useDeleteClient(
  options?: UseMutationOptions<void, ErrorType<unknown>, number>
) {
  return useMutation<void, ErrorType<unknown>, number>({
    mutationFn: (id) => customFetch<void>(`/api/admin/clients/${id}`, { method: "DELETE" }),
    ...options,
  });
}

// ---------------------------------------------------------------------------
// ADMIN CRUD — SERVICES
// ---------------------------------------------------------------------------

export function useAdminCreateService(
  options?: UseMutationOptions<Service, ErrorType<unknown>, AdminServiceInput>
) {
  return useMutation<Service, ErrorType<unknown>, AdminServiceInput>({
    mutationFn: (body) => json<Service>("/api/admin/services", "POST", body),
    ...options,
  });
}

export function useAdminUpdateService(
  options?: UseMutationOptions<Service, ErrorType<unknown>, { id: number; body: Partial<AdminServiceInput> }>
) {
  return useMutation<Service, ErrorType<unknown>, { id: number; body: Partial<AdminServiceInput> }>({
    mutationFn: ({ id, body }) => json<Service>(`/api/admin/services/${id}`, "PUT", body),
    ...options,
  });
}

export function useAdminDeleteService(
  options?: UseMutationOptions<void, ErrorType<unknown>, number>
) {
  return useMutation<void, ErrorType<unknown>, number>({
    mutationFn: (id) => customFetch<void>(`/api/admin/services/${id}`, { method: "DELETE" }),
    ...options,
  });
}

// ---------------------------------------------------------------------------
// ADMIN CRUD — PORTFOLIO
// ---------------------------------------------------------------------------

export function useAdminCreatePortfolio(
  options?: UseMutationOptions<PortfolioProject, ErrorType<unknown>, AdminPortfolioInput>
) {
  return useMutation<PortfolioProject, ErrorType<unknown>, AdminPortfolioInput>({
    mutationFn: (body) => json<PortfolioProject>("/api/admin/portfolio", "POST", body),
    ...options,
  });
}

export function useAdminUpdatePortfolio(
  options?: UseMutationOptions<PortfolioProject, ErrorType<unknown>, { id: number; body: Partial<AdminPortfolioInput> }>
) {
  return useMutation<PortfolioProject, ErrorType<unknown>, { id: number; body: Partial<AdminPortfolioInput> }>({
    mutationFn: ({ id, body }) => json<PortfolioProject>(`/api/admin/portfolio/${id}`, "PUT", body),
    ...options,
  });
}

export function useAdminDeletePortfolio(
  options?: UseMutationOptions<void, ErrorType<unknown>, number>
) {
  return useMutation<void, ErrorType<unknown>, number>({
    mutationFn: (id) => customFetch<void>(`/api/admin/portfolio/${id}`, { method: "DELETE" }),
    ...options,
  });
}

// ---------------------------------------------------------------------------
// ADMIN CRUD — CASE STUDIES
// ---------------------------------------------------------------------------

export function useAdminCreateCaseStudy(
  options?: UseMutationOptions<CaseStudy, ErrorType<unknown>, AdminCaseStudyInput>
) {
  return useMutation<CaseStudy, ErrorType<unknown>, AdminCaseStudyInput>({
    mutationFn: (body) => json<CaseStudy>("/api/admin/case-studies", "POST", body),
    ...options,
  });
}

export function useAdminUpdateCaseStudy(
  options?: UseMutationOptions<CaseStudy, ErrorType<unknown>, { id: number; body: Partial<AdminCaseStudyInput> }>
) {
  return useMutation<CaseStudy, ErrorType<unknown>, { id: number; body: Partial<AdminCaseStudyInput> }>({
    mutationFn: ({ id, body }) => json<CaseStudy>(`/api/admin/case-studies/${id}`, "PUT", body),
    ...options,
  });
}

export function useAdminDeleteCaseStudy(
  options?: UseMutationOptions<void, ErrorType<unknown>, number>
) {
  return useMutation<void, ErrorType<unknown>, number>({
    mutationFn: (id) => customFetch<void>(`/api/admin/case-studies/${id}`, { method: "DELETE" }),
    ...options,
  });
}

// ---------------------------------------------------------------------------
// ADMIN CRUD — TESTIMONIALS
// ---------------------------------------------------------------------------

export function useAdminCreateTestimonial(
  options?: UseMutationOptions<Testimonial, ErrorType<unknown>, AdminTestimonialInput>
) {
  return useMutation<Testimonial, ErrorType<unknown>, AdminTestimonialInput>({
    mutationFn: (body) => json<Testimonial>("/api/admin/testimonials", "POST", body),
    ...options,
  });
}

export function useAdminUpdateTestimonial(
  options?: UseMutationOptions<Testimonial, ErrorType<unknown>, { id: number; body: Partial<AdminTestimonialInput> }>
) {
  return useMutation<Testimonial, ErrorType<unknown>, { id: number; body: Partial<AdminTestimonialInput> }>({
    mutationFn: ({ id, body }) => json<Testimonial>(`/api/admin/testimonials/${id}`, "PUT", body),
    ...options,
  });
}

export function useAdminDeleteTestimonial(
  options?: UseMutationOptions<void, ErrorType<unknown>, number>
) {
  return useMutation<void, ErrorType<unknown>, number>({
    mutationFn: (id) => customFetch<void>(`/api/admin/testimonials/${id}`, { method: "DELETE" }),
    ...options,
  });
}

// ---------------------------------------------------------------------------
// ADMIN CRUD — BLOG POSTS
// ---------------------------------------------------------------------------

export function useAdminCreateBlogPost(
  options?: UseMutationOptions<BlogPost, ErrorType<unknown>, AdminBlogPostInput>
) {
  return useMutation<BlogPost, ErrorType<unknown>, AdminBlogPostInput>({
    mutationFn: (body) => json<BlogPost>("/api/admin/blog", "POST", body),
    ...options,
  });
}

export function useAdminUpdateBlogPost(
  options?: UseMutationOptions<BlogPost, ErrorType<unknown>, { id: number; body: Partial<AdminBlogPostInput> }>
) {
  return useMutation<BlogPost, ErrorType<unknown>, { id: number; body: Partial<AdminBlogPostInput> }>({
    mutationFn: ({ id, body }) => json<BlogPost>(`/api/admin/blog/${id}`, "PUT", body),
    ...options,
  });
}

export function useAdminDeleteBlogPost(
  options?: UseMutationOptions<void, ErrorType<unknown>, number>
) {
  return useMutation<void, ErrorType<unknown>, number>({
    mutationFn: (id) => customFetch<void>(`/api/admin/blog/${id}`, { method: "DELETE" }),
    ...options,
  });
}

// ---------------------------------------------------------------------------
// ADMIN CRUD — PRICING PLANS
// ---------------------------------------------------------------------------

export function useAdminCreatePricingPlan(
  options?: UseMutationOptions<PricingPlan, ErrorType<unknown>, AdminPricingPlanInput>
) {
  return useMutation<PricingPlan, ErrorType<unknown>, AdminPricingPlanInput>({
    mutationFn: (body) => json<PricingPlan>("/api/admin/pricing", "POST", body),
    ...options,
  });
}

export function useAdminUpdatePricingPlan(
  options?: UseMutationOptions<PricingPlan, ErrorType<unknown>, { id: number; body: Partial<AdminPricingPlanInput> }>
) {
  return useMutation<PricingPlan, ErrorType<unknown>, { id: number; body: Partial<AdminPricingPlanInput> }>({
    mutationFn: ({ id, body }) => json<PricingPlan>(`/api/admin/pricing/${id}`, "PUT", body),
    ...options,
  });
}

export function useAdminDeletePricingPlan(
  options?: UseMutationOptions<void, ErrorType<unknown>, number>
) {
  return useMutation<void, ErrorType<unknown>, number>({
    mutationFn: (id) => customFetch<void>(`/api/admin/pricing/${id}`, { method: "DELETE" }),
    ...options,
  });
}

// ---------------------------------------------------------------------------
// INQUIRIES
// ---------------------------------------------------------------------------

export function useCreateInquiry(
  options?: UseMutationOptions<Inquiry, ErrorType<unknown>, InquiryInput>
) {
  return useMutation<Inquiry, ErrorType<unknown>, InquiryInput>({
    mutationFn: (body) => json<Inquiry>("/api/inquiries", "POST", body),
    ...options,
  });
}

export const getServiceBySlugQueryKey = (slug: string): QueryKey => [`/api/services/${slug}`];

export function useGetServiceBySlug(
  slug: string,
  options?: { query?: UseQueryOptions<Service, ErrorType<unknown>> }
) {
  return useQuery<Service, ErrorType<unknown>>({
    queryKey: getServiceBySlugQueryKey(slug),
    queryFn: () => customFetch<Service>(`/api/services/${slug}`),
    enabled: !!slug,
    ...options?.query,
  });
}

export const getServicePortfolioQueryKey = (slug: string): QueryKey => [`/api/services/${slug}/portfolio`];

export function useServicePortfolio(
  slug: string,
  options?: { query?: UseQueryOptions<import("./generated/api.schemas").PortfolioProject[], ErrorType<unknown>> }
) {
  return useQuery({
    queryKey: getServicePortfolioQueryKey(slug),
    queryFn: () => customFetch<import("./generated/api.schemas").PortfolioProject[]>(`/api/services/${slug}/portfolio`),
    enabled: !!slug,
    ...options?.query,
  });
}

export const getServiceFaqsQueryKey = (slug: string): QueryKey => [`/api/services/${slug}/faqs`];

export function useServiceFaqs(
  slug: string,
  options?: { query?: UseQueryOptions<import("./cms-schemas").FaqItem[], ErrorType<unknown>> }
) {
  return useQuery({
    queryKey: getServiceFaqsQueryKey(slug),
    queryFn: () => customFetch<import("./cms-schemas").FaqItem[]>(`/api/services/${slug}/faqs`),
    enabled: !!slug,
    ...options?.query,
  });
}

export const getServiceTestimonialsQueryKey = (slug: string): QueryKey => [`/api/services/${slug}/testimonials`];

export function useServiceTestimonials(
  slug: string,
  options?: { query?: UseQueryOptions<Testimonial[], ErrorType<unknown>> }
) {
  return useQuery({
    queryKey: getServiceTestimonialsQueryKey(slug),
    queryFn: () => customFetch<Testimonial[]>(`/api/services/${slug}/testimonials`),
    enabled: !!slug,
    ...options?.query,
  });
}

// ---------------------------------------------------------------------------
// Convenience hook: invalidate all CMS list queries after any mutation.
// Usage: const invalidateAll = useCmsInvalidator(); then call invalidateAll(key)
// ---------------------------------------------------------------------------

export function useCmsInvalidator() {
  const qc = useQueryClient();
  return (key: QueryKey) => qc.invalidateQueries({ queryKey: key });
}
