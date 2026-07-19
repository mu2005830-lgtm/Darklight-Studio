import { useEffect, useRef } from "react"
import { Link } from "wouter"
import { ArrowRight, ArrowUpRight, Play, Star } from "lucide-react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { useListServices, useListPortfolioProjects, useListTestimonials } from "@/lib/api-client"
import {
  MagneticButton, MagneticLink, SilverDivider, Eyebrow,
  TextSliceReveal, TiltCard, AnimatedNumber, PremiumBackground, BlurReveal,
} from "@/components/effects"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

gsap.registerPlugin(ScrollTrigger)

function Hero() {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-text-line", {
        y: 120, opacity: 0, rotateZ: 2, duration: 1.4,
        stagger: 0.15, ease: "power4.out", delay: 0.1,
      })
      gsap.from(".hero-sub", {
        opacity: 0, y: 30, duration: 1.2, delay: 0.8,
        ease: "power3.out", filter: "blur(8px)",
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col justify-center items-center text-center overflow-hidden pt-28 pb-24 px-6 bg-background"
    >
      {/* Lightweight premium background — CSS-only, no Three.js */}
      <PremiumBackground />

      <div className="z-10 w-full max-w-6xl mx-auto flex flex-col items-center my-auto">
        <div className="mb-8 overflow-hidden">
          <div className="hero-text-line inline-flex items-center gap-3 px-5 py-2 rounded-full border border-border bg-muted/40 backdrop-blur-md text-[9px] tracking-[0.25em] uppercase text-muted-foreground font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-pulse" />
            Accepting Q3 Projects
          </div>
        </div>

        <h1 className="text-[10vw] md:text-7xl lg:text-[6.5rem] font-display font-bold tracking-tighter leading-[0.9] mb-8 text-foreground">
          <div className="overflow-hidden pb-3"><div className="hero-text-line origin-left">CRAFTING</div></div>
          <div className="overflow-hidden pb-3">
            <div className="hero-text-line text-transparent bg-clip-text bg-gradient-to-r from-foreground via-muted-foreground to-muted-foreground/40">
              INEVITABLE
            </div>
          </div>
          <div className="overflow-hidden pb-3"><div className="hero-text-line">FUTURES.</div></div>
        </h1>

        <p className="hero-sub text-base md:text-xl text-muted-foreground max-w-2xl mb-10 font-light leading-relaxed">
          Elite digital product design & engineering. We build with quiet confidence, zero fluff, and obsessive craft.
        </p>

        <div className="hero-sub flex flex-col sm:flex-row gap-6 items-center">
          <Link href="/book-a-call" data-testid="link-hero-start-project">
            <MagneticButton className="relative group overflow-hidden rounded-full bg-foreground text-background px-10 py-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold">
              <span className="relative z-10">Start a Project</span>
              <div className="absolute inset-0 bg-muted-foreground transform translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
            </MagneticButton>
          </Link>

          <Link href="/portfolio" data-testid="link-hero-view-work">
            <MagneticButton className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground hover:text-muted-foreground transition-colors">
              View Our Work
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all duration-300">
                <Play className="w-3 h-3 ml-0.5 fill-current" />
              </div>
            </MagneticButton>
          </Link>
        </div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-3 text-muted-foreground"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Scroll</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-muted-foreground to-transparent relative overflow-hidden">
          <motion.div
            className="absolute top-0 w-full h-1/2 bg-foreground"
            animate={{ top: ["-50%", "150%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </section>
  )
}

function Capabilities({ services }: { services: { id: number; title: string; summary: string }[] | undefined }) {
  const containerRef = useRef<HTMLElement>(null)

  return (
    <section className="py-32 md:py-48 px-6 bg-background relative z-10" ref={containerRef}>
      <SilverDivider />

      <div className="max-w-7xl mx-auto pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          <div className="lg:col-span-5 relative">
            <div className="sticky top-40">
              <BlurReveal>
                <Eyebrow>Expertise</Eyebrow>
              </BlurReveal>
              <TextSliceReveal>
                <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter leading-[1.1] mb-8 text-muted-foreground">
                  SYSTEMS THAT <br /> <span className="text-foreground">DRIVE</span> <br /> OUTCOMES.
                </h2>
              </TextSliceReveal>
              <BlurReveal delay={0.2}>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-sm mb-8">
                  We handle the entire product lifecycle from blank canvas to production-ready scale. No handoffs, no lost translation.
                </p>
                <Link href="/services" className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-foreground transition-colors" data-testid="link-capabilities-explore-all">
                  Explore all services <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </BlurReveal>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col border-t border-border mt-10 lg:mt-0">
            {services?.slice(0, 3).map((service, i) => (
              <BlurReveal delay={i * 0.1} key={service.id}>
                <TiltCard className="group relative border-b border-border py-12 md:py-16 hover:pl-10 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] cursor-pointer bg-transparent">
                  <div className="absolute inset-0 bg-gradient-to-r from-muted/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-inherit" />

                  <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-12 md:items-baseline">
                    <span className="text-xs font-display font-bold tracking-[0.2em] text-muted-foreground/40 group-hover:text-muted-foreground transition-colors">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex-1 pr-12 md:pr-0">
                      <h3 className="text-2xl md:text-4xl font-display font-medium tracking-tight mb-4 group-hover:text-foreground transition-colors text-muted-foreground">{service.title}</h3>
                      <p className="text-muted-foreground/70 text-base leading-relaxed max-w-md group-hover:text-muted-foreground transition-colors">
                        {service.summary}
                      </p>
                    </div>
                  </div>

                  <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 -translate-x-8 group-hover:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-border flex items-center justify-center bg-muted/30 backdrop-blur-sm">
                      <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
                    </div>
                  </div>
                </TiltCard>
              </BlurReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function SelectedWork({ projects }: { projects: { id: number; title: string; category: string; year: number; imageUrl: string }[] | undefined }) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".work-card").forEach((card) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: "top 80%" },
          y: 80, opacity: 0, filter: "blur(12px)", duration: 1.2, ease: "power3.out",
        })
      })
    }, containerRef)
    return () => ctx.revert()
  }, [projects])

  return (
    <section ref={containerRef} className="py-32 md:py-48 px-6 bg-background relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div>
            <BlurReveal>
              <Eyebrow>Portfolio</Eyebrow>
            </BlurReveal>
            <TextSliceReveal>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tighter text-foreground">
                SELECTED<br />
                <span className="text-muted-foreground/50">ARCHIVE.</span>
              </h2>
            </TextSliceReveal>
          </div>
          <BlurReveal delay={0.2}>
            <Link href="/portfolio" data-testid="link-selected-work-view-all">
              <MagneticButton className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-foreground transition-colors pb-2 border-b border-border hover:border-foreground">
                View All Work <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </MagneticButton>
            </Link>
          </BlurReveal>
        </div>

        <div className="flex flex-col gap-16 md:gap-40">
          {projects?.slice(0, 3).map((project) => (
            <Link key={project.id} href="/portfolio" className="work-card group relative cursor-pointer block w-full" data-testid={`link-work-${project.id}`}>
              <TiltCard className="relative aspect-[4/3] md:aspect-[21/9] overflow-hidden rounded-[2px] bg-muted border border-border">
                <div className="absolute inset-0 z-10 bg-black/30 group-hover:bg-black/5 transition-colors duration-700 pointer-events-none rounded-[inherit]" />
                <img
                  src={project.imageUrl || `/placeholders/project${(project.id % 4) + 1}.jpg`}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] rounded-inherit"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[inherit]">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-background/10 backdrop-blur-md border border-border flex items-center justify-center text-foreground text-[10px] font-bold uppercase tracking-[0.2em] translate-y-12 group-hover:translate-y-0 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]">
                    Explore
                  </div>
                </div>
              </TiltCard>

              <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div>
                  <h3 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-2 text-foreground">{project.title}</h3>
                </div>
                <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">
                  <span>{project.category}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                  <span>{project.year}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function SocialProof({ testimonial }: { testimonial: { quote: string; name: string; role: string; company: string; avatarUrl: string } | undefined }) {
  if (!testimonial) return null

  return (
    <section className="py-32 md:py-48 px-6 bg-card relative overflow-hidden flex items-center justify-center border-y border-border">
      <PremiumBackground />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <BlurReveal>
          <div className="flex justify-center gap-2 mb-12">
            {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 text-muted-foreground/30 fill-muted-foreground/30" />)}
          </div>
        </BlurReveal>

        <BlurReveal delay={0.1}>
          <h3 className="text-2xl md:text-4xl lg:text-5xl font-display font-medium leading-[1.4] text-muted-foreground mb-16 tracking-tight">
            "{testimonial.quote}"
          </h3>
        </BlurReveal>

        <BlurReveal delay={0.2}>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-6 border border-border p-1">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img src={testimonial.avatarUrl || `/testimonials/avatar1.jpg`} alt={testimonial.name} className="w-full h-full object-cover grayscale opacity-80" />
              </div>
            </div>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-foreground mb-2">{testimonial.name}</p>
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-[0.2em]">{testimonial.role}, {testimonial.company}</p>
          </div>
        </BlurReveal>
      </div>
    </section>
  )
}

function Engagement() {
  return (
    <section className="py-32 md:py-48 px-6 bg-background relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 md:mb-32">
          <BlurReveal>
            <div className="flex justify-center items-center gap-4 mb-8">
              <span className="w-8 h-[1px] bg-muted-foreground/40" />
              <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-muted-foreground">Partnership</span>
              <span className="w-8 h-[1px] bg-muted-foreground/40" />
            </div>
          </BlurReveal>
          <TextSliceReveal>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tighter mb-8 text-foreground">ENGAGEMENT.</h2>
          </TextSliceReveal>
          <BlurReveal delay={0.2}>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
              We partner with a select number of clients each quarter to ensure uncompromising quality and focused attention.
            </p>
          </BlurReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <BlurReveal delay={0.1}>
            <TiltCard className="group relative p-[1px] bg-gradient-to-b from-border to-transparent rounded-[2px] overflow-hidden">
              <div className="relative h-full bg-card p-10 md:p-12 flex flex-col items-start rounded-[1px] z-10">
                <div className="px-4 py-1.5 bg-muted border border-border text-foreground text-[9px] font-bold uppercase tracking-[0.25em] mb-8">Retainer</div>
                <h3 className="text-2xl md:text-4xl font-display font-medium mb-6 text-foreground">Growth Partner</h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-12 flex-grow">
                  Ongoing design, development, and strategic execution. Acting as your elite in-house digital team without the overhead.
                </p>
                <Link href="/pricing" className="w-full" data-testid="link-engagement-retainer">
                  <MagneticButton className="w-full py-4 border border-border text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-foreground hover:text-background hover:border-foreground transition-colors text-center text-foreground">
                    View Engagement Models
                  </MagneticButton>
                </Link>
              </div>
            </TiltCard>
          </BlurReveal>

          <BlurReveal delay={0.2}>
            <TiltCard className="group relative p-[1px] bg-gradient-to-b from-muted-foreground/30 to-transparent rounded-[2px] overflow-hidden">
              <div className="relative h-full bg-card p-10 md:p-12 flex flex-col items-start rounded-[1px] z-10">
                <div className="px-4 py-1.5 bg-foreground text-background text-[9px] font-bold uppercase tracking-[0.25em] mb-8">Project</div>
                <h3 className="text-2xl md:text-4xl font-display font-medium mb-6 text-foreground">Dedicated Build</h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-12 flex-grow">
                  End-to-end delivery of a specific digital product, website, or campaign. Fixed scope, defined timeline, guaranteed excellence.
                </p>
                <Link href="/contact" className="w-full" data-testid="link-engagement-project">
                  <MagneticButton className="w-full py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.25em] font-bold hover:opacity-80 transition-opacity text-center">
                    Start a Conversation
                  </MagneticButton>
                </Link>
              </div>
            </TiltCard>
          </BlurReveal>
        </div>
      </div>
    </section>
  )
}

function HomeFAQ() {
  return (
    <section className="py-32 md:py-48 px-6 bg-background relative z-10 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <BlurReveal>
            <Eyebrow>FAQ</Eyebrow>
          </BlurReveal>
          <TextSliceReveal>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-6 text-foreground">COMMON INQUIRIES.</h2>
          </TextSliceReveal>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {[
            { q: "What types of businesses do you work with?", a: "We work with any business that wants a professional online presence — gyms, restaurants, clinics, salons, real estate, clothing brands, perfume brands, e-commerce stores, and local businesses across Pakistan." },
            { q: "How long does a project take?", a: "Starter Bundle: 5–7 days. Growth Bundle: 10–14 days. Elite Bundle: 18–24 days. Timelines begin once we receive your 30% advance and onboarding materials." },
            { q: "Who will be working on my project?", a: "You deal directly with the Darklightz Studio team — the people actually doing the work. No middlemen, no hand-offs. Direct communication from day one to launch." },
            { q: "How do revisions work?", a: "Every bundle includes 3 revision rounds. We work through your feedback round by round until the deliverable meets your expectations. Additional revisions beyond that are available at a modest rate." },
            { q: "What are your payment terms?", a: "We require a 30% advance to begin work. A live demo is shared before final delivery. The remaining 70% is due before source code ownership is transferred. JazzCash, EasyPaisa, bank transfer, and cards accepted." },
          ].map((faq, i) => (
            <BlurReveal key={i} delay={i * 0.1}>
              <AccordionItem value={`item-${i}`} className="border-border">
                <AccordionTrigger className="text-lg md:text-xl py-6 hover:no-underline hover:text-muted-foreground transition-colors text-foreground">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-8 text-base">{faq.a}</AccordionContent>
              </AccordionItem>
            </BlurReveal>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="py-32 md:py-48 px-6 bg-card relative overflow-hidden border-t border-border">
      <PremiumBackground />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <BlurReveal>
          <h2 className="text-4xl md:text-7xl lg:text-[7rem] font-display font-bold tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-foreground to-muted-foreground/40 leading-[0.9]">
            READY TO SHIFT <br /> THE PARADIGM?
          </h2>
        </BlurReveal>
        <BlurReveal delay={0.1}>
          <p className="text-base md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light">
            We are currently accepting new engagements. Let's discuss how we can elevate your digital presence.
          </p>
        </BlurReveal>
        <BlurReveal delay={0.2}>
          <Link href="/book-a-call" data-testid="link-final-cta-book-call">
            <MagneticButton className="inline-flex h-16 px-10 md:h-20 md:px-14 bg-foreground text-background uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold items-center justify-center hover:opacity-80 transition-opacity rounded-full">
              Book Your Discovery Call
            </MagneticButton>
          </Link>
        </BlurReveal>
      </div>
    </section>
  )
}

export default function Home() {
  const { data: services } = useListServices()
  const { data: projects } = useListPortfolioProjects()
  const { data: testimonials } = useListTestimonials()

  return (
    <PublicLayout>
      <Hero />
      <Capabilities services={services} />
      <SelectedWork projects={projects} />
      <SocialProof testimonial={testimonials?.[0]} />
      <Engagement />
      <HomeFAQ />
      <FinalCTA />
    </PublicLayout>
  )
}
