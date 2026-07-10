import { useParams, Link } from "wouter"
import { useGetCaseStudy } from "@/lib/api-client"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { ArrowLeft } from "lucide-react"

export default function CaseStudyDetail() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug || ""
  
  const { data: study, isLoading, isError } = useGetCaseStudy(slug, {
    query: {
      enabled: !!slug,
      queryKey: ["getCaseStudy", slug]
    }
  })

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-[100dvh] flex items-center justify-center">
          <div className="text-neutral-500">Loading case study...</div>
        </div>
      </PublicLayout>
    )
  }

  if (isError || !study) {
    return (
      <PublicLayout>
        <div className="min-h-[100dvh] flex flex-col items-center justify-center">
          <div className="text-xl mb-4">Case study not found</div>
          <Link href="/case-studies" className="text-white underline">Back to case studies</Link>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <article className="pt-32 pb-20 bg-black min-h-[100dvh]">
        <div className="container mx-auto px-6">
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors mb-12 font-display uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          
          <header className="max-w-4xl mb-16">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-display uppercase tracking-widest text-neutral-500 border border-white/10 px-3 py-1">{study.client}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-[1.1]">{study.title}</h1>
            <p className="text-2xl text-neutral-400 leading-relaxed">
              {study.summary}
            </p>
          </header>

          <div className="w-full aspect-[21/9] bg-neutral-900 border border-white/10 mb-20">
            <img 
              src={study.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${study.id}`} 
              alt={study.title} 
              className="w-full h-full object-cover grayscale opacity-90"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24">
            <div className="md:col-span-4">
              <div className="sticky top-32 p-8 border border-white/10 bg-[#050505]">
                <div className="text-sm font-display uppercase tracking-widest text-neutral-500 mb-2">Key Metric</div>
                <div className="text-5xl font-display font-bold text-white mb-2">{study.metricValue}</div>
                <div className="text-sm text-neutral-400 leading-tight">{study.metricLabel}</div>
              </div>
            </div>
            
            <div className="md:col-span-8 prose prose-invert prose-lg max-w-none">
              <h2 className="font-display font-bold text-3xl">The Challenge</h2>
              <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">{study.challenge}</p>
              
              <div className="h-px w-full bg-white/10 my-12" />
              
              <h2 className="font-display font-bold text-3xl">Our Solution</h2>
              <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">{study.solution}</p>
              
              <div className="h-px w-full bg-white/10 my-12" />
              
              <h2 className="font-display font-bold text-3xl">The Result</h2>
              <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">{study.result}</p>
            </div>
          </div>
        </div>
      </article>
      
      <section className="py-24 bg-[#050505] border-t border-white/10 text-center">
        <h2 className="text-4xl font-display font-bold mb-8">Ready for similar results?</h2>
        <Link href="/book-a-call" className="inline-flex h-14 px-10 bg-white text-black font-display uppercase tracking-widest text-sm font-bold items-center justify-center hover:scale-[1.02] transition-transform">
          Start a conversation
        </Link>
      </section>
    </PublicLayout>
  )
}
