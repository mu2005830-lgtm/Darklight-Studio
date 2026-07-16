import { useState } from "react"
import { Link } from "wouter"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { useListServices } from "@/lib/api-client"
import { motion } from "framer-motion"
import { ArrowRight, Clock, Tag, Star, MessageCircle } from "lucide-react"
import {
  Eyebrow,
  BlurReveal,
  SpotlightBackground,
  AnimatedBorderSweep,
  TiltCard,
} from "@/components/effects"
import { InquiryModal } from "@/components/InquiryModal"
import type { Service } from "@/lib/api-client/generated/api.schemas"

// Fallback icon SVGs by index
const ServiceIcon = ({ icon, index }: { icon?: string; index: number }) => {
  if (icon && icon !== "✦" && !icon.startsWith("data:")) {
    return <span className="text-2xl">{icon}</span>
  }
  const icons = [
    // Monitor / Website
    <svg key="monitor" viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
    </svg>,
    // Shopify / Store
    <svg key="store" viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>,
    // Code / Custom
    <svg key="code" viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>,
    // Wrench / Bug fixes
    <svg key="wrench" viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>,
    // Video
    <svg key="video" viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>,
    // Content / Document
    <svg key="doc" viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>,
  ]
  return icons[index % icons.length]
}

const CATEGORIES = [
  { id: "all", label: "All Services" },
  { id: "website-services", label: "Website Services" },
  { id: "content-creation", label: "Content Creation" },
]

const CATEGORY_META: Record<string, { eyebrow: string; headline: string; sub: string }> = {
  "website-services": {
    eyebrow: "Digital Presence",
    headline: "Website Services",
    sub: "From landing pages to full e-commerce stores — every pixel crafted for conversion.",
  },
  "content-creation": {
    eyebrow: "Visual Storytelling",
    headline: "Content Creation",
    sub: "High-impact video editing, UGC content, and ongoing social media management.",
  },
}

