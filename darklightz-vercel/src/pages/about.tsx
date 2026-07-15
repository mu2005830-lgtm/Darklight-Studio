import { PublicLayout } from "@/components/layout/PublicLayout"
import { motion, useScroll, useTransform } from "framer-motion"
import { SilverDivider, FloatingOrbsBackground, BlurReveal } from "@/components/effects"
import { useRef } from "react"

const TimelineItem = ({ year, title, desc, i }: { year: string, title: string, desc: string, i: number }) => {
  return (
    <BlurReveal delay={i * 0.15} className="relative pl-8 md:pl-0">
      <div className="md:grid md:grid-cols-5 md:gap-8 items-start relative">
        <div className="hidden md:flex flex-col items-end col-span-2 text-right pt-1">
          <span className="text-sm font-mono text-muted-foreground/70 mb-1">{year}</span>
          <h3 className="text-xl font-display font-bold text-white">{title}</h3>
        </div>
        
        <div className="absolute left-[-5px] md:relative md:left-auto md:col-span-1 flex justify-center h-full">
          <div className="w-[1px] h-full bg-muted/50 absolute top-0" />
          <motion.div 
            initial={{ scale: 0, backgroundColor: "rgba(255,255,255,0.2)" }}
            whileInView={{ scale: 1, backgroundColor: "rgba(255,255,255,1)" }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ duration: 0.5, delay: i * 0.15 + 0.2 }}
            className="w-2.5 h-2.5 rounded-full z-10 mt-2.5 relative shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          />
        </div>
        
        <div className="md:col-span-2 pb-16">
          <div className="md:hidden mb-2">
            <span className="text-sm font-mono text-muted-foreground/70 mr-3">{year}</span>
            <h3 className="text-xl font-display font-bold text-white inline">{title}</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed text-base">
            {desc}
          </p>
        </div>
      </div>
    </BlurReveal>
  )
}

export default function About() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] })
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

  return (
    <PublicLayout>
      <div className="pt-40 pb-24 md:pb-32 relative min-h-[100dvh]">
        <FloatingOrbsBackground />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl mb-32">
            <motion.h1
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-8xl font-display font-bold tracking-tighter mb-8 leading-[1.05]"
            >
              We don't build MVP.<br />
              <span className="text-muted-foreground/50">We build MMP.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-2xl text-muted-foreground leading-relaxed"
            >
              Minimum <span className="text-white">Magnificent</span> Product.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32 mb-40">
            <div ref={containerRef} className="overflow-hidden rounded-[2px]">
              <motion.div style={{ y: imageY }} className="aspect-[3/4] bg-neutral-900 border border-border h-[120%] -mt-[10%]">
                <img
                  src="/images/about-team-abstract.jpg"
                  alt="Studio vibe"
                  className="w-full h-full object-cover grayscale opacity-80 mix-blend-luminosity"
                  onError={(e) => {
                    // Fallback if image not generated yet
                    e.currentTarget.src = "https://images.unsplash.com/photo-1600508513693-8a301ec9c704?q=80&w=2070&auto=format&fit=crop"
                  }}
                />
              </motion.div>
            </div>

            <div className="flex flex-col justify-center">
              <BlurReveal>
                <h2 className="text-3xl font-display font-bold tracking-tight mb-8">The Studio Story</h2>
              </BlurReveal>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <BlurReveal delay={0.1}>
                  <p>
                    Darklightz was founded on a simple premise: most software is aggressively mediocre. The industry standard has drifted toward bloated templates, slow load times, and disjointed experiences.
                  </p>
                </BlurReveal>
                <BlurReveal delay={0.2}>
                  <p>
                    We exist to counter that. We are a tight-knit collective of senior designers and engineers who have spent the last decade building core products for leading tech companies.
                  </p>
                </BlurReveal>
                <BlurReveal delay={0.3}>
                  <p>
                    When you hire us, you aren't handed off to junior associates. You work directly with the principals. We embed in your vision, strip away the excess, and deliver products that feel undeniably premium.
                  </p>
                </BlurReveal>
              </div>
            </div>
          </div>

          <div className="mb-40 pt-10 border-t border-border">
            <div className="flex justify-center items-center gap-4 mb-16">
              <span className="w-8 h-[1px] bg-neutral-600" />
              <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-muted-foreground/70">Timeline</span>
              <span className="w-8 h-[1px] bg-neutral-600" />
            </div>
            
            <BlurReveal>
              <h2 className="text-4xl font-display font-bold tracking-tighter mb-20 text-center">Milestones.</h2>
            </BlurReveal>
            
            <div className="max-w-4xl mx-auto">
              {[
                { year: "2018", title: "Foundation", desc: "Darklightz began as a small boutique consultancy in San Francisco, focused strictly on high-performance web applications." },
                { year: "2020", title: "The Pivot to Premium", desc: "We ceased all template-based work, committing entirely to bespoke, engineered-from-scratch digital products." },
                { year: "2021", title: "International Scale", desc: "Expanded our distributed core team across three continents, maintaining our zero-handoff philosophy." },
                { year: "2023", title: "Enterprise Systems", desc: "Shipped core design systems and frontends for three Fortune 500 tech clients." },
                { year: "2024", title: "Cinematic Precision", desc: "Launched our new aesthetic paradigm, merging high-performance engineering with cinematic motion design." }
              ].map((item, i) => (
                <TimelineItem key={i} i={i} year={item.year} title={item.title} desc={item.desc} />
              ))}
            </div>
          </div>

          <div className="pt-24">
            <SilverDivider />
            <div className="pt-24">
              <BlurReveal>
                <div className="flex justify-center items-center gap-4 mb-16">
                  <span className="w-8 h-[1px] bg-neutral-600" />
                  <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-muted-foreground/70">Principles</span>
                  <span className="w-8 h-[1px] bg-neutral-600" />
                </div>
                <h2 className="text-4xl font-display font-bold tracking-tighter mb-16 text-center">Core Principles.</h2>
              </BlurReveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    num: "01",
                    title: "Ruthless Subtraction",
                    desc: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away. We eliminate the unnecessary.",
                  },
                  {
                    num: "02",
                    title: "Motion as Meaning",
                    desc: "Animation is not decoration. It is context, hierarchy, and spatial understanding. We engineer motion at 60fps.",
                  },
                  {
                    num: "03",
                    title: "Code is Design",
                    desc: "The boundary between design and engineering is artificial. We design in code, ensuring what you approve is exactly what ships.",
                  },
                ].map((principle, i) => (
                  <BlurReveal delay={i * 0.1} key={principle.num}>
                    <div className="p-8 border border-border bg-card/60 backdrop-blur-sm rounded-[2px] hover:border-white/30 transition-colors h-full">
                      <div className="text-muted-foreground/50 font-mono text-xl mb-6">{principle.num}</div>
                      <h3 className="text-2xl font-display font-bold mb-4">{principle.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{principle.desc}</p>
                    </div>
                  </BlurReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
