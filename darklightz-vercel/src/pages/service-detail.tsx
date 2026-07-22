import { useState } from "react"
import { Link, useParams } from "wouter"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { useListServices } from "@/lib/api-client"
import {
  useGetServiceBySlug,
  useServicePortfolio,
  useServiceFaqs,
  useServiceTestimonials,
} from "@/lib/api-client/cms-api"
import { motion } from "framer-motion"
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Tag,
  Star,
  ChevronDown,
  MessageCircle,
  ArrowLeft,
} from "lucide-react"
import {
  Eyebrow,
  BlurReveal,
  SpotlightBackground,
  TiltCard,
  AnimatedBorderSweep,
  SilverDivider,
} from "@/components/effects"
import { InquiryModal } from "@/components/InquiryModal"
import type { Service } from "@/lib/api-client/generated/api.schemas"

// Process step titles (fixed, admin customises descriptions via processSteps[])
const PROCESS_TITLES = [
  "Discovery",
  "Planning",
  "Design",
  "Development",
  "Review",
  "Delivery",
  "Support",
]

// Fallback per-slug data used when DB hasn't been seeded
const FALLBACK: Record<string, Partial<Service>> = {
  "landing-page": { title: "Landing Page", summary: "A single, conversion-focused page designed to turn visitors into leads or buyers.", price: "From PKR 6,000", deliveryTime: "3–5 days", category: "website-services", whatsIncluded: ["Custom design", "Mobile responsive", "Contact / lead form", "SEO meta tags", "Fast loading (< 2s)", "1 round of revisions"], processSteps: ["We learn your goals, target audience, and offer.", "We plan the page structure and copywriting flow.", "We design a premium custom layout.", "We build it clean with optimised code.", "You review and request changes.", "We hand over the live page with a full walkthrough.", "30-day support for any issues post-launch."], ctaText: "Get Started", featuredBadge: "Popular" },
  "business-website": { title: "Business Website", summary: "A professional multi-page website that builds credibility and drives enquiries.", price: "From PKR 15,000", deliveryTime: "7–10 days", category: "website-services", whatsIncluded: ["Up to 6 pages", "Custom design system", "Mobile & tablet responsive", "Blog / news section", "Contact form", "SEO optimisation", "Google Analytics setup", "2 rounds of revisions"], processSteps: ["Stakeholder discovery call to understand your business.", "Sitemap and content plan agreed.", "Design concept and style guide.", "Full development across all pages.", "Client review with consolidated feedback.", "Launch and domain handover.", "30-day post-launch support."] , ctaText: "Get Started", featuredBadge: "" },
  "custom-website": { title: "Custom-Coded Website", summary: "Hand-crafted from scratch — no templates, no shortcuts, just precision engineering.", price: "From PKR 30,000", deliveryTime: "14–21 days", category: "website-services", whatsIncluded: ["Fully custom codebase", "React / Next.js or preferred stack", "Advanced animations (GSAP / Framer Motion)", "Custom CMS integration", "Performance-optimised", "SEO architecture", "3 rounds of revisions", "Full source code handover"], processSteps: ["Deep-dive discovery: goals, tech requirements, integrations.", "Technical spec and architecture planning.", "UI/UX design with interactive prototype.", "Full-stack development with CI/CD pipeline.", "QA review across devices and browsers.", "Production deployment and DNS configuration.", "Extended 60-day support included."], ctaText: "Start Project", featuredBadge: "Premium" },
  "shopify": { title: "Shopify Website", summary: "Revenue-optimised Shopify stores built to convert browsers into buyers.", price: "From PKR 15,000", deliveryTime: "7–14 days", category: "website-services", whatsIncluded: ["Custom Shopify theme", "Product pages + collections", "Payment gateway setup", "Shipping configuration", "Inventory management", "Email notifications", "Mobile-first design", "2 rounds of revisions"], processSteps: ["Store goals, product catalogue, and brand review.", "Theme and layout planning.", "Custom Shopify theme design.", "Theme development + product upload.", "Payment, shipping, and checkout QA.", "Store goes live with launch checklist.", "30-day Shopify support."], ctaText: "Build My Store", featuredBadge: "" },
  "wordpress": { title: "WordPress Website", summary: "Elegant WordPress sites with custom themes and plugins for easy self-management.", price: "From PKR 10,000", deliveryTime: "7–10 days", category: "website-services", whatsIncluded: ["Custom child theme", "Page builder setup", "Plugin configuration", "SEO (Yoast / RankMath)", "Speed optimisation", "Security hardening", "Admin training session", "2 rounds of revisions"], processSteps: ["Brand and content discovery.", "Plugin and theme selection.", "Design and layout mockup.", "WordPress development and setup.", "Content migration and QA.", "Launch with admin walkthrough.", "14-day post-launch support."], ctaText: "Get Started", featuredBadge: "" },
  "website-redesign": { title: "Website Redesign", summary: "Transform your outdated website into a premium, high-performing digital experience.", price: "From PKR 11,000", deliveryTime: "7–14 days", category: "website-services", whatsIncluded: ["Full visual overhaul", "Improved user experience", "Speed optimisation", "Mobile responsiveness", "Updated copy (optional)", "SEO preservation", "2 rounds of revisions", "Analytics re-setup"], processSteps: ["Audit of existing site — performance, design, and UX.", "Redesign strategy and priority list.", "New design concepts.", "Development of new version.", "Side-by-side comparison and feedback.", "Migration to the new design.", "30-day monitoring period."], ctaText: "Redesign My Site", featuredBadge: "" },
  "bug-fixes": { title: "Bug Fixes", summary: "Fast, reliable resolution of any website issue — guaranteed.", price: "From PKR 2,000", deliveryTime: "1–3 days", category: "website-services", whatsIncluded: ["Issue diagnosis", "Root cause fix", "Cross-browser QA", "Progress report", "Post-fix monitoring", "Documentation of changes"], processSteps: ["You describe the issue — screenshots welcome.", "We diagnose the root cause.", "Fix is designed and planned.", "Fix is applied in a staging environment.", "You review the fix.", "Fix is deployed to production.", "7-day monitoring for regression."], ctaText: "Fix My Site", featuredBadge: "" },
  "website-maintenance": { title: "Monthly Website Maintenance", summary: "Ongoing care to keep your site secure, fast, and up-to-date — every month.", price: "PKR 5,000/mo", deliveryTime: "Ongoing", category: "website-services", whatsIncluded: ["Monthly security updates", "Plugin/theme updates", "Performance monitoring", "Uptime monitoring", "Monthly report", "1 minor edit per month", "Priority bug fixes", "24h response SLA"], processSteps: ["Onboarding: access review and baseline audit.", "Monthly maintenance schedule agreed.", "Design of recurring task checklist.", "Monthly updates and monitoring.", "Report delivered on the 1st of each month.", "Ongoing priority support.", "Quarterly performance deep-dive."], ctaText: "Start Maintenance", featuredBadge: "" },
  "video-editing": { title: "Video Editing", summary: "Cinematic edits that capture attention, hold viewers, and drive action.", price: "From PKR 3,000", deliveryTime: "2–4 days", category: "content-creation", whatsIncluded: ["Full video edit", "Colour grading", "Sound design & music", "Captions / subtitles", "Thumbnail design", "2 rounds of revisions", "Multiple aspect ratios (16:9, 9:16, 1:1)", "Delivered in 4K / HD"], processSteps: ["You share raw footage and style reference.", "Edit plan and pacing review.", "Rough cut with initial colour grading.", "Full edit with sound and graphics.", "You review with timestamped feedback.", "Final export in all required formats.", "7-day support for minor tweaks."], ctaText: "Edit My Video", featuredBadge: "" },
  "ugc-content": { title: "UGC Content", summary: "Authentic, creator-style content that builds trust and drives sales for your brand.", price: "From PKR 5,000", deliveryTime: "3–5 days", category: "content-creation", whatsIncluded: ["Script writing", "Professional filming", "On-brand editing", "Hook-first structure", "Captions & B-roll", "Platform-optimised output", "Usage rights", "2 rounds of revisions"], processSteps: ["Brand brief: product, audience, and tone.", "Scripting and hook development.", "Visual style and creator match.", "Filming session.", "Editing with platform optimisation.", "Final delivery with usage rights.", "Performance review after 30 days."], ctaText: "Create My Content", featuredBadge: "Trending" },
  "content-management": { title: "Monthly Content Management", summary: "Done-for-you content strategy, creation, scheduling, and analytics — every month.", price: "PKR 15,000–20,000/mo", deliveryTime: "Ongoing", category: "content-creation", whatsIncluded: ["Monthly content calendar", "12–16 posts per month", "Graphic design", "Caption copywriting", "Scheduling & publishing", "Community management", "Monthly analytics report", "Strategy review call"], processSteps: ["Onboarding: brand voice, audience, and goals.", "30-day content strategy document.", "Content calendar design and approval.", "Weekly creation and scheduling.", "You review before posts go live.", "Publishing and real-time monitoring.", "Monthly performance report + strategy iteration."], ctaText: "Manage My Content", featuredBadge: "" },
}

