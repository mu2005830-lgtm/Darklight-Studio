import { PublicLayout } from "@/components/layout/PublicLayout"
import { useListCaseStudies } from "@/lib/api-client"
import { Link } from "wouter"
import { ArrowRight } from "lucide-react"
import { Eyebrow, TiltCard, FloatingOrbsBackground, BlurReveal } from "@/components/effects"

export default function CaseStudies() {
  const { data: caseStudies, isLoading } = useListCaseStudies()

  return (
    <PublicLayout>
      <div className="pt-40 pb-24 md:pb-32 relative min-h-[100dvh]">
        <FloatingOrbsBackground />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mb-24">
            <Eyebrow>Proof</Eyebrow>
            <BlurReveal>
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6">Case Studies.</h1>
            </BlurReveal>
            <BlurReveal delay={0.2}>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Deep dives into how we've solved complex problems and delivered measurable impact.
              </p>
            </BlurReveal>
          </div>

          <div className="space-y-32">
            {isLoading ? (
              <div className="py-20 text-muted-foreground/70">Loading case studies...</div>
            ) : (
              caseStudies?.map((study, i) => (
                <BlurReveal key={study.id} delay={i * 0.1}>
                  <div className={`flex flex-col ${i % 2 !== 0 ? "md:flex-row-reverse" : "md:flex-row"} gap-12 lg:gap-24 items-center group`}>
                    <div className="flex-1 w-full relative">
                      <Link href={`/case-studies/${study.slug}`} className="block relative h-full">
                        <TiltCard className="aspect-[4/3] overflow-hidden rounded-[2px] border border-border bg-card">
                          <img
                            src={study.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${study.id}`}
                            alt={study.title}
                            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                          />
                          <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500" />
                        </TiltCard>
                      </Link>
                    </div>

                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-4 mb-8">
                        <span className="text-[9px] font-display uppercase tracking-[0.25em] font-bold text-muted-foreground/70 border border-border rounded-full px-4 py-1.5">{study.client}</span>
                      </div>

                      <h2 className="text-4xl font-display font-bold tracking-tight mb-6 group-hover:text-foreground transition-colors">{study.title}</h2>
                      <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-lg">
                        {study.summary}
                      </p>

                      <div className="grid grid-cols-2 gap-8 mb-10 pb-10 border-b border-border">
                        <div>
                          <div className="text-3xl font-display font-bold text-white mb-2">{study.metricValue}</div>
                          <div className="text-[9px] font-display uppercase tracking-[0.25em] font-bold text-muted-foreground/70">{study.metricLabel}</div>
                        </div>
                      </div>

                      <Link href={`/case-studies/${study.slug}`} className="inline-flex items-center gap-2 text-[10px] font-display uppercase tracking-[0.2em] font-bold hover:text-muted-foreground transition-colors border-b border-white/40 hover:border-white pb-1">
                        Read Full Case Study <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </BlurReveal>
              ))
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
