import { useState } from "react"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { useListPortfolioProjects } from "@/lib/api-client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, X } from "lucide-react"
import { Eyebrow, TiltCard, MetallicTextureBackground, BlurReveal } from "@/components/effects"

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<string | undefined>()
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

  const { data: projects, isLoading } = useListPortfolioProjects(
    activeCategory ? { category: activeCategory } : undefined
  )

  const selectedProject = projects?.find((p) => p.id === selectedProjectId)

  const categories = ["Product Design", "Brand Identity", "Web Engineering"]

  return (
    <PublicLayout>
      <div className="pt-40 pb-24 md:pb-32 relative min-h-[100dvh]">
        <MetallicTextureBackground />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mb-20">
            <Eyebrow>Portfolio</Eyebrow>
            <BlurReveal>
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6">Our Work.</h1>
            </BlurReveal>
            <BlurReveal delay={0.2}>
              <p className="text-xl text-muted-foreground leading-relaxed">
                A selection of digital products and platforms we've built for ambitious teams around the globe.
              </p>
            </BlurReveal>
          </div>

          <BlurReveal delay={0.3}>
            <div className="flex flex-wrap gap-3 mb-16">
              <button
                onClick={() => setActiveCategory(undefined)}
                className={`px-6 py-2.5 rounded-full font-display uppercase tracking-[0.15em] text-[10px] font-bold transition-colors border ${
                  !activeCategory
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-foreground border-border hover:border-foreground/30"
                }`}
              >
                All Work
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full font-display uppercase tracking-[0.15em] text-[10px] font-bold transition-colors border ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-foreground border-border hover:border-foreground/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </BlurReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {projects?.map((project, i) => (
                <motion.div
                  layout
                  layoutId={`project-container-${project.id}`}
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  key={project.id}
                  className="cursor-pointer block relative h-full"
                  onClick={() => setSelectedProjectId(project.id)}
                >
                  <TiltCard className="group h-full bg-card/60 backdrop-blur-sm border border-border rounded-[4px] p-4 flex flex-col hover:border-border transition-colors">
                    <motion.div layoutId={`project-image-${project.id}`} className="aspect-[4/3] overflow-hidden mb-6 relative bg-muted/30 rounded-[2px]">
                      <motion.img
                        src={project.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${project.id}`}
                        alt={project.title}
                        className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-card/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-muted/50 backdrop-blur border border-border flex items-center justify-center text-foreground transform scale-50 group-hover:scale-100 transition-transform duration-500">
                          <ArrowUpRight className="w-5 h-5" />
                        </div>
                      </div>
                    </motion.div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <motion.h3 layoutId={`project-title-${project.id}`} className="text-2xl font-display font-bold">{project.title}</motion.h3>
                        <span className="text-sm text-muted-foreground/70 font-mono">{project.year}</span>
                      </div>
                      <p className="text-muted-foreground text-sm">{project.category}</p>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <div className="col-span-full py-20 text-center text-muted-foreground/70">
                Loading projects...
              </div>
            )}
            {!isLoading && projects?.length === 0 && (
              <div className="col-span-full py-20 text-center text-muted-foreground/70">
                No projects found in this category.
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <Dialog open={!!selectedProjectId} onOpenChange={(open) => !open && setSelectedProjectId(null)}>
            <DialogContent className="max-w-4xl bg-transparent border-none p-0 overflow-visible shadow-none pointer-events-none" hideClose>
              <div className="fixed inset-0 z-[-1] bg-black/80 backdrop-blur-md pointer-events-auto" onClick={() => setSelectedProjectId(null)} />
              
              <motion.div 
                layoutId={`project-container-${selectedProject.id}`}
                className="bg-background border border-border overflow-hidden rounded-[4px] pointer-events-auto shadow-2xl"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <motion.img
                    layoutId={`project-image-${selectedProject.id}`}
                    src={selectedProject.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${selectedProject.id}`}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={() => setSelectedProjectId(null)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:bg-foreground/10 transition-colors z-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-8 md:p-12">
                  <DialogHeader className="mb-8">
                    <div className="flex justify-between items-start mb-6">
                      <motion.div layoutId={`project-title-${selectedProject.id}`}>
                        <DialogTitle className="text-4xl md:text-5xl font-display font-bold text-foreground">{selectedProject.title}</DialogTitle>
                      </motion.div>
                      <span className="text-sm border border-border rounded-full px-4 py-1.5 font-mono text-muted-foreground">{selectedProject.year}</span>
                    </div>
                    <DialogDescription className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                      {selectedProject.summary}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-wrap gap-3 mt-10 border-t border-border pt-10">
                    <span className="text-xs text-muted-foreground/70 mr-4 self-center font-display uppercase tracking-[0.2em] font-bold">Technologies</span>
                    {selectedProject.tags.map((tag, idx) => (
                      <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + (idx * 0.05) }}
                        key={tag} 
                        className="px-4 py-1.5 bg-muted/30 border border-border rounded-full text-xs font-mono text-muted-foreground"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </PublicLayout>
  )
}
