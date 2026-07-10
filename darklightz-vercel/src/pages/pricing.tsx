import { PublicLayout } from "@/components/layout/PublicLayout"
import { useListPricingPlans } from "@/lib/api-client"
import { motion } from "framer-motion"
import { Link } from "wouter"
import { Check } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function Pricing() {
  const { data: plans, isLoading } = useListPricingPlans()

  return (
    <PublicLayout>
      <div className="pt-32 pb-20 bg-black min-h-[100dvh]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-24 text-center mx-auto">
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">Engagement Models.</h1>
            <p className="text-xl text-neutral-400 leading-relaxed">
              Transparent, premium pricing for elite product design and engineering.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-neutral-500">Loading plans...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 max-w-6xl mx-auto">
              {plans?.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative p-8 border ${
                    plan.isFeatured 
                      ? 'border-white bg-[#0a0a0a]' 
                      : 'border-white/10 bg-[#050505]'
                  } flex flex-col h-full`}
                >
                  {plan.isFeatured && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-white text-black text-xs font-display uppercase tracking-widest font-bold">
                      Recommended
                    </div>
                  )}
                  
                  <div className="mb-8">
                    <h3 className="text-2xl font-display font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm text-neutral-400 h-10">{plan.tagline}</p>
                  </div>
                  
                  <div className="mb-8 pb-8 border-b border-white/10">
                    <div className="text-4xl font-display font-bold text-white mb-2">{plan.price}</div>
                    <div className="text-sm text-neutral-500 font-mono">{plan.billingNote}</div>
                  </div>
                  
                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-neutral-300">
                        <Check className="w-5 h-5 text-white shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link 
                    href="/contact" 
                    className={`h-12 w-full flex items-center justify-center font-display uppercase tracking-widest text-sm font-semibold transition-colors ${
                      plan.isFeatured
                        ? 'bg-white text-black hover:bg-neutral-200'
                        : 'border border-white/20 text-white hover:bg-white/5'
                    }`}
                  >
                    Select Plan
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <div className="max-w-3xl mx-auto border-t border-white/10 pt-24">
            <h2 className="text-3xl font-display font-bold mb-10 text-center">Frequently Asked Questions</h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How does the subscription model work?</AccordionTrigger>
                <AccordionContent>
                  You pause or cancel anytime. We work on one active task at a time, delivering updates every 48 hours. It's essentially having a senior designer and engineer on retainer without the overhead of hiring.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Why wouldn't I just hire an in-house designer?</AccordionTrigger>
                <AccordionContent>
                  A senior level product designer costs $150k+ plus benefits, and finding one is difficult. Furthermore, you may not always have enough work to keep them busy. With our model, you get immediate access to elite talent and can pause when things slow down.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What tech stack do you use?</AccordionTrigger>
                <AccordionContent>
                  We specialize in modern React ecosystems: Next.js, Vite, Tailwind CSS, Framer Motion, and Node.js/PostgreSQL backends. However, we are adaptable to your specific engineering requirements if established.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Do you do custom fixed-scope projects?</AccordionTrigger>
                <AccordionContent>
                  Yes, for large scale enterprise builds we offer comprehensive project scoping. Please book a call to discuss custom requirements.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
