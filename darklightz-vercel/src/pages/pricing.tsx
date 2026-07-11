import { PublicLayout } from "@/components/layout/PublicLayout"
import { useListPricingPlans } from "@/lib/api-client"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "wouter"
import { Check } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Eyebrow, MagneticLink, TiltCard, AnimatedBorderSweep, SpotlightBackground, BlurReveal } from "@/components/effects"

export default function Pricing() {
  const { data: plans, isLoading } = useListPricingPlans()

  return (
    <PublicLayout>
      <div className="pt-40 pb-24 md:pb-32 relative min-h-[100dvh]">
        <SpotlightBackground />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mb-24 text-center mx-auto">
            <div className="flex justify-center"><Eyebrow>Partnership</Eyebrow></div>
            <BlurReveal>
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6">Engagement Models.</h1>
            </BlurReveal>
            <BlurReveal delay={0.2}>
              <p className="text-xl text-neutral-400 leading-relaxed">
                Transparent, premium pricing for elite product design and engineering.
              </p>
            </BlurReveal>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-neutral-500">Loading plans...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 max-w-6xl mx-auto">
              {plans?.map((plan, i) => (
                <BlurReveal key={plan.id} delay={i * 0.1}>
                  <TiltCard
                    className={`group relative rounded-[2px] p-8 border ${
                      plan.isFeatured
                        ? "border-white/30 bg-black/60 shadow-[0_0_40px_rgba(255,255,255,0.05)]"
                        : "border-white/10 bg-black/40"
                    } flex flex-col h-full backdrop-blur-md transition-colors hover:border-white/40`}
                  >
                    {plan.isFeatured && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none rounded-[inherit]" />
                        <AnimatedBorderSweep />
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-black rounded-full text-[9px] font-display uppercase tracking-widest font-bold z-10 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                          Recommended
                        </div>
                      </>
                    )}
                    
                    {!plan.isFeatured && <AnimatedBorderSweep />}

                    <div className="relative z-10 mb-8 mt-2">
                      <h3 className="text-2xl font-display font-bold mb-2">{plan.name}</h3>
                      <p className="text-sm text-neutral-400 h-10">{plan.tagline}</p>
                    </div>

                    <div className="relative z-10 mb-8 pb-8 border-b border-white/10">
                      <div className="text-4xl font-display font-bold text-white mb-2">{plan.price}</div>
                      <div className="text-sm text-neutral-500 font-mono">{plan.billingNote}</div>
                    </div>

                    <ul className="relative z-10 space-y-4 mb-10 flex-1">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-neutral-300">
                          <Check className="w-5 h-5 text-white shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="relative z-10 mt-auto">
                      <Link href="/contact" data-testid={`link-pricing-select-${plan.id}`}>
                        <MagneticLink
                          className={`h-12 w-full flex items-center justify-center rounded-full font-display uppercase tracking-widest text-sm font-semibold transition-all duration-300 cursor-pointer ${
                            plan.isFeatured
                              ? "bg-white text-black hover:bg-neutral-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                              : "border border-white/20 text-white hover:bg-white hover:text-black"
                          }`}
                        >
                          Select Plan
                        </MagneticLink>
                      </Link>
                    </div>
                  </TiltCard>
                </BlurReveal>
              ))}
            </div>
          )}

          <div className="max-w-3xl mx-auto border-t border-white/10 pt-24">
            <BlurReveal>
              <h2 className="text-3xl font-display font-bold tracking-tight mb-10 text-center">Frequently Asked Questions</h2>
            </BlurReveal>

            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  q: "How does the subscription model work?",
                  a: "You pause or cancel anytime. We work on one active task at a time, delivering updates every 48 hours. It's essentially having a senior designer and engineer on retainer without the overhead of hiring."
                },
                {
                  q: "Why wouldn't I just hire an in-house designer?",
                  a: "A senior level product designer costs $150k+ plus benefits, and finding one is difficult. Furthermore, you may not always have enough work to keep them busy. With our model, you get immediate access to elite talent and can pause when things slow down."
                },
                {
                  q: "What tech stack do you use?",
                  a: "We specialize in modern React ecosystems: Next.js, Vite, Tailwind CSS, Framer Motion, and Node.js/PostgreSQL backends. However, we are adaptable to your specific engineering requirements if established."
                },
                {
                  q: "Do you do custom fixed-scope projects?",
                  a: "Yes, for large scale enterprise builds we offer comprehensive project scoping. Please book a call to discuss custom requirements."
                }
              ].map((faq, i) => (
                <BlurReveal key={i} delay={i * 0.1}>
                  <AccordionItem value={`item-${i}`} className="border-white/10">
                    <AccordionTrigger className="text-lg hover:no-underline hover:text-neutral-300 transition-colors">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-neutral-400 leading-relaxed pb-6 text-base">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                </BlurReveal>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
