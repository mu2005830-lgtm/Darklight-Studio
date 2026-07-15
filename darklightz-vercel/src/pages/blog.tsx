import { PublicLayout } from "@/components/layout/PublicLayout"
import { useListBlogPosts } from "@/lib/api-client"
import { Link } from "wouter"
import { format } from "date-fns"
import { ArrowRight } from "lucide-react"
import { Eyebrow, TiltCard, MetallicTextureBackground, BlurReveal } from "@/components/effects"

export default function Blog() {
  const { data: posts, isLoading } = useListBlogPosts()

  return (
    <PublicLayout>
      <div className="pt-40 pb-24 md:pb-32 relative min-h-[100dvh]">
        <MetallicTextureBackground />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mb-24">
            <Eyebrow>Journal</Eyebrow>
            <BlurReveal>
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6">Journal.</h1>
            </BlurReveal>
            <BlurReveal delay={0.2}>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Thoughts on design, engineering, and the craft of digital products.
              </p>
            </BlurReveal>
          </div>

          {isLoading ? (
            <div className="text-muted-foreground/70 py-20">Loading journal...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts?.map((post, i) => (
                <BlurReveal key={post.id} delay={i * 0.1}>
                  <TiltCard className="group flex flex-col h-full border border-border bg-card/60 backdrop-blur-md rounded-[2px] hover:border-border transition-colors">
                    <Link href={`/blog/${post.slug}`} className="block aspect-[16/9] overflow-hidden bg-neutral-900 border-b border-border relative">
                      <img
                        src={post.coverImageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${post.id}`}
                        alt={post.title}
                        className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500" />
                    </Link>
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground/70 mb-4">
                        <span>{format(new Date(post.publishedAt), "MMM dd, yyyy")}</span>
                        <span>•</span>
                        <span className="uppercase tracking-widest">{post.category}</span>
                      </div>

                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-2xl font-display font-bold mb-4 group-hover:text-foreground text-neutral-100 transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                      </Link>

                      <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-[10px] font-display uppercase tracking-[0.2em] font-bold text-white hover:text-muted-foreground transition-colors mt-auto">
                        Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </TiltCard>
                </BlurReveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}
