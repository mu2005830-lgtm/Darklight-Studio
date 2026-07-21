import { useState } from "react"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Star } from "lucide-react"
import { Eyebrow } from "@/components/effects"
import { motion } from "framer-motion"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  company: z.string().optional(),
  rating: z.number().min(1).max(5).default(5),
  review: z.string().min(20, "Review must be at least 20 characters."),
  logoUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal("")),
})

export default function SubmitReview() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", company: "", rating: 5, review: "", logoUrl: "" },
  })

  const rating = form.watch("rating")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(null)
    try {
      const payload = { ...values, logoUrl: values.logoUrl || undefined }
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Submission failed. Please try again.")
      setIsSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PublicLayout>
      <div className="pt-40 pb-24 bg-background min-h-[100dvh]">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-16">
            <Eyebrow>Share Your Experience</Eyebrow>
            <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tighter mb-6">Leave a Review.</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Worked with Darklightz Studio? We'd love to hear from you. Reviews help other businesses make informed decisions.
            </p>
          </div>

          <div className="bg-card border border-border rounded-[2px] p-8 md:p-12">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-display font-bold mb-4">Thank You!</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your review has been submitted and is pending approval. Once approved, it will appear on our website.
                </p>
              </motion.div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground font-display uppercase tracking-widest text-[10px]">Your Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Name" className="bg-black/50 border-border" {...field} />
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
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground font-display uppercase tracking-widest text-[10px]">Company / Brand</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Business (optional)" className="bg-black/50 border-border" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Logo URL */}
                  <FormField
                    control={form.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground font-display uppercase tracking-widest text-[10px]">Company Logo URL <span className="normal-case tracking-normal">(optional)</span></FormLabel>
                        <FormControl>
                          <Input placeholder="https://your-company.com/logo.png" className="bg-black/50 border-border" {...field} />
                        </FormControl>
                        <p className="text-[10px] text-muted-foreground/50 mt-0.5">Paste a link to your company logo — it may appear alongside your review.</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Star rating */}
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground font-display uppercase tracking-widest text-[10px]">Rating *</FormLabel>
                        <div className="flex gap-2 pt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => field.onChange(star)}
                              onMouseEnter={() => setHoveredStar(star)}
                              onMouseLeave={() => setHoveredStar(0)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-7 h-7 transition-colors ${
                                  star <= (hoveredStar || rating)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </button>
                          ))}
                          <span className="ml-2 text-sm text-muted-foreground self-center">
                            {rating}/5
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="review"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground font-display uppercase tracking-widest text-[10px]">Your Review *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your experience working with Darklightz Studio..."
                            className="min-h-[150px] resize-none bg-black/50 border-border"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className={`text-[10px] mt-0.5 transition-colors ${field.value.length >= 20 ? "text-emerald-500/60" : "text-muted-foreground/40"}`}>
                          {field.value.length >= 20 ? `✓ ${field.value.length} characters` : `${20 - field.value.length} more character${20 - field.value.length === 1 ? "" : "s"} needed`}
                        </p>
                      </FormItem>
                    )}
                  />

                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}

                  <Button
                    type="submit"
                    className="relative w-full h-14 rounded-[2px] bg-white text-black hover:bg-neutral-200 group/btn overflow-hidden"
                    disabled={isSubmitting}
                  >
                    <div className="absolute inset-0 bg-neutral-900 transform translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                    <span className="relative z-10 group-hover/btn:text-white transition-colors duration-300 font-bold uppercase tracking-[0.2em] text-[10px]">
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </span>
                  </Button>

                  <p className="text-center text-xs text-muted-foreground/60">
                    Reviews are reviewed by our team before being published.
                  </p>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
