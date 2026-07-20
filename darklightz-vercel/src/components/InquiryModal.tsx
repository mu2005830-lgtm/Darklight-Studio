import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { X, CheckCircle2, ArrowRight, MessageCircle } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateInquiry } from "@/lib/api-client/cms-api"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  company: z.string().optional(),
  budget: z.string().optional(),
  description: z.string().min(10, "Please describe your project (at least 10 characters)."),
})

interface InquiryModalProps {
  open: boolean
  onClose: () => void
  serviceSlug: string
  serviceTitle: string
  servicePrice?: string
}

const BUDGET_OPTIONS = [
  "< PKR 15,000",
  "PKR 15,000 – 50,000",
  "PKR 50,000 – 100,000",
  "PKR 100,000 – 250,000",
  "PKR 250,000+",
  "Let's discuss",
]

const inputCls = "bg-black/50 border-border focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300 text-white placeholder:text-muted-foreground/50"
const labelCls = "text-muted-foreground font-display uppercase tracking-widest text-[10px] group-focus-within/field:text-white transition-colors"

export function InquiryModal({ open, onClose, serviceSlug, serviceTitle, servicePrice }: InquiryModalProps) {
  const [isSuccess, setIsSuccess] = useState(false)
  const { mutate, isPending } = useCreateInquiry()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", company: "", budget: "", description: "" },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(
      {
        name: values.name,
        email: values.email,
        phone: values.phone ?? "",
        company: values.company ?? "",
        serviceSlug,
        serviceTitle,
        price: servicePrice ?? "",
        budget: values.budget ?? "",
        description: values.description,
      },
      { onSuccess: () => setIsSuccess(true) }
    )
  }

  function handleClose() {
    onClose()
    setTimeout(() => {
      setIsSuccess(false)
      form.reset()
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-2xl bg-background border border-border rounded-[2px] p-0 overflow-hidden gap-0">
        <DialogTitle className="sr-only">Service Inquiry – {serviceTitle}</DialogTitle>

        {/* Header */}
        <div className="relative border-b border-border px-8 py-6 flex items-start justify-between">
          <div>
            <p className="text-[9px] font-display uppercase tracking-[0.25em] text-muted-foreground/60 mb-1">
              Service Inquiry
            </p>
            <h2 className="text-2xl font-display font-bold text-white">{serviceTitle}</h2>
            {servicePrice && (
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[9px] font-display uppercase tracking-[0.2em] text-muted-foreground/50">Starting at</span>
                <span className="text-sm font-bold text-white">{servicePrice}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-white transition-colors mt-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-8 max-h-[70vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black mb-6"
                >
                  <CheckCircle2 className="w-8 h-8" />
                </motion.div>
                <h3 className="text-2xl font-display font-bold mb-3">Inquiry Received</h3>
                <p className="text-muted-foreground max-w-sm mb-8">
                  We'll review your <strong className="text-white">{serviceTitle}</strong> inquiry and get back to you within 24 hours.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="rounded-[2px] border-border hover:bg-muted/30"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                  <a
                    href={`https://wa.me/+923351468615?text=Hi, I just submitted an inquiry for ${serviceTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-black text-sm font-bold rounded-[2px] hover:bg-[#22c55e] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem className="group/field">
                          <FormLabel className={labelCls}>Name *</FormLabel>
                          <FormControl><Input placeholder="Your name" className={inputCls} {...field} /></FormControl>
                          <FormMessage />
                          <p className={`text-[10px] mt-0.5 transition-colors ${field.value.length >= 2 ? "text-emerald-500/60" : "text-muted-foreground/40"}`}>
                            {field.value.length >= 2 ? `✓ ${field.value.length} characters` : `${2 - field.value.length} more character${2 - field.value.length === 1 ? "" : "s"} needed`}
                          </p>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem className="group/field">
                          <FormLabel className={labelCls}>Email *</FormLabel>
                          <FormControl><Input placeholder="you@example.com" type="email" className={inputCls} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem className="group/field">
                          <FormLabel className={labelCls}>Phone Number</FormLabel>
                          <FormControl><Input placeholder="+92 300 0000000" className={inputCls} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="company" render={({ field }) => (
                        <FormItem className="group/field">
                          <FormLabel className={labelCls}>Company Name <span className="text-muted-foreground/40">(optional)</span></FormLabel>
                          <FormControl><Input placeholder="Acme Inc." className={inputCls} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="budget" render={({ field }) => (
                      <FormItem className="group/field">
                        <FormLabel className={labelCls}>Budget Range <span className="text-muted-foreground/40">(optional)</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={inputCls}>
                              <SelectValue placeholder="Select a range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background border-border">
                            {BUDGET_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt} className="focus:bg-muted/50 focus:text-white">{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="description" render={({ field }) => (
                      <FormItem className="group/field">
                        <FormLabel className={labelCls}>Project Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your project — goals, timeline, any specific requirements..."
                            className={`${inputCls} min-h-[120px] resize-none`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className={`text-[10px] mt-0.5 transition-colors ${field.value.length >= 10 ? "text-emerald-500/60" : "text-muted-foreground/40"}`}>
                          {field.value.length >= 10 ? `✓ ${field.value.length} characters` : `${10 - field.value.length} more character${10 - field.value.length === 1 ? "" : "s"} needed`}
                        </p>
                      </FormItem>
                    )} />

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="flex-1 h-12 rounded-[2px] bg-white text-black hover:bg-neutral-200 group/btn relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-neutral-900 transform translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                        <span className="relative z-10 flex items-center justify-center gap-2 group-hover/btn:text-white transition-colors font-bold uppercase tracking-[0.2em] text-[10px]">
                          {isPending ? "Submitting..." : (<>Submit Inquiry <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></>)}
                        </span>
                      </Button>
                      <a
                        href={`https://wa.me/+923351468615?text=Hi, I'm interested in your ${serviceTitle} service`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-[10px] font-bold uppercase tracking-[0.2em] rounded-[2px] hover:bg-[#25D366]/20 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </a>
                    </div>
                  </form>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
