import { useState } from "react"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { useListPricingPlans, useListTestimonials } from "@/lib/api-client"
import { Link } from "wouter"
import { Check, X, ArrowRight, MessageCircle, Star, Zap, Shield, Clock, DollarSign, HeartHandshake, Award } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Eyebrow, TiltCard, AnimatedBorderSweep, SpotlightBackground, BlurReveal, SilverDivider,
} from "@/components/effects"
import type { PricingPlan } from "@/lib/api-client/generated/api.schemas"

// ─── Static fallback bundles (shown when DB hasn't been seeded yet) ───────────
const STATIC_PLANS: PricingPlan[] = [
  {
    id: 1,
    name: "Starter Bundle",
    tagline: "Launch fast, look professional.",
    price: "PKR 18,000",
    billingNote: "One-time payment",
    isFeatured: false,
    sortOrder: 1,
    features: [
      "Landing page — custom design",
      "Mobile responsive",
      "Contact / lead form",
      "Basic SEO setup",
      "3 social media graphics",
      "30-day post-launch support",
      "1 round of revisions",
    ],
  },
  {
    id: 2,
    name: "Growth Bundle",
    tagline: "Everything you need to grow online.",
    price: "PKR 40,000",
    billingNote: "One-time payment",
    isFeatured: true,
    sortOrder: 2,
    features: [
      "Business website — up to 5 pages",
      "3 edited videos (Reels / YouTube)",
      "Full SEO optimisation",
      "Google Analytics setup",
      "Social media profile setup",
      "2 rounds of revisions",
      "60-day post-launch support",
    ],
  },
  {
    id: 3,
    name: "Elite Bundle",
    tagline: "Maximum impact, premium execution.",
    price: "PKR 80,000",
    billingNote: "One-time payment",
    isFeatured: false,
    sortOrder: 3,
    features: [
      "Custom-coded website (React/Next.js)",
      "1 month content management",
      "2 UGC videos",
      "Advanced animations (Framer Motion)",
      "SEO architecture + schema markup",
      "Priority 24h support",
      "3 rounds of revisions",
      "Full source code handover",
    ],
  },
]

// ─── Feature comparison table data ────────────────────────────────────────────
const COMPARE_ROWS: { label: string; starter: string | boolean; growth: string | boolean; elite: string | boolean }[] = [
  { label: "Website type",         starter: "Landing page",        growth: "Business website (5p)", elite: "Custom-coded website" },
  { label: "Video editing",        starter: false,                 growth: "3 videos",               elite: "Via content management" },
  { label: "UGC content",          starter: false,                 growth: false,                    elite: "2 videos" },
  { label: "Content management",   starter: false,                 growth: false,                    elite: "1 month included" },
  { label: "SEO",                  starter: "Basic",               growth: "Full",                   elite: "Advanced architecture" },
  { label: "Social media",         starter: "3 graphics",          growth: "Profile setup",           elite: "Full management" },
  { label: "Revisions",            starter: "1 round",             growth: "2 rounds",               elite: "3 rounds" },
  { label: "Post-launch support",  starter: "30 days",             growth: "60 days",                elite: "Priority 24h SLA" },
  { label: "Delivery estimate",    starter: "5–7 days",            growth: "10–14 days",             elite: "18–24 days" },
  { label: "Source code handover", starter: false,                 growth: false,                    elite: true },
  { label: "Installment option",   starter: true,                  growth: true,                     elite: true },
]

// ─── Why Darklightz ───────────────────────────────────────────────────────────
const WHY_US = [
  { icon: Zap,           title: "Fast Delivery",         body: "Most projects are delivered in under 14 days. We respect your timeline." },
  { icon: DollarSign,    title: "No Hidden Fees",         body: "Every price is agreed upfront. What you see is what you pay." },
  { icon: Shield,        title: "Pakistan-Based",         body: "We understand the local market, payment methods, and customer psychology." },
  { icon: Award,         title: "Premium Output",         body: "Studio-grade quality on every deliverable — no templates, no shortcuts." },
  { icon: HeartHandshake,title: "Post-Launch Support",    body: "We don't disappear after delivery. Every bundle includes a support window." },
  { icon: Clock,         title: "Flexible Payments",      body: "Installment plans available on every bundle. Just ask during inquiry." },
]

