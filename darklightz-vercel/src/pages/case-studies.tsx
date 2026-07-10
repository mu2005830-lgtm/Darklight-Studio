import { PublicLayout } from "@/components/layout/PublicLayout"
import { useListCaseStudies } from "@/lib/api-client"
import { motion } from "framer-motion"
import { Link } from "wouter"
import { ArrowRight } from "lucide-react"

export default function CaseStudies() {
  const { data: caseStudies, isLoading } = useListCaseStudies()

  return (
    <PublicLayout>
      <div className="pt-32 pb-20 bg-black min-h-[100dvh]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-24">
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">Case Studies.</h1>
            <p className="text-xl text-neutral-400 leading-relaxed">
              Deep dives into how we've solved complex problems and delivered measurable impact.
            </p>
          </div>

          <div className="space-y-32">
            {isLoading ? (
               <div className="py-20 text-neutral-500">Loading case studies...</div>
            ) : (
              caseStudies?.map((study, i) => (
                <motion.div 
                  key={study.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className={`flex flex-col ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 lg:gap-24 items-center group`}
                >
                  <div className="flex-1 w-full relative">
                    <Link href={`/case-studies/${study.slug}`} className="block aspect-[4/3] overflow-hidden border border-white/10 bg-[#050505]">
                      <img 
                        src={study.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${study.id}`} 
                        alt={study.title} 
                        className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                    </Link>
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-4 mb-8">
                      <span className="text-sm font-display uppercase tracking-widest text-neutral-500 border border-white/10 px-3 py-1">{study.client}</span>
                    </div>
                    
                    <h2 className="text-4xl font-display font-bold mb-6 group-hover:text-white transition-colors">{study.title}</h2>
                    <p className="text-neutral-400 text-lg leading-relaxed mb-10 max-w-lg">
                      {study.summary}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-8 mb-10 pb-10 border-b border-white/10">
                      <div>
                        <div className="text-3xl font-display font-bold text-white mb-2">{study.metricValue}</div>
                        <div className="text-xs font-display uppercase tracking-widest text-neutral-500">{study.metricLabel}</div>
                      </div>
                    </div>
                    
                    <Link href={`/case-studies/${study.slug}`} className="inline-flex items-center gap-2 border-b border-white pb-1 font-display uppercase tracking-widest text-sm font-semibold hover:text-neutral-300 hover:border-neutral-300 transition-colors">
                      Read Full Case Study <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
