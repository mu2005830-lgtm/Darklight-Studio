import { useState } from "react"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { useCreateBooking, useListServices } from "@/lib/api-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { Eyebrow, SilverDivider } from "@/components/effects"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  company: z.string().optional(),
  service: z.string().min(1, "Please select a service."),
  preferredDate: z.string().min(1, "Please choose a preferred date."),
  message: z.string().optional(),
})

export default function BookACall() {
  const [isSuccess, setIsSuccess] = useState(false)
  const { data: services } = useListServices()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      service: "",
      preferredDate: "",
      message: "",
    },
  })

  const { mutate, isPending } = useCreateBooking()

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      data: {
        ...values,
        message: values.message ?? "",
        // Backend expects an ISO date-time; the input only collects a date,
        // so normalize to midnight UTC on the selected day.
        preferredDate: new Date(`${values.preferredDate}T00:00:00Z`).toISOString(),
      },
    }, {
      onSuccess: () => {
        setIsSuccess(true)
      },
    })
  }

  return (
    <PublicLayout>
      <div className="pt-40 pb-24 md:pb-32 bg-[#030303] min-h-[100dvh]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex justify-center"><Eyebrow>Direct Access</Eyebrow></div>
              <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tighter mb-6">Book a Call.</h1>
              <p className="text-xl text-neutral-400 leading-relaxed">
                Direct access to the principals. Let's discuss your next move.
              </p>
            </div>

            <div className="bg-[#050505] border border-white/10 rounded-[2px] p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0"><SilverDivider /></div>

              {isSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-4">Request Confirmed</h3>
                  <p className="text-neutral-400 mb-8 max-w-md mx-auto">
                    We've received your booking request. Check your email for available time slots to confirm the meeting.
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-full border-white/20 hover:bg-white/5"
                    onClick={() => {
                      setIsSuccess(false)
                      form.reset()
                    }}
                  >
                    Submit another request
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10 pt-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="service"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neutral-400 font-display uppercase tracking-widest text-[10px]">Service of Interest *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {services?.map((s) => (
                                  <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>
                                ))}
                                <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="preferredDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neutral-400 font-display uppercase tracking-widest text-[10px]">Preferred Date *</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                {...field}
                              />
                            </FormControl>
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
                          <FormLabel className="text-neutral-400 font-display uppercase tracking-widest text-[10px]">Context (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any context to help us prepare..."
                              className="min-h-[100px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-14 rounded-full bg-white text-black hover:bg-neutral-200 mt-8 group"
                      disabled={isPending}
                    >
                      {isPending ? "Submitting..." : (
                        <span className="flex items-center gap-2">
                          Request Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
