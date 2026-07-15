import { PublicLayout } from "@/components/layout/PublicLayout"
import { useListServices } from "@/lib/api-client"
import { motion } from "framer-motion"
import { Eyebrow, TiltCard, AnimatedBorderSweep, SpotlightBackground, BlurReveal } from "@/components/effects"

const ServiceIcon = ({ index }: { index: number }) => {
  switch (index % 4) {
    case 0:
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-foreground">
          <path d="M12 2L2 22h20L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 10v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    case 1:
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-foreground">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    case 2:
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-foreground">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-foreground">
          <path d="M12 2l3 7 7 1-5 5 1.5 7-6.5-4-6.5 4 1.5-7-5-5 7-1 3-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      )
  }
}

export default function Services() {
  const { data: services, isLoading } = useListServices()

  return (
    <PublicLayout>
      <div className="pt-40 pb-24 md:pb-32 relative min-h-[100dvh]">
        <SpotlightBackground />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mb-24">
            <Eyebrow>Expertise</Eyebrow>
            <BlurReveal>
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6">Capabilities.</h1>
            </BlurReveal>
            <BlurReveal delay={0.2}>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We provide end-to-end design and engineering services. Zero handoffs, full accountability.
              </p>
            </BlurReveal>
          </div>

          <div className="flex flex-col gap-6">
            {isLoading ? (
              <div className="py-20 text-muted-foreground/70">Loading services...</div>
            ) : (
              services?.map((service, i) => (
                <BlurReveal key={service.id} delay={i * 0.1}>
                  <TiltCard className="group relative border border-border bg-card/60 backdrop-blur-md p-8 md:p-14 rounded-[2px] transition-all duration-500 hover:border-border">
                    <AnimatedBorderSweep />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-inherit" />

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
                      <div className="md:col-span-4 flex flex-col h-full">
                        <span className="text-xs font-display font-bold tracking-[0.2em] text-muted-foreground/50 group-hover:text-muted-foreground transition-colors block mb-6">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="w-12 h-12 mb-8 rounded-full border border-border flex items-center justify-center bg-muted/30 backdrop-blur-sm">
                          <ServiceIcon index={i} />
                        </div>
                        <h2 className="text-3xl font-display font-bold group-hover:text-foreground transition-colors">{service.title}</h2>
                      </div>

                      <div className="md:col-span-8 flex flex-col justify-center">
                        <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                          {service.summary}
                        </p>
                        <p className="text-muted-foreground/70 leading-relaxed max-w-2xl">
                          {service.description}
                        </p>

                        <div className="mt-8 pt-8 border-t border-border">
                          <h4 className="text-[9px] font-display uppercase tracking-[0.25em] text-muted-foreground/70 mb-4 font-bold">Included Outcomes</h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-white" /> Technical Architecture</li>
                            <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-white" /> Production Codebase</li>
                            <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-white" /> Design System</li>
                            <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-white" /> CI/CD Pipeline</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </BlurReveal>
              ))
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
