import { Link } from "wouter"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { SignatureBeam } from "@/components/SignatureBeam"
import { useListServices, useListPortfolioProjects, useListTestimonials } from "@/lib/api-client"
const heroBg = `${import.meta.env.BASE_URL}hero-bg.png`

export default function Home() {
  const { data: services } = useListServices()
  const { data: projects } = useListPortfolioProjects()
  const { data: testimonials } = useListTestimonials()

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden">
        {/* Abstract Background slightly visible */}
        <div className="absolute inset-0 z-0 opacity-10" style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-0" />
        
        <div className="container mx-auto px-6 relative z-10 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 mb-8 uppercase tracking-widest text-[10px] font-display">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  Accepting Q3 Projects
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance leading-[1.1]">
                  Software that feels <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-300 to-neutral-600">inevitable.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-neutral-400 max-w-lg mb-10 leading-relaxed">
                  We are an elite digital product design and engineering studio. We build with quiet confidence, zero fluff, and obsessive craft.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/book-a-call" className="h-14 px-8 bg-white text-black font-display uppercase tracking-wider text-sm font-semibold flex items-center justify-center hover:bg-neutral-200 transition-colors">
                    Start a project
                  </Link>
                  <Link href="/portfolio" className="h-14 px-8 border border-white/20 text-white font-display uppercase tracking-wider text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
                    View our work <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
            
            <div className="hidden lg:flex justify-center">
              <SignatureBeam />
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="beam-divider" />

      {/* Stats Section */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-y border-white/5 py-16">
            {[
              { label: "Products Shipped", value: "140+" },
              { label: "Design Awards", value: "24" },
              { label: "Client Valuation", value: "$2B+" },
              { label: "Global Reach", value: "16 Countries" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center sm:text-left"
              >
                <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm font-display uppercase tracking-widest text-neutral-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-black">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Capabilities.</h2>
              <p className="text-neutral-400 text-lg leading-relaxed">
                We handle the entire product lifecycle from blank canvas to production-ready scale. No handoffs, no lost translation.
              </p>
            </div>
            <Link href="/services" className="group flex items-center gap-2 text-white font-medium uppercase tracking-wider text-sm font-display hover:text-neutral-300 transition-colors">
              Explore all services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services?.slice(0, 3).map((service, i) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group p-8 border border-white/10 bg-[#050505] hover:bg-[#0a0a0a] transition-colors"
              >
                <div className="w-12 h-12 mb-8 bg-white/5 flex items-center justify-center text-white">
                  <span className="font-display font-bold text-xl">{service.icon || '✦'}</span>
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">{service.title}</h3>
                <p className="text-neutral-400 leading-relaxed">
                  {service.summary}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-32 bg-[#050505]">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-16">Selected Work.</h2>
          
          <div className="space-y-32">
            {projects?.slice(0, 3).map((project, i) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 lg:gap-24 items-center`}
              >
                <div className="flex-1 w-full relative group">
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay" />
                  <img 
                    src={project.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${project.id}`} 
                    alt={project.title} 
                    className="w-full aspect-[4/3] object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                  />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex gap-3 mb-6">
                    {project.tags.slice(0,2).map(tag => (
                      <span key={tag} className="px-3 py-1 border border-white/10 text-xs font-display tracking-wider uppercase text-neutral-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-4xl font-display font-bold mb-6">{project.title}</h3>
                  <p className="text-neutral-400 text-lg leading-relaxed mb-8 max-w-md">
                    {project.summary}
                  </p>
                  <Link href={`/portfolio`} className="inline-flex items-center gap-2 border-b border-white pb-1 font-display uppercase tracking-widest text-sm font-semibold hover:text-neutral-300 hover:border-neutral-300 transition-colors">
                    View Project <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-32 flex justify-center">
             <Link href="/portfolio" className="h-14 px-12 border border-white/20 text-white font-display uppercase tracking-wider text-sm font-semibold flex items-center justify-center hover:bg-white hover:text-black transition-all">
                View All Projects
              </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black border-y border-white/10 relative overflow-hidden">
        {/* Subtle beam crossing background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute w-[200%] h-[1px] bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg]" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-8">Ready to build?</h2>
          <p className="text-xl text-neutral-400 mb-12">
            Let's discuss how we can bring your next product to life with precision and craft.
          </p>
          <Link href="/book-a-call" className="inline-flex h-16 px-12 bg-white text-black font-display uppercase tracking-widest text-sm font-bold items-center justify-center hover:scale-[1.02] transition-transform active:scale-[0.98]">
            Schedule a Consultation
          </Link>
        </div>
      </section>
    </PublicLayout>
  )
}
