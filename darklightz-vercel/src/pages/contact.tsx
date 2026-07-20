import { useState } from "react"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { useCreateContactSubmission, useGetSiteSettings } from "@/lib/api-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, ArrowRight, AlertCircle } from "lucide-react"
import { Eyebrow, TextSliceReveal } from "@/components/effects"
import { motion, AnimatePresence } from "framer-motion"
// Note: EmailJS is now called server-side in the backend contact route.
// The frontend no longer needs to call EmailJS directly — this prevents
// double-sends and works even when JS is restricted by ad-blockers.

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  company: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters."),
})

export default function Contact() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { data: settings } = useGetSiteSettings()
  const contactEmail = settings?.contactEmail || "darklightzstudiu@gmail.com"
  const whatsappNumber = settings?.whatsappNumber || "+923350501287"
  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`
  const contactAddress = settings?.contactAddress || "Walton, Lahore, Punjab, Pakistan"

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
    setSubmitError(null)
    mutate({ data: values }, {
      onSuccess: () => {
        // Backend now handles both the admin notification and customer auto-reply
        // via EmailJS REST API — no frontend email call needed.
        setIsSuccess(true)
      },
      onError: (err: unknown) => {
        const msg = err instanceof Error
          ? err.message
          : `Something went wrong. Please try again or email us directly at ${contactEmail}.`
        setSubmitError(msg)
      },
    })
  }

  return (
    <PublicLayout>
      <div className="pt-40 pb-24 md:pb-32 bg-background min-h-[100dvh]">
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
                className="text-xl text-muted-foreground leading-relaxed mb-12"
              >
                Whether you have a specific project in mind or just want to explore possibilities, we're here to talk.
              </motion.p>

              <div className="space-y-8 border-t border-border pt-12">
                <div>
                  <div className="text-[9px] font-display uppercase tracking-[0.25em] font-bold text-muted-foreground/70 mb-2">Email</div>
                  <a href={`mailto:${contactEmail}`} className="text-xl font-medium text-white hover:text-muted-foreground transition-colors">{contactEmail}</a>
                </div>
                <div>
                  <div className="text-[9px] font-display uppercase tracking-[0.25em] font-bold text-muted-foreground/70 mb-2">Phone / WhatsApp</div>
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-xl font-medium text-white hover:text-muted-foreground transition-colors">{whatsappNumber}</a>
                </div>
                <div>
                  <div className="text-[9px] font-display uppercase tracking-[0.25em] font-bold text-muted-foreground/70 mb-2">Location</div>
                  <address className="not-italic text-xl font-medium text-white">
                    Walton, Lahore<br />
                    Punjab, Pakistan<br />
                    <span className="text-muted-foreground text-base">Remote &amp; On-site (Lahore)</span>
                  </address>
                </div>
                <div>
                  <div className="text-[9px] font-display uppercase tracking-[0.25em] font-bold text-muted-foreground/70 mb-2">Business Hours</div>
                  <p className="text-xl font-medium text-white">Open 24/7 — avg. response within 10–60 min</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-[2px] p-8 md:p-12 relative overflow-hidden group">
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
                    <p className="text-muted-foreground mb-8 max-w-md">
                      Thank you for reaching out. We'll review your inquiry and get back to you within 10–60 minutes.
                    </p>
                    <Button
                      variant="outline"
                      className="rounded-full border-border hover:bg-muted/30 transition-colors"
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
                                <FormLabel className="text-muted-foreground font-display uppercase tracking-widest text-[10px] group-focus-within/field:text-white transition-colors">Name *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Your Name" 
                                    className="bg-black/50 border-border focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                                <p className={`text-[10px] mt-0.5 transition-colors ${field.value.length >= 2 ? "text-emerald-500/60" : "text-muted-foreground/40"}`}>
                                  {field.value.length >= 2 ? `✓ ${field.value.length} characters` : `${2 - field.value.length} more character${2 - field.value.length === 1 ? "" : "s"} needed`}
                                </p>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="group/field relative">
                                <FormLabel className="text-muted-foreground font-display uppercase tracking-widest text-[10px] group-focus-within/field:text-white transition-colors">Email *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="yourname@email.com" 
                                    type="email" 
                                    className="bg-black/50 border-border focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300"
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
                                <FormLabel className="text-muted-foreground font-display uppercase tracking-widest text-[10px] group-focus-within/field:text-white transition-colors">Business / Brand</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Your Business Name" 
                                    className="bg-black/50 border-border focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300"
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
                                <FormLabel className="text-muted-foreground font-display uppercase tracking-widest text-[10px] group-focus-within/field:text-white transition-colors">Budget Range (PKR)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-black/50 border-border focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300">
                                      <SelectValue placeholder="Select a range" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-background border-border">
                                    <SelectItem value="Under PKR 25,000" className="focus:bg-muted/50 focus:text-white">Under PKR 25,000</SelectItem>
                                    <SelectItem value="PKR 25,000 – 50,000" className="focus:bg-muted/50 focus:text-white">PKR 25,000 – 50,000</SelectItem>
                                    <SelectItem value="PKR 50,000 – 1,00,000" className="focus:bg-muted/50 focus:text-white">PKR 50,000 – 1,00,000</SelectItem>
                                    <SelectItem value="PKR 1,00,000+" className="focus:bg-muted/50 focus:text-white">PKR 1,00,000+</SelectItem>
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
                              <FormLabel className="text-muted-foreground font-display uppercase tracking-widest text-[10px] group-focus-within/field:text-white transition-colors">Message *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us about your project, business, and what you want to achieve..."
                                  className="min-h-[150px] resize-none bg-black/50 border-border focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                              <p className={`text-[10px] mt-0.5 transition-colors ${field.value.length >= 10 ? "text-emerald-500/60" : "text-muted-foreground/40"}`}>
                                {field.value.length >= 10 ? `✓ ${field.value.length} characters` : `${10 - field.value.length} more character${10 - field.value.length === 1 ? "" : "s"} needed`}
                              </p>
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
                            {isPending ? "Submitting…" : (
                              <>Send Message <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></>
                            )}
                          </span>
                        </Button>

                        {/* Error message */}
                        {submitError && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-3 mt-3 p-4 border border-red-900/60 bg-red-950/20 rounded-[2px]"
                          >
                            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-300 leading-relaxed">
                              {submitError}
                            </p>
                          </motion.div>
                        )}
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
