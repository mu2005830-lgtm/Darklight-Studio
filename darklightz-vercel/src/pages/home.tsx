import { useEffect, useRef } from "react"
import { Link } from "wouter"
import { ArrowRight, ArrowUpRight, Play, Star } from "lucide-react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { useListServices, useListPortfolioProjects, useListTestimonials } from "@/lib/api-client"
import { MagneticButton, MagneticLink, SilverDivider, Eyebrow, TextSliceReveal, TiltCard, AnimatedNumber } from "@/components/effects"

gsap.registerPlugin(ScrollTrigger)

function Hero() {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-text-line", {
        y: 120,
        opacity: 0,
        rotateZ: 2,
        duration: 1.4,
        stagger: 0.15,
        ease: "power4.out",
        delay: 0.1,
      })
      gsap.from(".hero-sub", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        delay: 0.8,
        ease: "power3.out",
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative min-h-[100dvh] flex flex-col justify-center items-center text-center overflow-hidden pt-28 pb-24 px-6">
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40">
        <motion.div
          className="absolute w-[60vw] h-[60vw] rounded-full bg-white/[0.02] blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[50vh] bg-gradient-to-b from-white/[0.05] to-transparent blur-3xl opacity-50" />
      </div>

      <div className="z-10 w-full max-w-6xl mx-auto flex flex-col items-center my-auto">
        <div className="mb-8 overflow-hidden">
          <div className="hero-text-line inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[9px] tracking-[0.25em] uppercase text-neutral-300 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" />
            Accepting Q3 Projects
          </div>
        </div>

        <h1 className="text-[10vw] md:text-7xl lg:text-[6.5rem] font-display font-bold tracking-tighter leading-[0.9] mb-8">
          <div className="overflow-hidden pb-3"><div className="hero-text-line origin-left">CRAFTING</div></div>
          <div className="overflow-hidden pb-3"><div className="hero-text-line text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-400 to-neutral-700">INEVITABLE</div></div>
          <div className="overflow-hidden pb-3"><div className="hero-text-line">FUTURES.</div></div>
        </h1>

        <p className="hero-sub text-base md:text-xl text-neutral-400 max-w-2xl mb-10 font-light leading-relaxed">
          Elite digital product design & engineering. We build with quiet confidence, zero fluff, and obsessive craft.
        </p>

        <div className="hero-sub flex flex-col sm:flex-row gap-6 items-center">
          <Link href="/book-a-call" data-testid="link-hero-start-project">
            <MagneticButton className="relative group overflow-hidden rounded-full bg-white text-black px-10 py-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold">
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Start a Project</span>
              <div className="absolute inset-0 bg-neutral-900 transform translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
            </MagneticButton>
          </Link>

          <Link href="/portfolio" data-testid="link-hero-view-work">
            <MagneticButton className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-white hover:text-neutral-300 transition-colors">
              View Our Work
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
                <Play className="w-3 h-3 ml-0.5 fill-current" />
              </div>
            </MagneticButton>
          </Link>
        </div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-3 text-neutral-500"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Scroll</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-neutral-500 to-transparent relative overflow-hidden">
          <motion.div
            className="absolute top-0 w-full h-1/2 bg-white"
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
    <section className="py-32 md:py-48 px-6 bg-[#030303] relative z-10" ref={containerRef}>
      <SilverDivider />

      <div className="max-w-7xl mx-auto pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          <div className="lg:col-span-5 relative">
            <div className="sticky top-40">
              <Eyebrow>Expertise</Eyebrow>
              <TextSliceReveal>
                <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter leading-[1.1] mb-8 text-neutral-300">
                  SYSTEMS THAT <br /> <span className="text-white">DRIVE</span> <br /> OUTCOMES.
                </h2>
              </TextSliceReveal>
              <p className="text-neutral-500 text-lg leading-relaxed max-w-sm mb-8">
                We handle the entire product lifecycle from blank canvas to production-ready scale. No handoffs, no lost translation.
              </p>
              <Link href="/services" className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 hover:text-white transition-colors" data-testid="link-capabilities-explore-all">
                Explore all services <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col border-t border-white/5 mt-10 lg:mt-0">
            {services?.slice(0, 3).map((service, i) => (
              <TiltCard key={service.id} className="group relative border-b border-white/5 py-12 md:py-16 hover:pl-10 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-12 md:items-baseline">
                  <span className="text-xs font-display font-bold tracking-[0.2em] text-neutral-600 group-hover:text-neutral-400 transition-colors">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex-1 pr-12 md:pr-0">
                    <h3 className="text-2xl md:text-4xl font-display font-medium tracking-tight mb-4 group-hover:text-white transition-colors text-neutral-300">{service.title}</h3>
                    <p className="text-neutral-500 text-base leading-relaxed max-w-md group-hover:text-neutral-400 transition-colors">
                      {service.summary}
                    </p>
                  </div>
                </div>

                <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 -translate-x-8 group-hover:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
              </TiltCard>
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
          y: 80,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        })
      })
    }, containerRef)
    return () => ctx.revert()
  }, [projects])

  return (
    <section ref={containerRef} className="py-32 md:py-48 px-6 bg-[#030303] relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div>
            <Eyebrow>Portfolio</Eyebrow>
            <TextSliceReveal>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tighter">
                SELECTED<br />
                <span className="text-neutral-600">ARCHIVE.</span>
              </h2>
            </TextSliceReveal>
          </div>
          <Link href="/portfolio" data-testid="link-selected-work-view-all">
            <MagneticButton className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 hover:text-white transition-colors pb-2 border-b border-white/20 hover:border-white">
              View All Work <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </MagneticButton>
          </Link>
        </div>

        <div className="flex flex-col gap-16 md:gap-40">
          {projects?.slice(0, 3).map((project) => (
            <Link key={project.id} href="/portfolio" className="work-card group relative cursor-pointer block w-full" data-testid={`link-work-${project.id}`}>
              <div className="relative aspect-[4/3] md:aspect-[21/9] overflow-hidden rounded-[2px] bg-neutral-900 border border-white/5">
                <div className="absolute inset-0 z-10 bg-black/40 group-hover:bg-black/10 transition-colors duration-700 pointer-events-none" />
                <img
                  src={project.imageUrl || `/placeholders/project${(project.id % 4) + 1}.jpg`}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)]"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-[0.2em] translate-y-12 group-hover:translate-y-0 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]">
                    Explore
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div>
                  <h3 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-2">{project.title}</h3>
                </div>
                <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400">
                  <span>{project.category}</span>
                  <span className="w-1 h-1 rounded-full bg-neutral-700" />
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
    <section className="py-32 md:py-48 px-6 bg-[#020202] relative overflow-hidden flex items-center justify-center border-y border-white/5">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[80vw] h-[80vw] bg-white/[0.015] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <div className="flex justify-center gap-2 mb-12">
          {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 text-white/30 fill-white/30" />)}
        </div>

        <h3 className="text-2xl md:text-4xl lg:text-5xl font-display font-medium leading-[1.4] text-neutral-500 mb-16 tracking-tight">
          "{testimonial.quote}"
        </h3>

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mb-6 border border-white/10 p-1">
            <div className="w-full h-full rounded-full overflow-hidden">
              <img src={testimonial.avatarUrl || `/testimonials/avatar1.jpg`} alt={testimonial.name} className="w-full h-full object-cover grayscale opacity-80" />
            </div>
          </div>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white mb-2">{testimonial.name}</p>
          <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-[0.2em]">{testimonial.role}, {testimonial.company}</p>
        </div>
      </div>
    </section>
  )
}

function Engagement() {
  return (
    <section className="py-32 md:py-48 px-6 bg-[#030303] relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 md:mb-32">
          <div className="flex justify-center items-center gap-4 mb-8">
            <span className="w-8 h-[1px] bg-neutral-600" />
            <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-neutral-500">Partnership</span>
            <span className="w-8 h-[1px] bg-neutral-600" />
          </div>
          <TextSliceReveal>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tighter mb-8">ENGAGEMENT.</h2>
          </TextSliceReveal>
          <p className="text-neutral-400 max-w-xl mx-auto text-lg leading-relaxed">
            We partner with a select number of clients each quarter to ensure uncompromising quality and focused attention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <TiltCard className="group relative p-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[2px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none" />
            <div className="relative h-full bg-[#050505] p-10 md:p-12 flex flex-col items-start rounded-[1px] z-10">
              <div className="px-4 py-1.5 bg-white/5 border border-white/10 text-white text-[9px] font-bold uppercase tracking-[0.25em] mb-8">Retainer</div>
              <h3 className="text-2xl md:text-4xl font-display font-medium mb-6">Growth Partner</h3>
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-12 flex-grow">
                Ongoing design, development, and strategic execution. Acting as your elite in-house digital team without the overhead.
              </p>
              <Link href="/pricing" className="w-full" data-testid="link-engagement-retainer">
                <MagneticButton className="w-full py-4 border border-white/20 text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-white hover:text-black transition-colors text-center">
                  View Engagement Models
                </MagneticButton>
              </Link>
            </div>
          </TiltCard>

          <TiltCard className="group relative p-[1px] bg-gradient-to-b from-white/20 to-transparent rounded-[2px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none" />
            <div className="relative h-full bg-[#080808] p-10 md:p-12 flex flex-col items-start rounded-[1px] z-10">
              <div className="px-4 py-1.5 bg-white text-black text-[9px] font-bold uppercase tracking-[0.25em] mb-8">Project</div>
              <h3 className="text-2xl md:text-4xl font-display font-medium mb-6">Dedicated Build</h3>
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-12 flex-grow">
                End-to-end delivery of a specific digital product, website, or campaign. Fixed scope, defined timeline, guaranteed excellence.
              </p>
              <Link href="/contact" className="w-full" data-testid="link-engagement-project">
                <MagneticButton className="w-full py-4 bg-white text-black text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-neutral-200 transition-colors text-center">
                  Start a Conversation
                </MagneticButton>
              </Link>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="py-32 md:py-48 px-6 bg-black relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <motion.div
          className="absolute w-[200%] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-25deg]"
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[200%] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[25deg]"
          animate={{ opacity: [0.4, 0.1, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <h2 className="text-4xl md:text-7xl lg:text-[7rem] font-display font-bold tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-700 leading-[0.9]">
          READY TO SHIFT <br /> THE PARADIGM?
        </h2>
        <p className="text-base md:text-xl text-neutral-400 mb-12 max-w-2xl mx-auto font-light">
          We are currently accepting new engagements. Let's discuss how we can elevate your digital presence.
        </p>
        <Link href="/book-a-call" data-testid="link-final-cta-book-call">
          <MagneticButton className="inline-flex h-16 px-10 md:h-20 md:px-14 bg-white text-black uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold items-center justify-center hover:bg-neutral-200 transition-colors rounded-full">
            Book Your Discovery Call
          </MagneticButton>
        </Link>
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
      <FinalCTA />
    </PublicLayout>
  )
}