// ─── FAQs ─────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "What payment methods do you accept?",
    a: "We accept bank transfer, JazzCash, EasyPaisa, and major credit/debit cards. A 50% deposit is required to start, with the remainder due on delivery.",
  },
  {
    q: "Can I pay in installments?",
    a: "Yes. All bundles support a 50/50 split — 50% to begin, 50% on delivery. For Elite Bundle, a 3-part split (33%/33%/34%) is also available on request.",
  },
  {
    q: "Can I mix services from different bundles or add extras?",
    a: "Absolutely. Bundles are starting points. You can add individual services at their listed prices, or ask us to build a custom scope that fits exactly what you need.",
  },
  {
    q: "What if I need changes after the project is delivered?",
    a: "Each bundle includes a defined number of revision rounds. After that, additional revisions are billed at a modest hourly rate. Our monthly maintenance plan is the best option for ongoing changes.",
  },
  {
    q: "How long does a typical project take?",
    a: "Starter Bundle: 5–7 days. Growth Bundle: 10–14 days. Elite Bundle: 18–24 days. Timelines start once we receive your deposit and onboarding materials.",
  },
  {
    q: "Do you offer ongoing support after the project ends?",
    a: "Yes — every bundle includes a post-launch support window. For long-term care, our Monthly Website Maintenance plan (PKR 5,000/mo) keeps your site secure, fast, and updated.",
  },
  {
    q: "What if I'm not satisfied with the work?",
    a: "We work revision round by revision round with your feedback guiding us. If you're still unsatisfied after revisions, we'll discuss a resolution — our reputation depends on happy clients.",
  },
]

