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
      }
    })
  }

  return (
    <PublicLayout>
      <div className="pt-32 pb-20 bg-black min-h-[100dvh]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">Inquiries.</h1>
              <p className="text-xl text-neutral-400 leading-relaxed mb-12">
                Whether you have a specific project in mind or just want to explore possibilities, we're here to talk.
              </p>
              
              <div className="space-y-8 border-t border-white/10 pt-12">
                <div>
                  <div className="text-sm font-display uppercase tracking-widest text-neutral-500 mb-2">Email</div>
                  <a href="mailto:hello@darklightz.com" className="text-xl font-medium text-white hover:text-neutral-300 transition-colors">hello@darklightz.com</a>
                </div>
                <div>
                  <div className="text-sm font-display uppercase tracking-widest text-neutral-500 mb-2">Location</div>
                  <address className="not-italic text-xl font-medium text-white">
                    San Francisco, CA<br />
                    Remote Worldwide
                  </address>
                </div>
              </div>
            </div>

            <div className="bg-[#050505] border border-white/10 p-8 md:p-12">
              {isSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-4">Message Received</h3>
                  <p className="text-neutral-400 mb-8 max-w-md">
                    Thank you for reaching out. A principal will review your inquiry and get back to you within 24 hours.
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-white/20 hover:bg-white/5"
                    onClick={() => {
                      setIsSuccess(false)
                      form.reset()
                    }}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neutral-400 font-display uppercase tracking-widest text-[10px]">Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neutral-400 font-display uppercase tracking-widest text-[10px]">Email *</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" type="email" {...field} />
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
                          <FormItem>
                            <FormLabel className="text-neutral-400 font-display uppercase tracking-widest text-[10px]">Company</FormLabel>
                            <FormControl>
                              <Input placeholder="Acme Inc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neutral-400 font-display uppercase tracking-widest text-[10px]">Budget Range</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="< $25k">&lt; $25k</SelectItem>
                                <SelectItem value="$25k - $50k">$25k - $50k</SelectItem>
                                <SelectItem value="$50k - $100k">$50k - $100k</SelectItem>
                                <SelectItem value="$100k+">$100k+</SelectItem>
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
                        <FormItem>
                          <FormLabel className="text-neutral-400 font-display uppercase tracking-widest text-[10px]">Message *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your project goals..." 
                              className="min-h-[150px] resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full h-14 bg-white text-black hover:bg-neutral-200 mt-4 group"
                      disabled={isPending}
                    >
                      {isPending ? "Submitting..." : (
                        <span className="flex items-center gap-2">
                          Send Message <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