// FAQ accordion item
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border/50">
      <button
        className="w-full text-left flex items-start justify-between gap-4 py-5"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-medium text-white pr-4">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="text-sm text-muted-foreground leading-relaxed pb-5">{a}</p>
      </motion.div>
    </div>
  )
}

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [inquiryOpen, setInquiryOpen] = useState(false)

  const { data: apiService, isLoading } = useGetServiceBySlug(slug ?? "")
  const { data: portfolioItems } = useServicePortfolio(slug ?? "")
  const { data: faqs } = useServiceFaqs(slug ?? "")
  const { data: testimonials } = useServiceTestimonials(slug ?? "")

  // Merge API data with fallback
  const fallback = FALLBACK[slug ?? ""] ?? {}
  const service: Partial<Service> = {
    title: apiService?.title ?? fallback.title ?? slug,
    slug: apiService?.slug ?? slug,
    summary: apiService?.summary ?? fallback.summary ?? "",
    description: apiService?.description ?? fallback.summary ?? "",
    icon: apiService?.icon ?? "✦",
    price: apiService?.price ?? fallback.price ?? "",
    deliveryTime: apiService?.deliveryTime ?? fallback.deliveryTime ?? "",
    heroImage: apiService?.heroImage ?? fallback.heroImage ?? "",
    category: apiService?.category ?? fallback.category ?? "website-services",
    whatsIncluded: (apiService?.whatsIncluded?.length ? apiService.whatsIncluded : fallback.whatsIncluded) ?? [],
    processSteps: (apiService?.processSteps?.length ? apiService.processSteps : fallback.processSteps) ?? [],
    ctaText: apiService?.ctaText ?? fallback.ctaText ?? "Get Started",
    featuredBadge: apiService?.featuredBadge ?? fallback.featuredBadge ?? "",
  }

  // Default FAQs if none in DB
  const displayFaqs = (faqs && faqs.length > 0) ? faqs : [
    { id: 1, question: `How long does a ${service.title} project take?`, answer: service.deliveryTime ? `Typical delivery is ${service.deliveryTime}.` : "Timeline depends on scope. We'll give you an exact estimate after the discovery call.", category: slug ?? "", sortOrder: 0 },
    { id: 2, question: "What do you need from me to get started?", answer: "We'll need your brand assets (logo, colours, fonts if any), your goals, any content you'd like used, and access to your existing site if applicable. We'll send a clear onboarding checklist.", category: slug ?? "", sortOrder: 1 },
    { id: 3, question: "How many revisions are included?", answer: "We include 2 rounds of revisions by default. Additional rounds can be added at a modest hourly rate.", category: slug ?? "", sortOrder: 2 },
    { id: 4, question: "What payment methods do you accept?", answer: "We accept bank transfer, JazzCash, EasyPaisa, and major credit cards. A 50% deposit is required to begin, with the remainder due on delivery.", category: slug ?? "", sortOrder: 3 },
    { id: 5, question: "Do you offer ongoing support after delivery?", answer: "Yes — every project includes a post-delivery support window. We also offer monthly maintenance packages for ongoing peace of mind.", category: slug ?? "", sortOrder: 4 },
  ]

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-[100dvh] flex items-center justify-center text-muted-foreground/50 text-sm">
          Loading...
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div className="relative min-h-[100dvh]">
        <SpotlightBackground />

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Back */}
            <BlurReveal>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-[10px] font-display uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-white transition-colors mb-10 group"
              >
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                All Services
              </Link>
            </BlurReveal>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <BlurReveal>
                  <Eyebrow>{service.category === "content-creation" ? "Content Creation" : "Website Services"}</Eyebrow>
                </BlurReveal>
                {service.featuredBadge && (
                  <BlurReveal delay={0.05}>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-[2px] mb-4">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-[9px] font-display uppercase tracking-[0.2em] text-white font-bold">{service.featuredBadge}</span>
                    </div>
                  </BlurReveal>
                )}
                <BlurReveal delay={0.1}>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tighter mb-6 text-white">
                    {service.title}.
                  </h1>
                </BlurReveal>
                <BlurReveal delay={0.2}>
                  <p className="text-xl text-muted-foreground leading-relaxed mb-8">{service.summary}</p>
                </BlurReveal>
                <BlurReveal delay={0.25}>
                  <div className="flex items-center gap-6 mb-10">
                    {service.price && (
                      <div>
                        <p className="text-[9px] font-display uppercase tracking-[0.2em] text-muted-foreground/50 mb-1">Starting at</p>
                        <p className="text-2xl font-display font-bold text-white">{service.price}</p>
                      </div>
                    )}
                    {service.deliveryTime && (
                      <div className="pl-6 border-l border-border">
                        <p className="text-[9px] font-display uppercase tracking-[0.2em] text-muted-foreground/50 mb-1">Delivery</p>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-muted-foreground/60" />
                          <p className="text-lg font-medium text-white">{service.deliveryTime}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </BlurReveal>
                <BlurReveal delay={0.3}>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setInquiryOpen(true)}
                      className="inline-flex items-center gap-2 h-13 px-8 py-3.5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-[2px] hover:bg-neutral-200 transition-colors group/btn"
                    >
                      {service.ctaText} <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                    <a
                      href={`https://wa.me/+923350501287?text=Hi, I'm interested in your ${service.title} service`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 h-13 px-6 py-3.5 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-[10px] font-bold uppercase tracking-[0.2em] rounded-[2px] hover:bg-[#25D366]/20 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </a>
                  </div>
                </BlurReveal>
              </div>

              {/* Hero image */}
              <BlurReveal delay={0.2}>
                <div className="relative h-80 lg:h-96 rounded-[2px] overflow-hidden border border-border/50">
                  {service.heroImage ? (
                    <img src={service.heroImage} alt={service.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full border border-border flex items-center justify-center bg-background/50">
                        <Tag className="w-10 h-10 text-muted-foreground/40" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                </div>
              </BlurReveal>
            </div>
          </div>
        </section>

        <SilverDivider />

        {/* ── OVERVIEW ─────────────────────────────────────────────────── */}
        {service.description && (
          <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto max-w-3xl">
              <BlurReveal>
                <Eyebrow>Overview</Eyebrow>
                <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tighter mb-6">What is this service?</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{service.description || service.summary}</p>
              </BlurReveal>
            </div>
          </section>
        )}

        {/* ── WHAT'S INCLUDED ───────────────────────────────────────────── */}
        {(service.whatsIncluded?.length ?? 0) > 0 && (
          <section className="py-20 px-6 bg-muted/5">
            <div className="max-w-7xl mx-auto">
              <BlurReveal>
                <Eyebrow>What's Included</Eyebrow>
                <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tighter mb-12">Everything you get.</h2>
              </BlurReveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {service.whatsIncluded?.map((item, i) => (
                  <BlurReveal key={i} delay={i * 0.05}>
                    <TiltCard className="group border border-border bg-card/40 rounded-[2px] p-5 hover:border-white/20 transition-all duration-300 h-full">
                      <AnimatedBorderSweep />
                      <div className="flex items-start gap-3 relative z-10">
                        <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-white font-medium leading-snug">{item}</span>
                      </div>
                    </TiltCard>
                  </BlurReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── PROCESS ───────────────────────────────────────────────────── */}
        {(service.processSteps?.length ?? 0) > 0 && (
          <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <BlurReveal>
                <Eyebrow>Process</Eyebrow>
                <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tighter mb-12">How it works.</h2>
              </BlurReveal>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {service.processSteps?.map((step, i) => (
                  <BlurReveal key={i} delay={i * 0.06}>
                    <div className="relative">
                      {/* Connector line */}
                      {i < (service.processSteps?.length ?? 0) - 1 && (
                        <div className="hidden lg:block absolute top-6 left-full w-full h-[1px] bg-border/50 z-0" />
                      )}
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-display font-bold text-white">{String(i + 1).padStart(2, "0")}</span>
                          </div>
                          <h3 className="text-sm font-display font-bold text-white uppercase tracking-[0.1em]">
                            {PROCESS_TITLES[i] ?? `Step ${i + 1}`}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
                      </div>
                    </div>
                  </BlurReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── PORTFOLIO ─────────────────────────────────────────────────── */}
        {portfolioItems && portfolioItems.length > 0 && (
          <section className="py-20 px-6 bg-muted/5">
            <div className="max-w-7xl mx-auto">
              <BlurReveal>
                <Eyebrow>Portfolio</Eyebrow>
                <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tighter mb-12">Related work.</h2>
              </BlurReveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioItems.map((project, i) => (
                  <BlurReveal key={project.id} delay={i * 0.07}>
                    <TiltCard className="group border border-border bg-card/40 rounded-[2px] overflow-hidden hover:border-white/20 transition-all duration-300">
                      <AnimatedBorderSweep />
                      <div className="relative h-44 overflow-hidden bg-muted/20">
                        {project.imageUrl ? (
                          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground/20 text-sm">No image</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                      </div>
                      <div className="p-5 relative z-10">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-base font-display font-bold text-white">{project.title}</h3>
                          <span className="text-[9px] font-display uppercase tracking-[0.15em] text-muted-foreground/50 shrink-0">{project.year}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{project.summary}</p>
                        {project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {project.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-[9px] px-2 py-0.5 border border-border/50 rounded-[2px] text-muted-foreground/60">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </TiltCard>
                  </BlurReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
        {testimonials && testimonials.length > 0 && (
          <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <BlurReveal>
                <Eyebrow>Testimonials</Eyebrow>
                <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tighter mb-12">What clients say.</h2>
              </BlurReveal>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((t, i) => (
                  <BlurReveal key={t.id} delay={i * 0.07}>
                    <TiltCard className="group border border-border bg-card/40 rounded-[2px] p-6 hover:border-white/20 transition-all h-full">
                      <AnimatedBorderSweep />
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex mb-4 gap-0.5">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <Star key={s} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed italic flex-1 mb-6">"{t.quote}"</p>
                        <div className="flex items-center gap-3">
                          {t.avatarUrl ? (
                            <img src={t.avatarUrl} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-border" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-white">
                              {t.name[0]}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-display font-bold text-white">{t.name}</p>
                            <p className="text-[10px] text-muted-foreground/60">{t.role}{t.company ? `, ${t.company}` : ""}</p>
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </BlurReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section className="py-20 px-6 bg-muted/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
              <div className="lg:col-span-2">
                <BlurReveal>
                  <Eyebrow>FAQ</Eyebrow>
                  <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tighter mb-4">Common questions.</h2>
                  <p className="text-muted-foreground">Can't find your answer? <button onClick={() => setInquiryOpen(true)} className="text-white underline underline-offset-4">Ask us directly.</button></p>
                </BlurReveal>
              </div>
              <div className="lg:col-span-3">
                <BlurReveal delay={0.1}>
                  <div className="border-t border-border/50">
                    {displayFaqs.map((faq, i) => (
                      <FaqItem key={faq.id} q={faq.question} a={faq.answer} index={i} />
                    ))}
                  </div>
                </BlurReveal>
              </div>
            </div>
          </div>
        </section>

        <SilverDivider />

        {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <BlurReveal>
              <Eyebrow>Ready to Begin?</Eyebrow>
              <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-6">
                Let's build something <br className="hidden md:block" />
                <span className="text-muted-foreground/60">exceptional.</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-12">
                Tell us about your project. We'll review your inquiry and respond within 24 hours with a custom proposal.
              </p>
            </BlurReveal>
            <BlurReveal delay={0.15}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setInquiryOpen(true)}
                  className="inline-flex items-center gap-2 h-14 px-10 bg-white text-black text-[10px] font-bold uppercase tracking-[0.25em] rounded-[2px] hover:bg-neutral-200 transition-colors group/btn"
                >
                  {service.ctaText} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 h-14 px-8 border border-border text-[10px] font-bold uppercase tracking-[0.25em] rounded-[2px] text-muted-foreground hover:text-white hover:border-white/30 transition-all"
                >
                  Contact Us
                </Link>
                <a
                  href={`https://wa.me/+923350501287?text=Hi, I'd like to get started with ${service.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-14 px-8 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-[10px] font-bold uppercase tracking-[0.2em] rounded-[2px] hover:bg-[#25D366]/20 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </BlurReveal>
          </div>
        </section>
      </div>

      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        serviceSlug={slug ?? ""}
        serviceTitle={service.title ?? ""}
        servicePrice={service.price}
      />
    </PublicLayout>
  )
}
