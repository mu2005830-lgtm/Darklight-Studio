import { PublicLayout } from "@/components/layout/PublicLayout"
import { useListServices } from "@/lib/api-client"
import { motion } from "framer-motion"
import { Eyebrow } from "@/components/effects"

export default function Services() {
  const { data: services, isLoading } = useListServices()

  return (
    <PublicLayout>
      <div className="pt-40 pb-24 md:pb-32 bg-[#030303] min-h-[100dvh]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-24">
            <Eyebrow>Expertise</Eyebrow>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6">Capabilities.</h1>
            <p className="text-xl text-neutral-400 leading-relaxed">
              We provide end-to-end design and engineering services. Zero handoffs, full accountability.
            </p>
          </div>

          <div className="flex flex-col border-t border-white/5">
            {isLoading ? (
              <div className="py-20 text-neutral-500">Loading services...</div>
            ) : (
              services?.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.6 }}
                  className="group relative border-b border-white/5 py-14 md:py-20 hover:pl-6 md:hover:pl-10 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
                    <div className="md:col-span-4">
                      <span className="text-xs font-display font-bold tracking-[0.2em] text-neutral-600 group-hover:text-neutral-400 transition-colors block mb-6">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-3xl font-display font-bold mb-2 group-hover:text-white transition-colors">{service.title}</h2>
                    </div>

                    <div className="md:col-span-8 flex flex-col justify-center">
                      <p className="text-xl text-neutral-300 mb-6 leading-relaxed">
                        {service.summary}
                      </p>
                      <p className="text-neutral-500 leading-relaxed max-w-2xl">
                        {service.description}
                      </p>

                      <div className="mt-8 pt-8 border-t border-white/10">
                        <h4 className="text-[9px] font-display uppercase tracking-[0.25em] text-neutral-500 mb-4 font-bold">Included Outcomes</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-neutral-400">
                          <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-white" /> Technical Architecture</li>
                          <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-white" /> Production Codebase</li>
                          <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-white" /> Design System</li>
                          <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-white" /> CI/CD Pipeline</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]">
                    <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm text-2xl font-display font-bold">
                      {service.icon || "✦"}
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