function ServiceCard({
  service,
  index,
  onGetStarted,
}: {
  service: Service
  index: number
  onGetStarted: (s: Service) => void
}) {
  return (
    <BlurReveal delay={index * 0.07}>
      <TiltCard className="group relative border border-border bg-card/40 backdrop-blur-md rounded-[2px] overflow-hidden transition-all duration-500 hover:border-white/20 h-full">
        <AnimatedBorderSweep />

        {/* Hero image */}
        <div className="relative h-48 overflow-hidden bg-muted/20">
          {service.heroImage ? (
            <img
              src={service.heroImage}
              alt={service.title}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-border/50 flex items-center justify-center bg-muted/20">
                <ServiceIcon icon={service.icon} index={index} />
              </div>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          {/* Featured badge */}
          {service.featuredBadge && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-[2px]">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-[9px] font-display uppercase tracking-[0.15em] text-white font-bold">{service.featuredBadge}</span>
            </div>
          )}
          {/* Icon badge */}
          <div className="absolute bottom-3 left-4 w-10 h-10 rounded-full border border-border/60 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <ServiceIcon icon={service.icon} index={index} />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4 relative z-10">
          <div>
            <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-white transition-colors">{service.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{service.summary}</p>
          </div>

          {/* Meta row */}
          {(service.price || service.deliveryTime) && (
            <div className="flex items-center gap-4 pt-2 border-t border-border/50">
              {service.price && (
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-muted-foreground/60" />
                  <span className="text-xs font-bold text-white">{service.price}</span>
                </div>
              )}
              {service.deliveryTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-muted-foreground/60" />
                  <span className="text-xs text-muted-foreground">{service.deliveryTime}</span>
                </div>
              )}
            </div>
          )}

          {/* CTAs */}
          <div className="flex items-center gap-2 pt-1">
            <Link
              href={`/services/${service.slug}`}
              className="flex-1 inline-flex items-center justify-center h-9 px-4 text-[10px] font-bold uppercase tracking-[0.18em] border border-border rounded-[2px] text-muted-foreground hover:text-white hover:border-white/30 transition-all duration-300"
            >
              Learn More
            </Link>
            <button
              onClick={() => onGetStarted(service)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 px-4 text-[10px] font-bold uppercase tracking-[0.18em] bg-white text-black rounded-[2px] hover:bg-neutral-200 transition-colors group/btn"
            >
              {service.ctaText || "Get Started"}
              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </TiltCard>
    </BlurReveal>
  )
}

// Fallback static services shown when API hasn't been seeded yet
const STATIC_SERVICES: Service[] = [
  { id: 1, title: "Landing Page", slug: "landing-page", summary: "High-converting single-page websites that turn visitors into leads.", description: "", icon: "✦", sortOrder: 1, category: "website-services", heroImage: "", price: "From PKR 15,000", deliveryTime: "3–5 days", featuredBadge: "Popular", whatsIncluded: [], processSteps: [], ctaText: "Get Started" },
  { id: 2, title: "Business Website", slug: "business-website", summary: "Professional multi-page websites that build credibility and drive growth.", description: "", icon: "✦", sortOrder: 2, category: "website-services", heroImage: "", price: "From PKR 25,000", deliveryTime: "7–10 days", featuredBadge: "", whatsIncluded: [], processSteps: [], ctaText: "Get Started" },
  { id: 3, title: "Custom-Coded Website", slug: "custom-website", summary: "Fully bespoke websites with hand-crafted code for maximum performance.", description: "", icon: "✦", sortOrder: 3, category: "website-services", heroImage: "", price: "From PKR 50,000", deliveryTime: "14–21 days", featuredBadge: "Premium", whatsIncluded: [], processSteps: [], ctaText: "Get Started" },
  { id: 4, title: "Shopify Website", slug: "shopify", summary: "Revenue-optimised Shopify stores built to convert browsers into buyers.", description: "", icon: "✦", sortOrder: 4, category: "website-services", heroImage: "", price: "From PKR 30,000", deliveryTime: "7–14 days", featuredBadge: "", whatsIncluded: [], processSteps: [], ctaText: "Get Started" },
  { id: 5, title: "WordPress Website", slug: "wordpress", summary: "Elegant, scalable WordPress sites with custom themes and plugins.", description: "", icon: "✦", sortOrder: 5, category: "website-services", heroImage: "", price: "From PKR 20,000", deliveryTime: "7–10 days", featuredBadge: "", whatsIncluded: [], processSteps: [], ctaText: "Get Started" },
  { id: 6, title: "Website Redesign", slug: "website-redesign", summary: "Transform your outdated site into a premium digital experience.", description: "", icon: "✦", sortOrder: 6, category: "website-services", heroImage: "", price: "From PKR 20,000", deliveryTime: "7–14 days", featuredBadge: "", whatsIncluded: [], processSteps: [], ctaText: "Get Started" },
  { id: 7, title: "Bug Fixes", slug: "bug-fixes", summary: "Fast, reliable fixes for any website issue — guaranteed resolution.", description: "", icon: "✦", sortOrder: 7, category: "website-services", heroImage: "", price: "From PKR 5,000", deliveryTime: "1–3 days", featuredBadge: "", whatsIncluded: [], processSteps: [], ctaText: "Get Started" },
  { id: 8, title: "Monthly Website Maintenance", slug: "website-maintenance", summary: "Ongoing care to keep your site secure, fast, and up-to-date.", description: "", icon: "✦", sortOrder: 8, category: "website-services", heroImage: "", price: "From PKR 8,000/mo", deliveryTime: "Ongoing", featuredBadge: "", whatsIncluded: [], processSteps: [], ctaText: "Get Started" },
  { id: 9, title: "Video Editing", slug: "video-editing", summary: "Cinematic edits that capture attention and keep viewers watching.", description: "", icon: "✦", sortOrder: 9, category: "content-creation", heroImage: "", price: "From PKR 5,000", deliveryTime: "2–4 days", featuredBadge: "", whatsIncluded: [], processSteps: [], ctaText: "Get Started" },
  { id: 10, title: "UGC Content", slug: "ugc-content", summary: "Authentic user-generated style content that builds trust and drives sales.", description: "", icon: "✦", sortOrder: 10, category: "content-creation", heroImage: "", price: "From PKR 10,000", deliveryTime: "3–5 days", featuredBadge: "Trending", whatsIncluded: [], processSteps: [], ctaText: "Get Started" },
  { id: 11, title: "Monthly Content Management", slug: "content-management", summary: "Done-for-you content strategy, creation, and publishing every month.", description: "", icon: "✦", sortOrder: 11, category: "content-creation", heroImage: "", price: "From PKR 15,000/mo", deliveryTime: "Ongoing", featuredBadge: "", whatsIncluded: [], processSteps: [], ctaText: "Get Started" },
]

export default function Services() {
  const { data: apiServices, isLoading } = useListServices()
  const [activeCategory, setActiveCategory] = useState("all")
  const [inquiryService, setInquiryService] = useState<Service | null>(null)

  // Use API data if available, otherwise fallback to static
  const allServices = (apiServices && apiServices.length > 0) ? apiServices : STATIC_SERVICES

  const filtered = activeCategory === "all"
    ? allServices
    : allServices.filter((s) => s.category === activeCategory)

  const websiteServices = allServices.filter((s) => s.category === "website-services")
  const contentServices = allServices.filter((s) => s.category === "content-creation")

  const displayServices = activeCategory === "all"
    ? null // rendered by category below
    : filtered

  return (
    <PublicLayout>
      <div className="pt-40 pb-24 md:pb-32 relative min-h-[100dvh]">
        <SpotlightBackground />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <Eyebrow>Services Hub</Eyebrow>
            <BlurReveal>
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6">
                What We Build.
              </h1>
            </BlurReveal>
            <BlurReveal delay={0.15}>
              <p className="text-xl text-muted-foreground leading-relaxed">
                End-to-end digital services — from conversion-focused websites to high-impact content. 
                Every deliverable is premium, every deadline is respected.
              </p>
            </BlurReveal>
          </div>

          {/* Category Filter */}
          <BlurReveal delay={0.2}>
            <div className="flex items-center gap-2 mb-16 border-b border-border pb-8">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2 text-[10px] font-display font-bold uppercase tracking-[0.2em] rounded-[2px] transition-all duration-300 ${
                    activeCategory === cat.id
                      ? "bg-white text-black"
                      : "border border-border text-muted-foreground hover:text-white hover:border-white/30"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </BlurReveal>

          {isLoading ? (
            <div className="py-20 text-muted-foreground/50 text-sm">Loading services...</div>
          ) : activeCategory !== "all" ? (
            // Filtered flat grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayServices?.map((service, i) => (
                <ServiceCard key={service.id} service={service} index={i} onGetStarted={setInquiryService} />
              ))}
            </div>
          ) : (
            // "All" view — two category sections
            <div className="space-y-20">
              {/* Category 1 — Website Services */}
              {websiteServices.length > 0 && (
                <section>
                  <BlurReveal>
                    <div className="mb-10">
                      <Eyebrow>{CATEGORY_META["website-services"].eyebrow}</Eyebrow>
                      <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tighter mb-3">
                        {CATEGORY_META["website-services"].headline}
                      </h2>
                      <p className="text-muted-foreground max-w-xl">{CATEGORY_META["website-services"].sub}</p>
                    </div>
                  </BlurReveal>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {websiteServices.map((service, i) => (
                      <ServiceCard key={service.id} service={service} index={i} onGetStarted={setInquiryService} />
                    ))}
                  </div>
                </section>
              )}

              {/* Category 2 — Content Creation */}
              {contentServices.length > 0 && (
                <section>
                  <BlurReveal>
                    <div className="mb-10">
                      <Eyebrow>{CATEGORY_META["content-creation"].eyebrow}</Eyebrow>
                      <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tighter mb-3">
                        {CATEGORY_META["content-creation"].headline}
                      </h2>
                      <p className="text-muted-foreground max-w-xl">{CATEGORY_META["content-creation"].sub}</p>
                    </div>
                  </BlurReveal>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {contentServices.map((service, i) => (
                      <ServiceCard key={service.id} service={service} index={i} onGetStarted={setInquiryService} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Bottom CTA */}
          <BlurReveal delay={0.3}>
            <div className="mt-24 pt-16 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-display font-bold mb-2">Not sure which service fits?</h3>
                <p className="text-muted-foreground">Let's talk. We'll recommend what your project actually needs.</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 h-12 px-6 border border-border text-[10px] font-bold uppercase tracking-[0.2em] rounded-[2px] text-muted-foreground hover:text-white hover:border-white/30 transition-all"
                >
                  Contact Us
                </Link>
                <a
                  href="https://wa.me/+923000000000?text=Hi, I'd like to discuss my project"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-12 px-6 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-[10px] font-bold uppercase tracking-[0.2em] rounded-[2px] hover:bg-[#25D366]/20 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
          </BlurReveal>
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        open={!!inquiryService}
        onClose={() => setInquiryService(null)}
        serviceSlug={inquiryService?.slug ?? ""}
        serviceTitle={inquiryService?.title ?? ""}
        servicePrice={inquiryService?.price}
      />
    </PublicLayout>
  )
}
