import { useParams, Link } from "wouter"
import { useGetCaseStudy } from "@/lib/api-client"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { ArrowLeft } from "lucide-react"
import { MagneticButton } from "@/components/effects"

export default function CaseStudyDetail() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug || ""

  const { data: study, isLoading, isError } = useGetCaseStudy(slug, {
    query: {
      enabled: !!slug,
      queryKey: ["getCaseStudy", slug],
    },
  })

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-[100dvh] flex items-center justify-center bg-[#030303]">
          <div className="text-neutral-500">Loading case study...</div>
        </div>
      </PublicLayout>
    )
  }

  if (isError || !study) {
    return (
      <PublicLayout>
        <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#030303]">
          <div className="text-xl mb-4">Case study not found</div>
          <Link href="/case-studies" className="text-white underline">Back to case studies</Link>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <article className="pt-40 pb-24 bg-[#030303] min-h-[100dvh]">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-[10px] text-neutral-500 hover:text-white transition-colors mb-12 font-display uppercase tracking-[0.2em] font-bold">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <header className="max-w-4xl mb-16">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[9px] font-display uppercase tracking-[0.25em] font-bold text-neutral-500 border border-white/10 rounded-full px-4 py-1.5">{study.client}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-8 leading-[1.05]">{study.title}</h1>
            <p className="text-2xl text-neutral-400 leading-relaxed">
              {study.summary}
            </p>
          </header>

          <div className="w-full aspect-[21/9] bg-neutral-900 border border-white/5 rounded-[2px] mb-20">
            <img
              src={study.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${study.id}`}
              alt={study.title}
              className="w-full h-full object-cover grayscale opacity-90"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24">
            <div className="md:col-span-4">
              <div className="sticky top-32 p-8 border border-white/10 bg-[#050505] rounded-[2px]">
                <div className="text-[9px] font-display uppercase tracking-[0.25em] font-bold text-neutral-500 mb-2">Key Metric</div>
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

      <section className="py-24 md:py-32 bg-[#020202] border-t border-white/5 text-center px-6">
        <h2 className="text-4xl font-display font-bold tracking-tighter mb-8">Ready for similar results?</h2>
        <Link href="/book-a-call">
          <MagneticButton className="inline-flex h-14 px-10 bg-white text-black font-display uppercase tracking-widest text-sm font-bold items-center justify-center hover:bg-neutral-200 transition-colors rounded-full">
            Start a conversation
          </MagneticButton>
        </Link>
      </section>
    </PublicLayout>
  )
}
