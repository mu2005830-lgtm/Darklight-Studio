import { PublicLayout } from "@/components/layout/PublicLayout"
import { motion } from "framer-motion"
import { SilverDivider } from "@/components/effects"

export default function About() {
  return (
    <PublicLayout>
      <div className="pt-40 pb-24 md:pb-32 bg-[#030303] min-h-[100dvh]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mb-32">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-display font-bold tracking-tighter mb-8 leading-[1.05]"
            >
              We don't build MVP.<br />
              <span className="text-neutral-600">We build MMP.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl text-neutral-400 leading-relaxed"
            >
              Minimum <span className="text-white">Magnificent</span> Product.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32 mb-32">
            <div>
              <div className="aspect-[3/4] bg-neutral-900 border border-white/5 rounded-[2px]">
                <img
                  src="https://images.unsplash.com/photo-1600508513693-8a301ec9c704?q=80&w=2070&auto=format&fit=crop"
                  alt="Studio vibe"
                  className="w-full h-full object-cover grayscale opacity-60"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-display font-bold tracking-tight mb-8">The Studio Story</h2>
              <div className="space-y-6 text-lg text-neutral-400 leading-relaxed">
                <p>
                  Darklightz was founded on a simple premise: most software is aggressively mediocre. The industry standard has drifted toward bloated templates, slow load times, and disjointed experiences.
                </p>
                <p>
                  We exist to counter that. We are a tight-knit collective of senior designers and engineers who have spent the last decade building core products for leading tech companies.
                </p>
                <p>
                  When you hire us, you aren't handed off to junior associates. You work directly with the principals. We embed in your vision, strip away the excess, and deliver products that feel undeniably premium.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-24">
            <SilverDivider />
            <div className="pt-24">
              <div className="flex justify-center items-center gap-4 mb-16">
                <span className="w-8 h-[1px] bg-neutral-600" />
                <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-neutral-500">Principles</span>
                <span className="w-8 h-[1px] bg-neutral-600" />
              </div>
              <h2 className="text-4xl font-display font-bold tracking-tighter mb-16 text-center">Core Principles.</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    num: "01",
                    title: "Ruthless Subtraction",
                    desc: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away. We eliminate the unnecessary.",
                  },
                  {
                    num: "02",
                    title: "Motion as Meaning",
                    desc: "Animation is not decoration. It is context, hierarchy, and spatial understanding. We engineer motion at 60fps.",
                  },
                  {
                    num: "03",
                    title: "Code is Design",
                    desc: "The boundary between design and engineering is artificial. We design in code, ensuring what you approve is exactly what ships.",
                  },
                ].map((principle, i) => (
                  <motion.div
                    key={principle.num}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 border border-white/10 bg-[#050505] rounded-[2px] hover:border-white/25 transition-colors"
                  >
                    <div className="text-neutral-600 font-mono text-xl mb-6">{principle.num}</div>
                    <h3 className="text-2xl font-display font-bold mb-4">{principle.title}</h3>
                    <p className="text-neutral-400 leading-relaxed">{principle.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
