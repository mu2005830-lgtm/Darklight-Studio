import { useParams, Link } from "wouter"
import { useGetBlogPost } from "@/lib/api-client"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { ArrowLeft } from "lucide-react"
import { format } from "date-fns"

export default function BlogPostDetail() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug || ""
  
  const { data: post, isLoading, isError } = useGetBlogPost(slug, {
    query: {
      enabled: !!slug,
      queryKey: ["getBlogPost", slug]
    }
  })

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-[100dvh] flex items-center justify-center bg-black">
          <div className="text-neutral-500">Loading journal...</div>
        </div>
      </PublicLayout>
    )
  }

  if (isError || !post) {
    return (
      <PublicLayout>
        <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-black">
          <div className="text-xl mb-4">Post not found</div>
          <Link href="/blog" className="text-white underline">Back to journal</Link>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <article className="pt-32 pb-32 bg-black min-h-[100dvh]">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors mb-12 font-display uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>
          
          <header className="mb-16">
            <div className="flex items-center gap-4 text-sm font-mono text-neutral-500 mb-6">
              <span>{format(new Date(post.publishedAt), 'MMMM dd, yyyy')}</span>
              <span>•</span>
              <span className="uppercase tracking-widest">{post.category}</span>
              <span>•</span>
              <span>By {post.author}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-[1.1] text-white">
              {post.title}
            </h1>
          </header>

          <div className="w-full aspect-[21/9] bg-neutral-900 border border-white/10 mb-16">
            <img 
              src={post.coverImageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${post.id}`} 
              alt={post.title} 
              className="w-full h-full object-cover grayscale opacity-90"
            />
          </div>

          <div className="prose prose-invert prose-lg max-w-3xl mx-auto">
            {/* Split content by double newline to simulate paragraphs since we receive raw string */}
            {post.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-neutral-300 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>
          
          <div className="mt-24 pt-12 border-t border-white/10 text-center">
            <p className="text-neutral-400 mb-6 font-display">Enjoyed this reading?</p>
            <Link href="/blog" className="inline-flex h-12 px-8 border border-white/20 text-white font-display uppercase tracking-widest text-xs font-semibold items-center justify-center hover:bg-white/5 transition-colors">
              More Articles
            </Link>
          </div>
        </div>
      </article>
    </PublicLayout>
  )
}
