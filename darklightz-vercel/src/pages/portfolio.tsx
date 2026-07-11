import { useState } from "react"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { useListPortfolioProjects } from "@/lib/api-client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Eyebrow } from "@/components/effects"

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
      <div className="pt-40 pb-24 md:pb-32 bg-[#030303]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-20">
            <Eyebrow>Portfolio</Eyebrow>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6">Our Work.</h1>
            <p className="text-xl text-neutral-400 leading-relaxed">
              A selection of digital products and platforms we've built for ambitious teams around the globe.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mb-16">
            <button
              onClick={() => setActiveCategory(undefined)}
              className={`px-6 py-2.5 rounded-full font-display uppercase tracking-[0.15em] text-[10px] font-bold transition-colors border ${
                !activeCategory
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white border-white/15 hover:border-white/40"
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
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white border-white/15 hover:border-white/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {projects?.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  key={project.id}
                  className="group cursor-pointer block relative"
                  onClick={() => setSelectedProjectId(project.id)}
                >
                  <div className="aspect-[4/3] overflow-hidden mb-6 relative bg-white/5 border border-white/5 rounded-[2px]">
                    <img
                      src={project.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${project.id}`}
                      alt={project.title}
                      className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-display font-bold">{project.title}</h3>
                      <span className="text-sm text-neutral-500 font-mono">{project.year}</span>
                    </div>
                    <p className="text-neutral-400 text-sm">{project.category}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <div className="col-span-full py-20 text-center text-neutral-500">
                Loading projects...
              </div>
            )}
            {!isLoading && projects?.length === 0 && (
              <div className="col-span-full py-20 text-center text-neutral-500">
                No projects found in this category.
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedProjectId} onOpenChange={(open) => !open && setSelectedProjectId(null)}>
        <DialogContent className="max-w-3xl bg-[#0a0a0a] border-white/10 p-0 overflow-hidden gap-0 rounded-[2px]">
          {selectedProject && (
            <>
              <div className="aspect-video w-full relative">
                <img
                  src={selectedProject.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${selectedProject.id}`}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div className="p-8">
                <DialogHeader className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <DialogTitle className="text-3xl font-display font-bold text-white">{selectedProject.title}</DialogTitle>
                    <span className="text-sm border border-white/20 rounded-full px-3 py-1 font-mono text-neutral-400">{selectedProject.year}</span>
                  </div>
                  <DialogDescription className="text-lg text-neutral-400 leading-relaxed">
                    {selectedProject.summary}
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-wrap gap-2 mt-8 border-t border-white/10 pt-8">
                  <span className="text-sm text-neutral-500 mr-4 self-center font-display uppercase tracking-widest">Technologies</span>
                  {selectedProject.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-neutral-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PublicLayout>
  )
}
