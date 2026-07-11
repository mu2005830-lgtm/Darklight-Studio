import { useState } from "react"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { useCreateContactSubmission } from "@/lib/api-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { Eyebrow, TextSliceReveal } from "@/components/effects"
import { motion, AnimatePresence } from "framer-motion"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  company: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters."),
})

export default function Contact() {
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      budget: "",
      message: "",
    },
  })

  const { mutate, isPending } = useCreateContactSubmission()

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({ data: values }, {
      onSuccess: () => {
        setIsSuccess(true)
      },
    })
  }

  return (
    <PublicLayout>
      <div className="pt-40 pb-24 md:pb-32 bg-[#030303] min-h-[100dvh]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <Eyebrow>Get in touch</Eyebrow>
              <TextSliceReveal>
                <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6">Inquiries.</h1>
              </TextSliceReveal>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-xl text-neutral-400 leading-relaxed mb-12"
              >
                Whether you have a specific project in mind or just want to explore possibilities, we're here to talk.
              </motion.p>

              <div className="space-y-8 border-t border-white/10 pt-12">
                <div>
                  <div className="text-[9px] font-display uppercase tracking-[0.25em] font-bold text-neutral-500 mb-2">Email</div>
                  <a href="mailto:hello@darklightz.com" className="text-xl font-medium text-white hover:text-neutral-300 transition-colors">hello@darklightz.com</a>
                </div>
                <div>
                  <div className="text-[9px] font-display uppercase tracking-[0.25em] font-bold text-neutral-500 mb-2">Location</div>
                  <address className="not-italic text-xl font-medium text-white">
                    San Francisco, CA<br />
                    Remote Worldwide
                  </address>
                </div>
              </div>
            </div>

            <div className="bg-[#050505] border border-white/10 rounded-[2px] p-8 md:p-12 relative overflow-hidden group">
              {/* Subtle hover effect for the form container */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full flex flex-col items-center justify-center text-center py-12 relative z-10"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                      className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black mb-6"
                    >
                      <CheckCircle2 className="w-8 h-8" />
                    </motion.div>
                    <h3 className="text-3xl font-display font-bold mb-4">Message Received</h3>
                    <p className="text-neutral-400 mb-8 max-w-md">
                      Thank you for reaching out. A principal will review your inquiry and get back to you within 24 hours.
                    </p>
                    <Button
                      variant="outline"
                      className="rounded-full border-white/20 hover:bg-white/5 transition-colors"
                      onClick={() => {
                        setIsSuccess(false)
                        form.reset()
                      }}
                    >
                      Send another message
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10"
                  >
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem className="group/field relative">
                                <FormLabel className="text-neutral-400 font-display uppercase tracking-widest text-[10px] group-focus-within/field:text-white transition-colors">Name *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="John Doe" 
                                    className="bg-black/50 border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="group/field relative">
                                <FormLabel className="text-neutral-400 font-display uppercase tracking-widest text-[10px] group-focus-within/field:text-white transition-colors">Email *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="john@example.com" 
                                    type="email" 
                                    className="bg-black/50 border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem className="group/field relative">
                                <FormLabel className="text-neutral-400 font-display uppercase tracking-widest text-[10px] group-focus-within/field:text-white transition-colors">Company</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Acme Inc." 
                                    className="bg-black/50 border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="budget"
                            render={({ field }) => (
                              <FormItem className="group/field relative">
                                <FormLabel className="text-neutral-400 font-display uppercase tracking-widest text-[10px] group-focus-within/field:text-white transition-colors">Budget Range</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-black/50 border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300">
                                      <SelectValue placeholder="Select a range" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-[#0a0a0a] border-white/10">
                                    <SelectItem value="< $25k" className="focus:bg-white/10 focus:text-white">&lt; $25k</SelectItem>
                                    <SelectItem value="$25k - $50k" className="focus:bg-white/10 focus:text-white">$25k - $50k</SelectItem>
                                    <SelectItem value="$50k - $100k" className="focus:bg-white/10 focus:text-white">$50k - $100k</SelectItem>
                                    <SelectItem value="$100k+" className="focus:bg-white/10 focus:text-white">$100k+</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem className="group/field relative">
                              <FormLabel className="text-neutral-400 font-display uppercase tracking-widest text-[10px] group-focus-within/field:text-white transition-colors">Message *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us about your project goals..."
                                  className="min-h-[150px] resize-none bg-black/50 border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="relative w-full h-14 rounded-[2px] bg-white text-black hover:bg-neutral-200 mt-4 group/btn overflow-hidden"
                          disabled={isPending}
                        >
                          <div className="absolute inset-0 bg-neutral-900 transform translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                          <span className="relative z-10 flex items-center justify-center gap-2 group-hover/btn:text-white transition-colors duration-300 font-bold uppercase tracking-[0.2em] text-[10px]">
                            {isPending ? "Submitting..." : (
                              <>Send Message <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></>
                            )}
                          </span>
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
