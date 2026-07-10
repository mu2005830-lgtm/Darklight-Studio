import { PublicLayout } from "@/components/layout/PublicLayout"
import { useListServices } from "@/lib/api-client"
import { motion } from "framer-motion"

export default function Services() {
  const { data: services, isLoading } = useListServices()

  return (
    <PublicLayout>
      <div className="pt-32 pb-20 bg-black min-h-[100dvh]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-24">
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">Capabilities.</h1>
            <p className="text-xl text-neutral-400 leading-relaxed">
              We provide end-to-end design and engineering services. Zero handoffs, full accountability.
            </p>
          </div>

          <div className="space-y-12">
            {isLoading ? (
               <div className="py-20 text-neutral-500">Loading services...</div>
            ) : (
              services?.map((service, i) => (
                <motion.div 
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="group relative border border-white/10 bg-[#050505] p-8 md:p-12 hover:border-white/30 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
                    <div className="md:col-span-4">
                      <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center text-white mb-8">
                        <span className="font-display font-bold text-2xl">{service.icon || '✦'}</span>
                      </div>
                      <h2 className="text-3xl font-display font-bold mb-4">{service.title}</h2>
                    </div>
                    
                    <div className="md:col-span-8 flex flex-col justify-center">
                      <p className="text-xl text-neutral-300 mb-6 leading-relaxed">
                        {service.summary}
                      </p>
                      <p className="text-neutral-500 leading-relaxed max-w-2xl">
                        {service.description}
                      </p>
                      
                      <div className="mt-8 pt-8 border-t border-white/10">
                        <h4 className="text-sm font-display uppercase tracking-widest text-white mb-4">Included Outcomes</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-neutral-400">
                          <li className="flex items-center gap-2"><span className="w-1 h-1 bg-white" /> Technical Architecture</li>
                          <li className="flex items-center gap-2"><span className="w-1 h-1 bg-white" /> Production Codebase</li>
                          <li className="flex items-center gap-2"><span className="w-1 h-1 bg-white" /> Design System</li>
                          <li className="flex items-center gap-2"><span className="w-1 h-1 bg-white" /> CI/CD Pipeline</li>
                        </ul>
                      </div>
                    </div>
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