// ─── Helper: comparison cell ──────────────────────────────────────────────────
function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="w-4 h-4 text-white mx-auto" />
  if (value === false) return <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />
  return <span className="text-xs text-muted-foreground text-center block">{value}</span>
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function Pricing() {
  const { data: apiPlans, isLoading } = useListPricingPlans()
  const { data: testimonials = [] } = useListTestimonials()
  const [highlighted, setHighlighted] = useState<number | null>(null)

  const plans: PricingPlan[] = (apiPlans && apiPlans.length > 0) ? apiPlans : STATIC_PLANS

  return (
    <PublicLayout>
      <div className="relative min-h-[100dvh]">
        <SpotlightBackground />

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="pt-40 pb-24 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mb-20 text-center mx-auto">
              <div className="flex justify-center mb-4">
                <Eyebrow>Bundles & Pricing</Eyebrow>
              </div>
              <BlurReveal>
                <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6">
                  Clear Pricing.<br className="hidden md:block" />
                  <span className="text-muted-foreground/50">No Surprises.</span>
                </h1>
              </BlurReveal>
              <BlurReveal delay={0.15}>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Choose a bundle that matches your goals, or mix individual services.
                  Every price is agreed upfront — what you see is what you pay.
                </p>
              </BlurReveal>
            </div>

            {/* ── BUNDLE CARDS ────────────────────────────────────────────── */}
            {isLoading ? (
              <div className="text-center py-20 text-muted-foreground/50 text-sm">Loading plans...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {plans.map((plan, i) => (
                  <BlurReveal key={plan.id} delay={i * 0.1}>
                    <div
                      onMouseEnter={() => setHighlighted(plan.id)}
                      onMouseLeave={() => setHighlighted(null)}
                    >
                    <TiltCard
                      className={`group relative rounded-[2px] p-8 border flex flex-col h-full transition-all duration-500 cursor-pointer ${
                        plan.isFeatured
                          ? "border-white/25 bg-card/80 shadow-[0_0_60px_rgba(255,255,255,0.04)]"
                          : highlighted === plan.id
                          ? "border-white/20 bg-card/60"
                          : "border-border bg-card/40"
                      }`}
                    >
                      {plan.isFeatured && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none rounded-[inherit]" />
                          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-white text-black rounded-[2px] text-[9px] font-display uppercase tracking-[0.2em] font-bold z-10">
                            Recommended
                          </div>
                        </>
                      )}
                      <AnimatedBorderSweep />

                      {/* Plan header */}
                      <div className="relative z-10 mb-8 mt-2">
                        <h3 className="text-2xl font-display font-bold text-white mb-2">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground">{plan.tagline}</p>
                      </div>

                      {/* Price */}
                      <div className="relative z-10 mb-8 pb-8 border-b border-border/60">
                        <div className="text-4xl font-display font-bold text-white mb-1">{plan.price}</div>
                        <div className="text-xs text-muted-foreground/60 font-mono uppercase tracking-widest">{plan.billingNote}</div>
                      </div>

                      {/* Features list */}
                      <ul className="relative z-10 space-y-3.5 mb-10 flex-1">
                        {plan.features.map((feature, j) => (
                          <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <div className="w-4 h-4 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                            <span className="leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <div className="relative z-10 mt-auto space-y-3">
                        <a
                          href={`https://wa.me/+923351468615?text=Hi, I'm interested in the ${plan.name} — ${plan.price}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full h-12 inline-flex items-center justify-center gap-2 rounded-[2px] text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                            plan.isFeatured
                              ? "bg-white text-black hover:bg-neutral-200"
                              : "border border-border text-white hover:border-white/40 hover:bg-white/5"
                          }`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> Inquire on WhatsApp
                        </a>
                        <Link
                          href="/contact"
                          className="w-full h-10 inline-flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground hover:text-white transition-colors"
                        >
                          Send a message instead
                        </Link>
                      </div>
                    </TiltCard>
                    </div>
                  </BlurReveal>
                ))}
              </div>
            )}

            {/* Installment note */}
            <BlurReveal delay={0.3}>
              <p className="text-center text-xs text-muted-foreground/50 mt-8 max-w-md mx-auto">
                All bundles available on 50/50 installment. 50% to start, 50% on delivery.
                <span className="text-muted-foreground/30"> · </span>
                JazzCash · EasyPaisa · Bank Transfer · Card accepted.
              </p>
            </BlurReveal>
          </div>
        </section>

        <SilverDivider />

        {/* ── FEATURE COMPARISON TABLE ──────────────────────────────────────── */}
        <section className="py-24 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <BlurReveal>
              <div className="mb-12 text-center">
                <Eyebrow>Side by Side</Eyebrow>
                <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tighter mb-4">Bundle comparison.</h2>
                <p className="text-muted-foreground max-w-xl mx-auto text-sm">Everything laid out so you can pick the right bundle without second-guessing.</p>
              </div>
            </BlurReveal>

            <BlurReveal delay={0.1}>
              <div className="overflow-x-auto rounded-[2px] border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/10">
                      <th className="text-left p-5 text-xs font-display uppercase tracking-wider text-muted-foreground/60 w-1/3 md:w-2/5">Feature</th>
                      <th className="p-5 text-center text-xs font-display uppercase tracking-wider text-muted-foreground/80">
                        <div className="text-white font-bold text-sm mb-0.5">Starter</div>
                        <div className="text-muted-foreground/60 font-mono text-[10px]">PKR 18,000</div>
                      </th>
                      <th className="p-5 text-center text-xs font-display uppercase tracking-wider bg-white/[0.03] relative">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20" />
                        <div className="text-white font-bold text-sm mb-0.5">Growth ★</div>
                        <div className="text-muted-foreground/60 font-mono text-[10px]">PKR 40,000</div>
                      </th>
                      <th className="p-5 text-center text-xs font-display uppercase tracking-wider text-muted-foreground/80">
                        <div className="text-white font-bold text-sm mb-0.5">Elite</div>
                        <div className="text-muted-foreground/60 font-mono text-[10px]">PKR 80,000</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARE_ROWS.map((row, i) => (
                      <tr key={i} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-muted/5"}`}>
                        <td className="p-4 pl-5 text-xs text-muted-foreground/80">{row.label}</td>
                        <td className="p-4 text-center"><Cell value={row.starter} /></td>
                        <td className="p-4 text-center bg-white/[0.02]"><Cell value={row.growth} /></td>
                        <td className="p-4 text-center"><Cell value={row.elite} /></td>
                      </tr>
                    ))}
                    {/* CTA row */}
                    <tr className="bg-muted/5">
                      <td className="p-5 text-xs text-muted-foreground/50">Ready to begin?</td>
                      {[
                        { name: "Starter Bundle", price: "PKR 18,000" },
                        { name: "Growth Bundle",  price: "PKR 40,000", featured: true },
                        { name: "Elite Bundle",   price: "PKR 80,000" },
                      ].map((p, i) => (
                        <td key={i} className={`p-4 text-center ${p.featured ? "bg-white/[0.02]" : ""}`}>
                          <a
                            href={`https://wa.me/+923351468615?text=Hi, I'm interested in the ${p.name} — ${p.price}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-[2px] text-[9px] font-bold uppercase tracking-[0.18em] transition-all ${
                              p.featured
                                ? "bg-white text-black hover:bg-neutral-200"
                                : "border border-border text-muted-foreground hover:text-white hover:border-white/30"
                            }`}
                          >
                            Choose <ArrowRight className="w-3 h-3" />
                          </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </BlurReveal>
          </div>
        </section>

        <SilverDivider />

        {/* ── WHY DARKLIGHTZ ────────────────────────────────────────────────── */}
        <section className="py-24 px-6 relative z-10 bg-muted/5">
          <div className="max-w-7xl mx-auto">
            <BlurReveal>
              <div className="mb-12 text-center">
                <Eyebrow>Why Us</Eyebrow>
                <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tighter mb-4">Why choose Darklightz Studio?</h2>
                <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                  We're not a marketplace. We're a dedicated studio that treats every project as if our reputation depends on it — because it does.
                </p>
              </div>
            </BlurReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {WHY_US.map(({ icon: Icon, title, body }, i) => (
                <BlurReveal key={i} delay={i * 0.06}>
                  <TiltCard className="group border border-border bg-card/40 rounded-[2px] p-6 hover:border-white/20 transition-all duration-300 h-full">
                    <AnimatedBorderSweep />
                    <div className="relative z-10">
                      <div className="w-10 h-10 rounded-full border border-border bg-white/5 flex items-center justify-center mb-5">
                        <Icon className="w-4.5 h-4.5 text-white" />
                      </div>
                      <h3 className="text-base font-display font-bold text-white mb-2">{title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                    </div>
                  </TiltCard>
                </BlurReveal>
              ))}
            </div>
          </div>
        </section>

        <SilverDivider />

        {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
        {testimonials.length > 0 && (
          <>
            <section className="py-24 px-6 relative z-10">
              <div className="max-w-7xl mx-auto">
                <BlurReveal>
                  <div className="mb-12 text-center">
                    <Eyebrow>Client Stories</Eyebrow>
                    <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tighter mb-4">What clients say.</h2>
                  </div>
                </BlurReveal>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {testimonials.slice(0, 6).map((t, i) => (
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
            <SilverDivider />
          </>
        )}

        {/* ── FAQs ──────────────────────────────────────────────────────────── */}
        <section className="py-24 px-6 relative z-10 bg-muted/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
              <div className="lg:col-span-2">
                <BlurReveal>
                  <Eyebrow>FAQ</Eyebrow>
                  <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tighter mb-4">Common questions.</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    Can't find your answer? We're happy to talk it through.
                  </p>
                  <div className="flex flex-col gap-3">
                    <a
                      href="https://wa.me/+923351468615?text=Hi, I have a question about pricing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 h-11 px-6 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-[10px] font-bold uppercase tracking-[0.2em] rounded-[2px] hover:bg-[#25D366]/20 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" /> Ask on WhatsApp
                    </a>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 h-11 px-6 border border-border text-[10px] font-bold uppercase tracking-[0.2em] rounded-[2px] text-muted-foreground hover:text-white hover:border-white/30 transition-all"
                    >
                      Contact Us
                    </Link>
                  </div>
                </BlurReveal>
              </div>

              <div className="lg:col-span-3">
                <BlurReveal delay={0.1}>
                  <Accordion type="single" collapsible className="w-full border-t border-border/50">
                    {FAQS.map((faq, i) => (
                      <AccordionItem key={i} value={`item-${i}`} className="border-b border-border/50">
                        <AccordionTrigger className="text-sm font-medium text-white hover:no-underline hover:text-white/80 py-5 text-left">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </BlurReveal>
              </div>
            </div>
          </div>
        </section>

        <SilverDivider />

        {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
        <section className="py-24 px-6 relative z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <BlurReveal>
              <Eyebrow>Ready to Begin?</Eyebrow>
              <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-6">
                Pick your bundle.<br className="hidden md:block" />
                <span className="text-muted-foreground/50">Let's get to work.</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-12">
                Not sure which bundle fits? Tell us about your project and we'll recommend what actually makes sense for your goals and budget.
              </p>
            </BlurReveal>
            <BlurReveal delay={0.15}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://wa.me/+923351468615?text=Hi, I'd like to discuss pricing and choose a bundle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-14 px-10 bg-[#25D366] text-black text-[10px] font-bold uppercase tracking-[0.25em] rounded-[2px] hover:bg-[#22c55e] transition-colors group/btn"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Inquiry
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 h-14 px-8 border border-border text-[10px] font-bold uppercase tracking-[0.25em] rounded-[2px] text-muted-foreground hover:text-white hover:border-white/30 transition-all"
                >
                  Send a Message <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 h-14 px-8 border border-border/50 text-[10px] font-bold uppercase tracking-[0.25em] rounded-[2px] text-muted-foreground/60 hover:text-white hover:border-white/30 transition-all"
                >
                  Browse Individual Services
                </Link>
              </div>
            </BlurReveal>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
