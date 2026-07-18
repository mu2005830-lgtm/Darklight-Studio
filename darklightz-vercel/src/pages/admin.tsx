import React, { useState, useEffect, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { setAdminApiKey } from "@/lib/api-client"
import { ImageUpload } from "@/components/ImageUpload"
import {
  // ── public list hooks (reused for admin listing) ─────────────────────────
  useListServices,        getListServicesQueryKey,
  useListPortfolioProjects, getListPortfolioProjectsQueryKey,
  useListCaseStudies,     getListCaseStudiesQueryKey,
  useListTestimonials,    getListTestimonialsQueryKey,
  useListBlogPosts,       getListBlogPostsQueryKey,
  useListPricingPlans,    getListPricingPlansQueryKey,
  // ── CRM ──────────────────────────────────────────────────────────────────
  useGetDashboardSummary,
  useListContactSubmissions,      getListContactSubmissionsQueryKey,
  useUpdateContactSubmission,
  useListBookings,                getListBookingsQueryKey,
  useUpdateBooking,
  // ── CMS phase 2 hooks ────────────────────────────────────────────────────
  useGetSiteSettings,       getSiteSettingsQueryKey,   useUpdateSiteSettings,
  useListSocialLinks,       getListSocialLinksQueryKey,
  useCreateSocialLink, useUpdateSocialLink, useDeleteSocialLink,
  useListTeamMembers,       getListTeamMembersQueryKey,
  useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember,
  useListFaqItems,          getListFaqItemsQueryKey,
  useCreateFaqItem, useUpdateFaqItem, useDeleteFaqItem,
  useListClients,           getListClientsQueryKey,
  useCreateClient, useUpdateClient, useDeleteClient,
  // ── content CRUD mutations ────────────────────────────────────────────────
  useAdminCreateService,    useAdminUpdateService,    useAdminDeleteService,
  useAdminCreatePortfolio,  useAdminUpdatePortfolio,  useAdminDeletePortfolio,
  useAdminCreateCaseStudy,  useAdminUpdateCaseStudy,  useAdminDeleteCaseStudy,
  useAdminCreateTestimonial,useAdminUpdateTestimonial,useAdminDeleteTestimonial,
  useAdminCreateBlogPost,   useAdminUpdateBlogPost,   useAdminDeleteBlogPost,
  useAdminCreatePricingPlan,useAdminUpdatePricingPlan,useAdminDeletePricingPlan,
} from "@/lib/api-client"
import { Button }   from "@/components/ui/button"
import { Input }    from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  LayoutDashboard, FileText, Image, Users, Star, DollarSign,
  HelpCircle, Building2, Mail, Calendar, Settings,
  Link as LinkIcon, Plus, Pencil, Trash2, LogOut, Lock,
  Eye, EyeOff, Save, AlertCircle, Upload, X,
} from "lucide-react"

// ============================================================================
// Constants
// ============================================================================

const SESSION_KEY = "dk_admin_key"

type Section =
  | "dashboard"
  | "services" | "portfolio" | "case-studies" | "testimonials"
  | "blog" | "pricing" | "faq" | "team" | "clients"
  | "contacts" | "bookings"
  | "site-settings" | "social-links"
  | "portal-crm"

// ============================================================================
// AdminLogin — preserved exactly from original
// ============================================================================

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [key, setKey]       = useState("")
  const [show, setShow]     = useState(false)
  const [error, setError]   = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!key.trim()) return
    setLoading(true)
    setError("")
    setAdminApiKey(key.trim())
    try {
      const base = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? ""
      const res = await fetch(`${base}/api/admin/dashboard-summary`, {
        headers: { "x-admin-key": key.trim() },
      })
      if (res.ok) {
        sessionStorage.setItem(SESSION_KEY, key.trim())
        onSuccess()
      } else if (res.status === 401) {
        setAdminApiKey(null)
        setError("Incorrect passcode. Try again.")
      } else {
        setAdminApiKey(null)
        setError(`Server error (${res.status}). Check API is running.`)
      }
    } catch {
      setAdminApiKey(null)
      setError("Could not reach the API server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-12">
          <span className="w-2 h-2 bg-white" />
          <span className="font-display font-bold tracking-tight text-white">DARKLIGHTZ</span>
          <span className="text-neutral-600 text-sm">/ Admin</span>
        </div>
        <div className="bg-[#050505] border border-white/10 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-neutral-400" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-white">Admin Access</h1>
              <p className="text-xs text-neutral-500">Enter your dashboard passcode</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                placeholder="Passcode"
                value={key}
                onChange={e => setKey(e.target.value)}
                className="pr-10 bg-black border-white/10 text-white placeholder:text-neutral-600 h-12 font-mono tracking-widest"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShow(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <Button
              type="submit"
              disabled={loading || !key.trim()}
              className="w-full h-12 bg-white text-black hover:bg-neutral-200 font-medium"
            >
              {loading ? "Verifying…" : "Enter Dashboard"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Shared primitives
// ============================================================================

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-display font-bold text-xl text-white">{title}</h2>
      {action}
    </div>
  )
}

function AddBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button onClick={onClick} size="sm" className="bg-white text-black hover:bg-neutral-200 gap-1.5">
      <Plus className="w-3.5 h-3.5" /> {label}
    </Button>
  )
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onEdit} className="p-1.5 text-neutral-500 hover:text-white transition-colors">
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button onClick={onDelete} className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "bg-black border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-white/20"

function confirmDelete(name: string): boolean {
  return window.confirm(`Delete "${name}"? This cannot be undone.`)
}

// ============================================================================
// Dashboard Section
// ============================================================================

function DashboardSection() {
  const { data: summary, isLoading } = useGetDashboardSummary()

  const stats = [
    { label: "Portfolio Projects", value: summary?.totalPortfolioProjects ?? 0 },
    { label: "Case Studies",       value: summary?.totalCaseStudies       ?? 0 },
    { label: "Blog Posts",         value: summary?.totalBlogPosts         ?? 0 },
    { label: "New Contacts",       value: summary?.totalContactSubmissions ?? 0 },
    { label: "Recent Bookings",   value: summary?.totalBookings           ?? 0 },
    { label: "Total Bookings",     value: summary?.totalBookings          ?? 0 },
  ]

  return (
    <div>
      <SectionHeader title="Dashboard" />
      {isLoading ? (
        <p className="text-neutral-500 text-sm">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {stats.map(s => (
              <div key={s.label} className="bg-[#050505] border border-white/10 p-4">
                <p className="text-xs text-neutral-500 mb-1">{s.label}</p>
                <p className="font-display font-bold text-3xl text-white">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent contacts */}
            <div className="bg-[#050505] border border-white/10 p-5">
              <h3 className="text-sm font-medium text-white mb-4">Recent Contacts</h3>
              {(summary?.recentContactSubmissions ?? []).length === 0 ? (
                <p className="text-neutral-600 text-sm">None yet</p>
              ) : (
                <div className="space-y-3">
                  {summary!.recentContactSubmissions.map(c => (
                    <div key={c.id} className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-white">{c.name}</p>
                        <p className="text-xs text-neutral-500">{c.email}</p>
                      </div>
                      <span className="text-xs text-neutral-500 shrink-0">
                        {format(new Date(c.createdAt), "MMM d")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent bookings */}
            <div className="bg-[#050505] border border-white/10 p-5">
              <h3 className="text-sm font-medium text-white mb-4">Recent Bookings</h3>
              {(summary?.recentBookings ?? []).length === 0 ? (
                <p className="text-neutral-600 text-sm">None yet</p>
              ) : (
                <div className="space-y-3">
                  {summary!.recentBookings.map(b => (
                    <div key={b.id} className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-white">{b.name}</p>
                        <p className="text-xs text-neutral-500">{b.service}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 border ${
                        b.status === "confirmed" ? "border-green-500/30 text-green-400" :
                        b.status === "cancelled" ? "border-red-500/30 text-red-400" :
                        "border-white/10 text-neutral-400"
                      }`}>{b.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ============================================================================
// Services Section
// ============================================================================

type ServiceForm = {
  title: string; slug: string; summary: string; description: string; icon: string; sortOrder: string;
  category: string; price: string; deliveryTime: string; heroImage: string;
  featuredBadge: string; ctaText: string; whatsIncluded: string; processSteps: string;
}
const EMPTY_SERVICE: ServiceForm = {
  title: "", slug: "", summary: "", description: "", icon: "✦", sortOrder: "0",
  category: "website-services", price: "", deliveryTime: "", heroImage: "",
  featuredBadge: "", ctaText: "Get Started", whatsIncluded: "", processSteps: "",
}

function ServicesSection() {
  const qc = useQueryClient()
  const { data: items = [] } = useListServices()
  const createM = useAdminCreateService({ onSuccess: () => { qc.invalidateQueries({ queryKey: getListServicesQueryKey() }); setOpen(false) } })
  const updateM = useAdminUpdateService({ onSuccess: () => { qc.invalidateQueries({ queryKey: getListServicesQueryKey() }); setOpen(false) } })
  const deleteM = useAdminDeleteService({ onSuccess: () => qc.invalidateQueries({ queryKey: getListServicesQueryKey() }) })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState<ServiceForm>(EMPTY_SERVICE)
  const f = (k: keyof ServiceForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  function openCreate() { setEditing(null); setForm(EMPTY_SERVICE); setOpen(true) }
  function openEdit(item: typeof items[0]) {
    setEditing(item.id)
    setForm({
      title: item.title, slug: item.slug, summary: item.summary ?? "", description: item.description ?? "",
      icon: item.icon ?? "✦", sortOrder: String(item.sortOrder ?? 0),
      category: (item as any).category ?? "website-services",
      price: (item as any).price ?? "",
      deliveryTime: (item as any).deliveryTime ?? "",
      heroImage: (item as any).heroImage ?? "",
      featuredBadge: (item as any).featuredBadge ?? "",
      ctaText: (item as any).ctaText ?? "Get Started",
      whatsIncluded: ((item as any).whatsIncluded ?? []).join("\n"),
      processSteps: ((item as any).processSteps ?? []).join("\n"),
    })
    setOpen(true)
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const body = {
      title: form.title, slug: form.slug, summary: form.summary, description: form.description,
      icon: form.icon, sortOrder: Number(form.sortOrder),
      category: form.category, price: form.price, deliveryTime: form.deliveryTime,
      heroImage: form.heroImage, featuredBadge: form.featuredBadge, ctaText: form.ctaText,
      whatsIncluded: form.whatsIncluded.split("\n").map(s => s.trim()).filter(Boolean),
      processSteps: form.processSteps.split("\n").map(s => s.trim()).filter(Boolean),
    }
    editing !== null ? updateM.mutate({ id: editing, body }) : createM.mutate(body as any)
  }

  return (
    <div>
      <SectionHeader title="Services" action={<AddBtn label="Add Service" onClick={openCreate} />} />
      <div className="bg-[#050505] border border-white/10">
        {items.length === 0 ? <p className="p-6 text-neutral-500 text-sm">No services yet.</p> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Title</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Category</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Price</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Delivery</th>
              <th className="p-4 w-20"></th>
            </tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="p-4 text-white">{item.title}</td>
                  <td className="p-4 text-neutral-400 text-xs">{(item as any).category ?? "—"}</td>
                  <td className="p-4 text-neutral-300 text-xs font-mono">{(item as any).price || "—"}</td>
                  <td className="p-4 text-neutral-400 text-xs">{(item as any).deliveryTime || "—"}</td>
                  <td className="p-4"><RowActions onEdit={() => openEdit(item)} onDelete={() => { if (confirmDelete(item.title)) deleteM.mutate(item.id) }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#050505] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">{editing !== null ? "Edit Service" : "Add Service"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Title"><Input className={inputCls} value={form.title} onChange={f("title")} required /></FormField>
              <FormField label="Slug"><Input className={inputCls} value={form.slug} onChange={f("slug")} required placeholder="landing-page" /></FormField>
            </div>
            <FormField label="Summary (short)"><Textarea className={inputCls} value={form.summary} onChange={f("summary")} rows={2} required /></FormField>
            <FormField label="Description (full)"><Textarea className={inputCls} value={form.description} onChange={f("description")} rows={3} /></FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Category">
                <Select value={form.category} onValueChange={(v) => setForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/10">
                    <SelectItem value="website-services" className="text-white focus:bg-white/10">Website Services</SelectItem>
                    <SelectItem value="content-creation" className="text-white focus:bg-white/10">Content Creation</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Featured Badge"><Input className={inputCls} value={form.featuredBadge} onChange={f("featuredBadge")} placeholder="Popular / Premium / Trending" /></FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Price"><Input className={inputCls} value={form.price} onChange={f("price")} placeholder="From PKR 6,000" /></FormField>
              <FormField label="Delivery Time"><Input className={inputCls} value={form.deliveryTime} onChange={f("deliveryTime")} placeholder="3–5 days" /></FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="CTA Button Text"><Input className={inputCls} value={form.ctaText} onChange={f("ctaText")} placeholder="Get Started" /></FormField>
              <FormField label="Icon"><Input className={inputCls} value={form.icon} onChange={f("icon")} placeholder="✦" /></FormField>
            </div>

            <FormField label="Hero Image URL"><ImageUpload value={form.heroImage} onChange={url => setForm(p => ({ ...p, heroImage: url }))} /></FormField>

            <FormField label="What's Included (one per line)">
              <Textarea className={inputCls} value={form.whatsIncluded} onChange={f("whatsIncluded")} rows={5}
                placeholder={"Custom design\nMobile responsive\nContact form\nSEO meta tags"} />
            </FormField>

            <FormField label="Process Steps (one per line, max 7)">
              <Textarea className={inputCls} value={form.processSteps} onChange={f("processSteps")} rows={7}
                placeholder={"Discovery — learn your goals.\nPlanning — structure and flow.\nDesign — premium layout.\nDevelopment — clean code.\nReview — your feedback.\nDelivery — live handover.\nSupport — 30-day post-launch."} />
            </FormField>

            <FormField label="Sort Order"><Input className={inputCls} type="number" value={form.sortOrder} onChange={f("sortOrder")} /></FormField>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={createM.isPending || updateM.isPending} className="bg-white text-black hover:bg-neutral-200">Save</Button>
              <Button type="button" variant="outline" className="border-white/10 text-white hover:bg-white/5" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================================================
// Portfolio Section
// ============================================================================

type PortfolioForm = { title: string; slug: string; category: string; summary: string; imageUrl: string; tags: string; year: string; sortOrder: string }
const EMPTY_PORTFOLIO: PortfolioForm = { title: "", slug: "", category: "", summary: "", imageUrl: "", tags: "", year: String(new Date().getFullYear()), sortOrder: "0" }

function PortfolioSection() {
  const qc = useQueryClient()
  const { data: items = [] } = useListPortfolioProjects()
  const createM = useAdminCreatePortfolio({ onSuccess: () => { qc.invalidateQueries({ queryKey: getListPortfolioProjectsQueryKey() }); setOpen(false) } })
  const updateM = useAdminUpdatePortfolio({ onSuccess: () => { qc.invalidateQueries({ queryKey: getListPortfolioProjectsQueryKey() }); setOpen(false) } })
  const deleteM = useAdminDeletePortfolio({ onSuccess: () => qc.invalidateQueries({ queryKey: getListPortfolioProjectsQueryKey() }) })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState<PortfolioForm>(EMPTY_PORTFOLIO)
  const f = (k: keyof PortfolioForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  function openEdit(item: typeof items[0]) { setEditing(item.id); setForm({ title: item.title, slug: item.slug, category: item.category, summary: item.summary, imageUrl: item.imageUrl, tags: item.tags.join(", "), year: String(item.year), sortOrder: String(item.sortOrder) }); setOpen(true) }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const body = { title: form.title, slug: form.slug, category: form.category, summary: form.summary, imageUrl: form.imageUrl, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean), year: Number(form.year), sortOrder: Number(form.sortOrder) }
    editing !== null ? updateM.mutate({ id: editing, body }) : createM.mutate(body)
  }

  return (
    <div>
      <SectionHeader title="Portfolio" action={<AddBtn label="Add Project" onClick={() => { setEditing(null); setForm(EMPTY_PORTFOLIO); setOpen(true) }} />} />
      <div className="bg-[#050505] border border-white/10">
        {items.length === 0 ? <p className="p-6 text-neutral-500 text-sm">No projects yet.</p> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Title</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Category</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Year</th>
              <th className="p-4 w-20"></th>
            </tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="p-4 text-white">{item.title}</td>
                  <td className="p-4 text-neutral-400">{item.category}</td>
                  <td className="p-4 text-neutral-400">{item.year}</td>
                  <td className="p-4"><RowActions onEdit={() => openEdit(item)} onDelete={() => { if (confirmDelete(item.title)) deleteM.mutate(item.id) }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#050505] border-white/10 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">{editing !== null ? "Edit Project" : "Add Project"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Title"><Input className={inputCls} value={form.title} onChange={f("title")} required /></FormField>
              <FormField label="Slug"><Input className={inputCls} value={form.slug} onChange={f("slug")} required /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Category"><Input className={inputCls} value={form.category} onChange={f("category")} required /></FormField>
              <FormField label="Year"><Input className={inputCls} type="number" value={form.year} onChange={f("year")} required /></FormField>
            </div>
            <FormField label="Summary"><Textarea className={inputCls} value={form.summary} onChange={f("summary")} rows={2} required /></FormField>
            <FormField label="Image URL"><ImageUpload value={form.imageUrl} onChange={url => setForm(p => ({ ...p, imageUrl: url }))} /></FormField>
            <FormField label="Tags (comma-separated)"><Input className={inputCls} value={form.tags} onChange={f("tags")} placeholder="Branding, Web, Motion" /></FormField>
            <FormField label="Sort Order"><Input className={inputCls} type="number" value={form.sortOrder} onChange={f("sortOrder")} /></FormField>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-white text-black hover:bg-neutral-200">Save</Button>
              <Button type="button" variant="outline" className="border-white/10 text-white hover:bg-white/5" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================================================
// Case Studies Section
// ============================================================================

type CaseStudyForm = { title: string; slug: string; client: string; summary: string; challenge: string; solution: string; result: string; imageUrl: string; metricLabel: string; metricValue: string; sortOrder: string }
const EMPTY_CS: CaseStudyForm = { title: "", slug: "", client: "", summary: "", challenge: "", solution: "", result: "", imageUrl: "", metricLabel: "", metricValue: "", sortOrder: "0" }

function CaseStudiesSection() {
  const qc = useQueryClient()
  const { data: items = [] } = useListCaseStudies()
  const createM = useAdminCreateCaseStudy({ onSuccess: () => { qc.invalidateQueries({ queryKey: getListCaseStudiesQueryKey() }); setOpen(false) } })
  const updateM = useAdminUpdateCaseStudy({ onSuccess: () => { qc.invalidateQueries({ queryKey: getListCaseStudiesQueryKey() }); setOpen(false) } })
  const deleteM = useAdminDeleteCaseStudy({ onSuccess: () => qc.invalidateQueries({ queryKey: getListCaseStudiesQueryKey() }) })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState<CaseStudyForm>(EMPTY_CS)
  const f = (k: keyof CaseStudyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  function openEdit(item: typeof items[0]) {
    setEditing(item.id)
    setForm({ title: item.title, slug: item.slug, client: item.client, summary: item.summary, challenge: item.challenge, solution: item.solution, result: item.result, imageUrl: item.imageUrl, metricLabel: item.metricLabel, metricValue: item.metricValue, sortOrder: String(item.sortOrder) })
    setOpen(true)
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const body = { ...form, sortOrder: Number(form.sortOrder) }
    editing !== null ? updateM.mutate({ id: editing, body }) : createM.mutate(body)
  }

  return (
    <div>
      <SectionHeader title="Case Studies" action={<AddBtn label="Add Case Study" onClick={() => { setEditing(null); setForm(EMPTY_CS); setOpen(true) }} />} />
      <div className="bg-[#050505] border border-white/10">
        {items.length === 0 ? <p className="p-6 text-neutral-500 text-sm">No case studies yet.</p> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Title</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Client</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Metric</th>
              <th className="p-4 w-20"></th>
            </tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="p-4 text-white">{item.title}</td>
                  <td className="p-4 text-neutral-400">{item.client}</td>
                  <td className="p-4 text-neutral-400">{item.metricValue} {item.metricLabel}</td>
                  <td className="p-4"><RowActions onEdit={() => openEdit(item)} onDelete={() => { if (confirmDelete(item.title)) deleteM.mutate(item.id) }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#050505] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">{editing !== null ? "Edit Case Study" : "Add Case Study"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Title"><Input className={inputCls} value={form.title} onChange={f("title")} required /></FormField>
              <FormField label="Slug"><Input className={inputCls} value={form.slug} onChange={f("slug")} required /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Client"><Input className={inputCls} value={form.client} onChange={f("client")} required /></FormField>
              <FormField label="Sort Order"><Input className={inputCls} type="number" value={form.sortOrder} onChange={f("sortOrder")} /></FormField>
            </div>
            <FormField label="Summary"><Textarea className={inputCls} value={form.summary} onChange={f("summary")} rows={2} required /></FormField>
            <FormField label="Challenge"><Textarea className={inputCls} value={form.challenge} onChange={f("challenge")} rows={3} required /></FormField>
            <FormField label="Solution"><Textarea className={inputCls} value={form.solution} onChange={f("solution")} rows={3} required /></FormField>
            <FormField label="Result"><Textarea className={inputCls} value={form.result} onChange={f("result")} rows={3} required /></FormField>
            <FormField label="Image URL"><ImageUpload value={form.imageUrl} onChange={url => setForm(p => ({ ...p, imageUrl: url }))} /></FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Metric Label"><Input className={inputCls} value={form.metricLabel} onChange={f("metricLabel")} placeholder="Growth" /></FormField>
              <FormField label="Metric Value"><Input className={inputCls} value={form.metricValue} onChange={f("metricValue")} placeholder="340%" /></FormField>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-white text-black hover:bg-neutral-200">Save</Button>
              <Button type="button" variant="outline" className="border-white/10 text-white hover:bg-white/5" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================================================
// Testimonials Section
// ============================================================================

type TestimonialForm = { name: string; role: string; company: string; quote: string; avatarUrl: string; sortOrder: string }
const EMPTY_TESTIMONIAL: TestimonialForm = { name: "", role: "", company: "", quote: "", avatarUrl: "", sortOrder: "0" }

function TestimonialsSection() {
  const qc = useQueryClient()
  const { data: items = [] } = useListTestimonials()
  const createM = useAdminCreateTestimonial({ onSuccess: () => { qc.invalidateQueries({ queryKey: getListTestimonialsQueryKey() }); setOpen(false) } })
  const updateM = useAdminUpdateTestimonial({ onSuccess: () => { qc.invalidateQueries({ queryKey: getListTestimonialsQueryKey() }); setOpen(false) } })
  const deleteM = useAdminDeleteTestimonial({ onSuccess: () => qc.invalidateQueries({ queryKey: getListTestimonialsQueryKey() }) })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState<TestimonialForm>(EMPTY_TESTIMONIAL)
  const f = (k: keyof TestimonialForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  function openEdit(item: typeof items[0]) { setEditing(item.id); setForm({ name: item.name, role: item.role, company: item.company, quote: item.quote, avatarUrl: item.avatarUrl, sortOrder: String(item.sortOrder) }); setOpen(true) }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const body = { name: form.name, role: form.role, company: form.company, quote: form.quote, avatarUrl: form.avatarUrl, sortOrder: Number(form.sortOrder) }
    editing !== null ? updateM.mutate({ id: editing, body }) : createM.mutate(body)
  }

  return (
    <div>
      <SectionHeader title="Testimonials" action={<AddBtn label="Add Testimonial" onClick={() => { setEditing(null); setForm(EMPTY_TESTIMONIAL); setOpen(true) }} />} />
      <div className="bg-[#050505] border border-white/10">
        {items.length === 0 ? <p className="p-6 text-neutral-500 text-sm">No testimonials yet.</p> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Name</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Role</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Company</th>
              <th className="p-4 w-20"></th>
            </tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="p-4 text-white">{item.name}</td>
                  <td className="p-4 text-neutral-400">{item.role}</td>
                  <td className="p-4 text-neutral-400">{item.company}</td>
                  <td className="p-4"><RowActions onEdit={() => openEdit(item)} onDelete={() => { if (confirmDelete(item.name)) deleteM.mutate(item.id) }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#050505] border-white/10 text-white max-w-lg">
          <DialogHeader><DialogTitle className="font-display">{editing !== null ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Name"><Input className={inputCls} value={form.name} onChange={f("name")} required /></FormField>
              <FormField label="Role"><Input className={inputCls} value={form.role} onChange={f("role")} required /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Company"><Input className={inputCls} value={form.company} onChange={f("company")} required /></FormField>
              <FormField label="Sort Order"><Input className={inputCls} type="number" value={form.sortOrder} onChange={f("sortOrder")} /></FormField>
            </div>
            <FormField label="Quote"><Textarea className={inputCls} value={form.quote} onChange={f("quote")} rows={4} required /></FormField>
            <FormField label="Avatar URL"><Input className={inputCls} value={form.avatarUrl} onChange={f("avatarUrl")} placeholder="https://…" /></FormField>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-white text-black hover:bg-neutral-200">Save</Button>
              <Button type="button" variant="outline" className="border-white/10 text-white hover:bg-white/5" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================================================
// Blog Posts Section
// ============================================================================

type BlogForm = { title: string; slug: string; excerpt: string; content: string; coverImageUrl: string; author: string; category: string; publishedAt: string }
const EMPTY_BLOG: BlogForm = { title: "", slug: "", excerpt: "", content: "", coverImageUrl: "", author: "", category: "", publishedAt: new Date().toISOString().split("T")[0] }

function BlogSection() {
  const qc = useQueryClient()
  const { data: items = [] } = useListBlogPosts()
  const createM = useAdminCreateBlogPost({ onSuccess: () => { qc.invalidateQueries({ queryKey: getListBlogPostsQueryKey() }); setOpen(false) } })
  const updateM = useAdminUpdateBlogPost({ onSuccess: () => { qc.invalidateQueries({ queryKey: getListBlogPostsQueryKey() }); setOpen(false) } })
  const deleteM = useAdminDeleteBlogPost({ onSuccess: () => qc.invalidateQueries({ queryKey: getListBlogPostsQueryKey() }) })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState<BlogForm>(EMPTY_BLOG)
  const f = (k: keyof BlogForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  function openEdit(item: typeof items[0]) { setEditing(item.id); setForm({ title: item.title, slug: item.slug, excerpt: item.excerpt, content: item.content, coverImageUrl: item.coverImageUrl, author: item.author, category: item.category, publishedAt: item.publishedAt ? String(item.publishedAt).split("T")[0] : EMPTY_BLOG.publishedAt }); setOpen(true) }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const body = { ...form, publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : undefined }
    editing !== null ? updateM.mutate({ id: editing, body }) : createM.mutate(body)
  }

  return (
    <div>
      <SectionHeader title="Blog Posts" action={<AddBtn label="Add Post" onClick={() => { setEditing(null); setForm(EMPTY_BLOG); setOpen(true) }} />} />
      <div className="bg-[#050505] border border-white/10">
        {items.length === 0 ? <p className="p-6 text-neutral-500 text-sm">No posts yet.</p> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Title</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Author</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Category</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Published</th>
              <th className="p-4 w-20"></th>
            </tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="p-4 text-white">{item.title}</td>
                  <td className="p-4 text-neutral-400">{item.author}</td>
                  <td className="p-4 text-neutral-400">{item.category}</td>
                  <td className="p-4 text-neutral-400 text-xs">{item.publishedAt ? format(new Date(item.publishedAt), "MMM d, yyyy") : "—"}</td>
                  <td className="p-4"><RowActions onEdit={() => openEdit(item)} onDelete={() => { if (confirmDelete(item.title)) deleteM.mutate(item.id) }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#050505] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">{editing !== null ? "Edit Post" : "Add Post"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Title"><Input className={inputCls} value={form.title} onChange={f("title")} required /></FormField>
              <FormField label="Slug"><Input className={inputCls} value={form.slug} onChange={f("slug")} required /></FormField>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Author"><Input className={inputCls} value={form.author} onChange={f("author")} required /></FormField>
              <FormField label="Category"><Input className={inputCls} value={form.category} onChange={f("category")} required /></FormField>
              <FormField label="Published At"><Input className={`${inputCls} [color-scheme:dark]`} type="date" value={form.publishedAt} onChange={f("publishedAt")} /></FormField>
            </div>
            <FormField label="Excerpt"><Textarea className={inputCls} value={form.excerpt} onChange={f("excerpt")} rows={2} required /></FormField>
            <FormField label="Cover Image URL"><ImageUpload value={form.coverImageUrl} onChange={url => setForm(p => ({ ...p, coverImageUrl: url }))} /></FormField>
            <FormField label="Content (Markdown / HTML)"><Textarea className={`${inputCls} font-mono text-xs`} value={form.content} onChange={f("content")} rows={10} required /></FormField>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-white text-black hover:bg-neutral-200">Save</Button>
              <Button type="button" variant="outline" className="border-white/10 text-white hover:bg-white/5" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================================================
// Pricing Section
// ============================================================================

type PricingForm = { name: string; tagline: string; price: string; billingNote: string; features: string; isFeatured: boolean; sortOrder: string }
const EMPTY_PRICING: PricingForm = { name: "", tagline: "", price: "", billingNote: "", features: "", isFeatured: false, sortOrder: "0" }

function PricingSection() {
  const qc = useQueryClient()
  const { data: items = [] } = useListPricingPlans()
  const createM = useAdminCreatePricingPlan({ onSuccess: () => { qc.invalidateQueries({ queryKey: getListPricingPlansQueryKey() }); setOpen(false) } })
  const updateM = useAdminUpdatePricingPlan({ onSuccess: () => { qc.invalidateQueries({ queryKey: getListPricingPlansQueryKey() }); setOpen(false) } })
  const deleteM = useAdminDeletePricingPlan({ onSuccess: () => qc.invalidateQueries({ queryKey: getListPricingPlansQueryKey() }) })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState<PricingForm>(EMPTY_PRICING)
  const f = (k: keyof PricingForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  function openEdit(item: typeof items[0]) { setEditing(item.id); setForm({ name: item.name, tagline: item.tagline, price: item.price, billingNote: item.billingNote, features: item.features.join("\n"), isFeatured: item.isFeatured, sortOrder: String(item.sortOrder) }); setOpen(true) }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const body = { name: form.name, tagline: form.tagline, price: form.price, billingNote: form.billingNote, features: form.features.split("\n").map(t => t.trim()).filter(Boolean), isFeatured: form.isFeatured, sortOrder: Number(form.sortOrder) }
    editing !== null ? updateM.mutate({ id: editing, body }) : createM.mutate(body)
  }

  return (
    <div>
      <SectionHeader title="Pricing Plans" action={<AddBtn label="Add Plan" onClick={() => { setEditing(null); setForm(EMPTY_PRICING); setOpen(true) }} />} />
      <div className="bg-[#050505] border border-white/10">
        {items.length === 0 ? <p className="p-6 text-neutral-500 text-sm">No plans yet.</p> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Name</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Price</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Featured</th>
              <th className="p-4 w-20"></th>
            </tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="p-4 text-white">{item.name}</td>
                  <td className="p-4 text-neutral-400">{item.price}</td>
                  <td className="p-4">{item.isFeatured ? <span className="text-xs border border-white/20 text-white px-2 py-0.5">Yes</span> : <span className="text-neutral-600 text-xs">—</span>}</td>
                  <td className="p-4"><RowActions onEdit={() => openEdit(item)} onDelete={() => { if (confirmDelete(item.name)) deleteM.mutate(item.id) }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#050505] border-white/10 text-white max-w-lg">
          <DialogHeader><DialogTitle className="font-display">{editing !== null ? "Edit Plan" : "Add Plan"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Name"><Input className={inputCls} value={form.name} onChange={f("name")} required /></FormField>
              <FormField label="Price"><Input className={inputCls} value={form.price} onChange={f("price")} placeholder="$5,000" required /></FormField>
            </div>
            <FormField label="Tagline"><Input className={inputCls} value={form.tagline} onChange={f("tagline")} required /></FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Billing Note"><Input className={inputCls} value={form.billingNote} onChange={f("billingNote")} placeholder="per month" /></FormField>
              <FormField label="Sort Order"><Input className={inputCls} type="number" value={form.sortOrder} onChange={f("sortOrder")} /></FormField>
            </div>
            <FormField label="Features (one per line)"><Textarea className={`${inputCls} font-mono text-xs`} value={form.features} onChange={f("features")} rows={6} placeholder={"Unlimited revisions\nDedicated support\n24h turnaround"} /></FormField>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))} className="accent-white" />
              <span className="text-sm text-neutral-300">Featured plan</span>
            </label>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-white text-black hover:bg-neutral-200">Save</Button>
              <Button type="button" variant="outline" className="border-white/10 text-white hover:bg-white/5" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================================================
// FAQ Section
// ============================================================================

type FaqForm = { question: string; answer: string; category: string; sortOrder: string }
const EMPTY_FAQ: FaqForm = { question: "", answer: "", category: "", sortOrder: "0" }

function FaqSection() {
  const qc = useQueryClient()
  const { data: items = [] } = useListFaqItems()
  const createM = useCreateFaqItem({ onSuccess: () => { qc.invalidateQueries({ queryKey: getListFaqItemsQueryKey() }); setOpen(false) } })
  const updateM = useUpdateFaqItem({ onSuccess: () => { qc.invalidateQueries({ queryKey: getListFaqItemsQueryKey() }); setOpen(false) } })
  const deleteM = useDeleteFaqItem({ onSuccess: () => qc.invalidateQueries({ queryKey: getListFaqItemsQueryKey() }) })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState<FaqForm>(EMPTY_FAQ)
  const f = (k: keyof FaqForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  function openEdit(item: typeof items[0]) { setEditing(item.id); setForm({ question: item.question, answer: item.answer, category: item.category, sortOrder: String(item.sortOrder) }); setOpen(true) }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const body = { question: form.question, answer: form.answer, category: form.category, sortOrder: Number(form.sortOrder) }
    editing !== null ? updateM.mutate({ id: editing, body }) : createM.mutate(body)
  }

  return (
    <div>
      <SectionHeader title="FAQ" action={<AddBtn label="Add FAQ" onClick={() => { setEditing(null); setForm(EMPTY_FAQ); setOpen(true) }} />} />
      <div className="bg-[#050505] border border-white/10">
        {items.length === 0 ? <p className="p-6 text-neutral-500 text-sm">No FAQ items yet.</p> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Question</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Category</th>
              <th className="p-4 w-20"></th>
            </tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="p-4 text-white">{item.question}</td>
                  <td className="p-4 text-neutral-400">{item.category || "—"}</td>
                  <td className="p-4"><RowActions onEdit={() => openEdit(item)} onDelete={() => { if (confirmDelete(item.question)) deleteM.mutate(item.id) }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#050505] border-white/10 text-white max-w-lg">
          <DialogHeader><DialogTitle className="font-display">{editing !== null ? "Edit FAQ" : "Add FAQ"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Category"><Input className={inputCls} value={form.category} onChange={f("category")} placeholder="General" /></FormField>
              <FormField label="Sort Order"><Input className={inputCls} type="number" value={form.sortOrder} onChange={f("sortOrder")} /></FormField>
            </div>
            <FormField label="Question"><Textarea className={inputCls} value={form.question} onChange={f("question")} rows={2} required /></FormField>
            <FormField label="Answer"><Textarea className={inputCls} value={form.answer} onChange={f("answer")} rows={5} required /></FormField>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-white text-black hover:bg-neutral-200">Save</Button>
              <Button type="button" variant="outline" className="border-white/10 text-white hover:bg-white/5" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================================================
// Team Section
// ============================================================================

type TeamForm = { name: string; role: string; bio: string; avatarUrl: string; linkedinUrl: string; sortOrder: string }
const EMPTY_TEAM: TeamForm = { name: "", role: "", bio: "", avatarUrl: "", linkedinUrl: "", sortOrder: "0" }

function TeamSection() {
  const qc = useQueryClient()
  const { data: items = [] } = useListTeamMembers()
  const createM = useCreateTeamMember({ onSuccess: () => { qc.invalidateQueries({ queryKey: getListTeamMembersQueryKey() }); setOpen(false) } })
  const updateM = useUpdateTeamMember({ onSuccess: () => { qc.invalidateQueries({ queryKey: getListTeamMembersQueryKey() }); setOpen(false) } })
  const deleteM = useDeleteTeamMember({ onSuccess: () => qc.invalidateQueries({ queryKey: getListTeamMembersQueryKey() }) })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState<TeamForm>(EMPTY_TEAM)
  const f = (k: keyof TeamForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  function openEdit(item: typeof items[0]) { setEditing(item.id); setForm({ name: item.name, role: item.role, bio: item.bio, avatarUrl: item.avatarUrl, linkedinUrl: item.linkedinUrl, sortOrder: String(item.sortOrder) }); setOpen(true) }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const body = { name: form.name, role: form.role, bio: form.bio, avatarUrl: form.avatarUrl, linkedinUrl: form.linkedinUrl, sortOrder: Number(form.sortOrder) }
    editing !== null ? updateM.mutate({ id: editing, body }) : createM.mutate(body)
  }

  return (
    <div>
      <SectionHeader title="Team" action={<AddBtn label="Add Member" onClick={() => { setEditing(null); setForm(EMPTY_TEAM); setOpen(true) }} />} />
      <div className="bg-[#050505] border border-white/10">
        {items.length === 0 ? <p className="p-6 text-neutral-500 text-sm">No team members yet.</p> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Name</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Role</th>
              <th className="p-4 w-20"></th>
            </tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="p-4 text-white">{item.name}</td>
                  <td className="p-4 text-neutral-400">{item.role}</td>
                  <td className="p-4"><RowActions onEdit={() => openEdit(item)} onDelete={() => { if (confirmDelete(item.name)) deleteM.mutate(item.id) }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#050505] border-white/10 text-white max-w-lg">
          <DialogHeader><DialogTitle className="font-display">{editing !== null ? "Edit Team Member" : "Add Team Member"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Name"><Input className={inputCls} value={form.name} onChange={f("name")} required /></FormField>
              <FormField label="Role"><Input className={inputCls} value={form.role} onChange={f("role")} required /></FormField>
            </div>
            <FormField label="Bio"><Textarea className={inputCls} value={form.bio} onChange={f("bio")} rows={3} /></FormField>
            <FormField label="Avatar URL"><Input className={inputCls} value={form.avatarUrl} onChange={f("avatarUrl")} placeholder="https://…" /></FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="LinkedIn URL"><Input className={inputCls} value={form.linkedinUrl} onChange={f("linkedinUrl")} placeholder="https://linkedin.com/in/…" /></FormField>
              <FormField label="Sort Order"><Input className={inputCls} type="number" value={form.sortOrder} onChange={f("sortOrder")} /></FormField>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-white text-black hover:bg-neutral-200">Save</Button>
              <Button type="button" variant="outline" className="border-white/10 text-white hover:bg-white/5" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================================================
// Clients Section
// ============================================================================

type ClientForm = { name: string; logoUrl: string; websiteUrl: string; sortOrder: string }
const EMPTY_CLIENT: ClientForm = { name: "", logoUrl: "", websiteUrl: "", sortOrder: "0" }

function ClientsSection() {
  const qc = useQueryClient()
  const { data: items = [] } = useListClients()
  const createM = useCreateClient({ onSuccess: () => { qc.invalidateQueries({ queryKey: getListClientsQueryKey() }); setOpen(false) } })
  const updateM = useUpdateClient({ onSuccess: () => { qc.invalidateQueries({ queryKey: getListClientsQueryKey() }); setOpen(false) } })
  const deleteM = useDeleteClient({ onSuccess: () => qc.invalidateQueries({ queryKey: getListClientsQueryKey() }) })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState<ClientForm>(EMPTY_CLIENT)
  const f = (k: keyof ClientForm) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  function openEdit(item: typeof items[0]) { setEditing(item.id); setForm({ name: item.name, logoUrl: item.logoUrl, websiteUrl: item.websiteUrl, sortOrder: String(item.sortOrder) }); setOpen(true) }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const body = { name: form.name, logoUrl: form.logoUrl, websiteUrl: form.websiteUrl, sortOrder: Number(form.sortOrder) }
    editing !== null ? updateM.mutate({ id: editing, body }) : createM.mutate(body)
  }

  return (
    <div>
      <SectionHeader title="Clients" action={<AddBtn label="Add Client" onClick={() => { setEditing(null); setForm(EMPTY_CLIENT); setOpen(true) }} />} />
      <div className="bg-[#050505] border border-white/10">
        {items.length === 0 ? <p className="p-6 text-neutral-500 text-sm">No clients yet.</p> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Name</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Website</th>
              <th className="p-4 w-20"></th>
            </tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="p-4 text-white">{item.name}</td>
                  <td className="p-4 text-neutral-400 text-xs truncate max-w-xs">{item.websiteUrl || "—"}</td>
                  <td className="p-4"><RowActions onEdit={() => openEdit(item)} onDelete={() => { if (confirmDelete(item.name)) deleteM.mutate(item.id) }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#050505] border-white/10 text-white max-w-md">
          <DialogHeader><DialogTitle className="font-display">{editing !== null ? "Edit Client" : "Add Client"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <FormField label="Name"><Input className={inputCls} value={form.name} onChange={f("name")} required /></FormField>
            <FormField label="Logo URL"><ImageUpload value={form.logoUrl} onChange={url => setForm(p => ({ ...p, logoUrl: url }))} /></FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Website URL"><Input className={inputCls} value={form.websiteUrl} onChange={f("websiteUrl")} placeholder="https://…" /></FormField>
              <FormField label="Sort Order"><Input className={inputCls} type="number" value={form.sortOrder} onChange={f("sortOrder")} /></FormField>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-white text-black hover:bg-neutral-200">Save</Button>
              <Button type="button" variant="outline" className="border-white/10 text-white hover:bg-white/5" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================================================
// Contacts Section (CRM)
// ============================================================================

function ContactsSection() {
  const qc = useQueryClient()
  const { data: submissions = [] } = useListContactSubmissions()
  const updateM = useUpdateContactSubmission({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListContactSubmissionsQueryKey() }) } })

  return (
    <div>
      <SectionHeader title="Contact Submissions" />
      <div className="bg-[#050505] border border-white/10 overflow-x-auto">
        {submissions.length === 0 ? <p className="p-6 text-neutral-500 text-sm">No submissions yet.</p> : (
          <table className="w-full text-sm min-w-[700px]">
            <thead><tr className="border-b border-white/10">
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Name</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Email</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Budget</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Date</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider w-40">Status</th>
            </tr></thead>
            <tbody>
              {submissions.map(s => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="p-4 text-white">{s.name}</td>
                  <td className="p-4 text-neutral-400">{s.email}</td>
                  <td className="p-4 text-neutral-400">{s.budget ?? "—"}</td>
                  <td className="p-4 text-neutral-400 text-xs">{format(new Date(s.createdAt), "MMM d, yyyy")}</td>
                  <td className="p-4">
                    <Select value={s.status} onValueChange={status => updateM.mutate({ id: s.id, data: { status: status as any } })}>
                      <SelectTrigger className="h-8 bg-black border-white/10 text-white text-xs w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#050505] border-white/10">
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Bookings Section (CRM)
// ============================================================================

function BookingsSection() {
  const qc = useQueryClient()
  const { data: bookings = [] } = useListBookings()
  const updateM = useUpdateBooking({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListBookingsQueryKey() }) } })

  return (
    <div>
      <SectionHeader title="Bookings" />
      <div className="bg-[#050505] border border-white/10 overflow-x-auto">
        {bookings.length === 0 ? <p className="p-6 text-neutral-500 text-sm">No bookings yet.</p> : (
          <table className="w-full text-sm min-w-[800px]">
            <thead><tr className="border-b border-white/10">
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Name</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Email</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Service</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Date</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider w-44">Status</th>
            </tr></thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="p-4 text-white">{b.name}</td>
                  <td className="p-4 text-neutral-400">{b.email}</td>
                  <td className="p-4 text-neutral-400">{b.service}</td>
                  <td className="p-4 text-neutral-400 text-xs">{format(new Date(b.preferredDate), "MMM d, yyyy")}</td>
                  <td className="p-4">
                    <Select value={b.status} onValueChange={status => updateM.mutate({ id: b.id, data: { status: status as any } })}>
                      <SelectTrigger className="h-8 bg-black border-white/10 text-white text-xs w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#050505] border-white/10">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Favicon Upload Widget
// ============================================================================

function FaviconUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string>(value || "/favicon.png")
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    setPreview(value || "/favicon.png")
  }, [value])

  function processFile(file: File) {
    if (!file.type.startsWith("image/")) return
    const img = new window.Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      // Resize to 128×128 using canvas so the base64 stays small
      const canvas = document.createElement("canvas")
      canvas.width = 128
      canvas.height = 128
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, 128, 128)
      URL.revokeObjectURL(objectUrl)
      const dataUrl = canvas.toDataURL("image/png", 0.95)
      setPreview(dataUrl)
      onChange(dataUrl)
    }
    img.src = objectUrl
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    // Reset so the same file can be re-selected
    e.target.value = ""
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const hasCustom = value && value !== "/favicon.png"

  return (
    <div className="flex items-start gap-5">
      {/* Preview box */}
      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 rounded-xl border border-white/10 bg-black overflow-hidden flex items-center justify-center shadow-lg">
          <img
            src={preview}
            alt="Current favicon"
            className="w-14 h-14 object-contain"
            onError={() => setPreview("/favicon.png")}
          />
        </div>
        {hasCustom && (
          <button
            type="button"
            onClick={() => { setPreview("/favicon.png"); onChange("") }}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-neutral-700 border border-white/10 flex items-center justify-center hover:bg-red-900/60 transition-colors"
            title="Reset to default"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        )}
      </div>

      {/* Drop zone + button */}
      <div className="flex-1">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border border-dashed rounded-[2px] p-5 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
            dragOver ? "border-white/40 bg-white/5" : "border-white/10 hover:border-white/20"
          }`}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="w-5 h-5 text-neutral-500" />
          <div className="text-center">
            <p className="text-xs text-neutral-300 font-medium">Drop an image or click to upload</p>
            <p className="text-[10px] text-neutral-600 mt-1">PNG · JPG · SVG · WEBP — resized to 128 × 128</p>
          </div>
        </div>
        {hasCustom && (
          <p className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Custom favicon active — save settings to apply
          </p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>
    </div>
  )
}

// ============================================================================
// Site Settings Section
// ============================================================================

const DEFAULT_SITE_SETTINGS: Record<string, string> = {
  siteName: "Darklightz Studio", tagline: "", logoText: "DARKLIGHTZ", logoUrl: "",
  contactEmail: "", contactPhone: "", contactAddress: "", whatsappNumber: "+923351468615",
  seoTitle: "Darklightz Studio", seoDescription: "", ogImageUrl: "", faviconUrl: "",
  heroTitle: "", heroSubtitle: "", heroCtaText: "", heroCtaUrl: "",
  primaryColor: "#ffffff", accentColor: "#ffffff", fontHeading: "Syne", fontBody: "Plus Jakarta Sans",
}

function SiteSettingsSection() {
  const qc = useQueryClient()
  const { data: settings, isLoading, isError } = useGetSiteSettings()
  const updateM = useUpdateSiteSettings({ onSuccess: () => qc.invalidateQueries({ queryKey: getSiteSettingsQueryKey() }) })
  const [form, setForm] = useState<Record<string, string>>(DEFAULT_SITE_SETTINGS)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (settings) {
      setForm({
        siteName: settings.siteName, tagline: settings.tagline,
        logoText: settings.logoText, logoUrl: settings.logoUrl,
        contactEmail: settings.contactEmail, contactPhone: settings.contactPhone,
        contactAddress: settings.contactAddress,
        whatsappNumber: (settings as any).whatsappNumber ?? "+923351468615",
        seoTitle: settings.seoTitle, seoDescription: settings.seoDescription, ogImageUrl: settings.ogImageUrl, faviconUrl: settings.faviconUrl,
        heroTitle: settings.heroTitle, heroSubtitle: settings.heroSubtitle, heroCtaText: settings.heroCtaText, heroCtaUrl: settings.heroCtaUrl,
        primaryColor: settings.primaryColor, accentColor: settings.accentColor, fontHeading: settings.fontHeading, fontBody: settings.fontBody,
      })
    }
  }, [settings])

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateM.mutate(form as any, { onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 2000) } })
  }

  if (isLoading) return <p className="text-neutral-500 text-sm">Loading…</p>

  return (
    <div>
      <SectionHeader title="Site Settings" />
      {isError && (
        <div className="mb-6 p-4 border border-yellow-500/30 bg-yellow-500/5 rounded-[2px] text-xs text-yellow-400">
          Could not load saved settings from the database — showing defaults. Changes will be saved once DATABASE_URL is configured in Vercel.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">

        <div className="bg-[#050505] border border-white/10 p-6 space-y-4">
          <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">Identity</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Site Name"><Input className={inputCls} value={form.siteName ?? ""} onChange={f("siteName")} /></FormField>
            <FormField label="Logo Text"><Input className={inputCls} value={form.logoText ?? ""} onChange={f("logoText")} /></FormField>
          </div>
          <FormField label="Tagline"><Input className={inputCls} value={form.tagline ?? ""} onChange={f("tagline")} /></FormField>
          <FormField label="Logo URL"><ImageUpload value={form.logoUrl ?? ""} onChange={url => setForm(p => ({ ...p, logoUrl: url }))} /></FormField>
        </div>

        <div className="bg-[#050505] border border-white/10 p-6 space-y-4">
          <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">Contact</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Email"><Input className={inputCls} value={form.contactEmail ?? ""} onChange={f("contactEmail")} /></FormField>
            <FormField label="Phone"><Input className={inputCls} value={form.contactPhone ?? ""} onChange={f("contactPhone")} /></FormField>
          </div>
          <FormField label="WhatsApp Number">
            <Input className={inputCls} value={form.whatsappNumber ?? ""} onChange={f("whatsappNumber")} placeholder="+923351468615" />
          </FormField>
          <FormField label="Address"><Input className={inputCls} value={form.contactAddress ?? ""} onChange={f("contactAddress")} /></FormField>
        </div>

        <div className="bg-[#050505] border border-white/10 p-6 space-y-4">
          <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">SEO</h3>
          <FormField label="SEO Title"><Input className={inputCls} value={form.seoTitle ?? ""} onChange={f("seoTitle")} /></FormField>
          <FormField label="SEO Description"><Textarea className={inputCls} value={form.seoDescription ?? ""} onChange={f("seoDescription")} rows={3} /></FormField>
          <FormField label="OG Image URL"><ImageUpload value={form.ogImageUrl ?? ""} onChange={url => setForm(p => ({ ...p, ogImageUrl: url }))} /></FormField>
          <FormField label="Favicon">
            <ImageUpload
              value={form.faviconUrl ?? ""}
              onChange={url => setForm(p => ({ ...p, faviconUrl: url }))}
            />
          </FormField>
        </div>

        <div className="bg-[#050505] border border-white/10 p-6 space-y-4">
          <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">Hero</h3>
          <FormField label="Hero Title"><Input className={inputCls} value={form.heroTitle ?? ""} onChange={f("heroTitle")} /></FormField>
          <FormField label="Hero Subtitle"><Textarea className={inputCls} value={form.heroSubtitle ?? ""} onChange={f("heroSubtitle")} rows={2} /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="CTA Text"><Input className={inputCls} value={form.heroCtaText ?? ""} onChange={f("heroCtaText")} /></FormField>
            <FormField label="CTA URL"><Input className={inputCls} value={form.heroCtaUrl ?? ""} onChange={f("heroCtaUrl")} placeholder="/contact" /></FormField>
          </div>
        </div>

        <div className="bg-[#050505] border border-white/10 p-6 space-y-4">
          <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">Theme</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Primary Color"><Input className={inputCls} value={form.primaryColor ?? ""} onChange={f("primaryColor")} placeholder="#ffffff" /></FormField>
            <FormField label="Accent Color"><Input className={inputCls} value={form.accentColor ?? ""} onChange={f("accentColor")} placeholder="#ffffff" /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Heading Font"><Input className={inputCls} value={form.fontHeading ?? ""} onChange={f("fontHeading")} placeholder="Syne" /></FormField>
            <FormField label="Body Font"><Input className={inputCls} value={form.fontBody ?? ""} onChange={f("fontBody")} placeholder="Plus Jakarta Sans" /></FormField>
          </div>
        </div>

        <Button type="submit" disabled={updateM.isPending} className="bg-white text-black hover:bg-neutral-200 gap-2">
          <Save className="w-4 h-4" />
          {saved ? "Saved" : updateM.isPending ? "Saving…" : "Save Settings"}
        </Button>
      </form>
    </div>
  )
}

// ============================================================================
// Social Links Section
// ============================================================================

type SocialForm = { platform: string; url: string; icon: string; sortOrder: string }
const EMPTY_SOCIAL: SocialForm = { platform: "", url: "", icon: "", sortOrder: "0" }

function SocialLinksSection() {
  const qc = useQueryClient()
  const { data: items = [] } = useListSocialLinks()
  const createM = useCreateSocialLink({ onSuccess: () => { qc.invalidateQueries({ queryKey: getListSocialLinksQueryKey() }); setOpen(false) } })
  const updateM = useUpdateSocialLink({ onSuccess: () => { qc.invalidateQueries({ queryKey: getListSocialLinksQueryKey() }); setOpen(false) } })
  const deleteM = useDeleteSocialLink({ onSuccess: () => qc.invalidateQueries({ queryKey: getListSocialLinksQueryKey() }) })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState<SocialForm>(EMPTY_SOCIAL)
  const f = (k: keyof SocialForm) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  function openEdit(item: typeof items[0]) { setEditing(item.id); setForm({ platform: item.platform, url: item.url, icon: item.icon, sortOrder: String(item.sortOrder) }); setOpen(true) }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const body = { platform: form.platform, url: form.url, icon: form.icon, sortOrder: Number(form.sortOrder) }
    editing !== null ? updateM.mutate({ id: editing, body }) : createM.mutate(body)
  }

  return (
    <div>
      <SectionHeader title="Social Links" action={<AddBtn label="Add Link" onClick={() => { setEditing(null); setForm(EMPTY_SOCIAL); setOpen(true) }} />} />
      <div className="bg-[#050505] border border-white/10">
        {items.length === 0 ? <p className="p-6 text-neutral-500 text-sm">No social links yet.</p> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">Platform</th>
              <th className="text-left p-4 text-xs text-neutral-500 font-medium uppercase tracking-wider">URL</th>
              <th className="p-4 w-20"></th>
            </tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="p-4 text-white">{item.platform}</td>
                  <td className="p-4 text-neutral-400 text-xs truncate max-w-xs">{item.url}</td>
                  <td className="p-4"><RowActions onEdit={() => openEdit(item)} onDelete={() => { if (confirmDelete(item.platform)) deleteM.mutate(item.id) }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#050505] border-white/10 text-white max-w-md">
          <DialogHeader><DialogTitle className="font-display">{editing !== null ? "Edit Social Link" : "Add Social Link"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Platform"><Input className={inputCls} value={form.platform} onChange={f("platform")} placeholder="Twitter" required /></FormField>
              <FormField label="Icon"><Input className={inputCls} value={form.icon} onChange={f("icon")} placeholder="twitter" /></FormField>
            </div>
            <FormField label="URL"><Input className={inputCls} value={form.url} onChange={f("url")} placeholder="https://twitter.com/…" required /></FormField>
            <FormField label="Sort Order"><Input className={inputCls} type="number" value={form.sortOrder} onChange={f("sortOrder")} /></FormField>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-white text-black hover:bg-neutral-200">Save</Button>
              <Button type="button" variant="outline" className="border-white/10 text-white hover:bg-white/5" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================================================
// Portal CRM Section — Client Portal management
// ============================================================================

interface PortalClient {
  id: number; supabaseUserId: string; email: string; name: string;
  company: string; phone: string; createdAt: string;
}
interface PortalProject {
  id: number; portalUserId: number; title: string; orderId: string;
  serviceName: string; assignedTeamMember: string; status: string;
  progressPct: number; startDate: string; estCompletionDate: string;
  latestUpdate: string; createdAt: string;
}
interface PortalClientDetail extends PortalClient { projects: PortalProject[] }
interface PortalMessage { id: number; portalUserId: number; sender: string; body: string; isRead: boolean; createdAt: string; projectId: number|null }
interface PortalRevision { id: number; projectId: number; portalUserId: number; description: string; status: string; createdAt: string }
interface PortalTicket { id: number; portalUserId: number; subject: string; body: string; status: string; createdAt: string }
interface PortalInvoice { id: number; portalUserId: number; title: string; amountCents: number; currency: string; status: string; createdAt: string }

function useAdminPortal<T>(path: string, key: string | null) {
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const base = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? ""

  async function load() {
    if (!key) return
    setLoading(true)
    try {
      const r = await fetch(`${base}/api/admin/portal/${path}`, { headers: { "x-admin-key": key } })
      if (!r.ok) throw new Error(`${r.status}`)
      setData(await r.json())
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Error") }
    finally { setLoading(false) }
  }

  React.useEffect(() => { load() }, [path, key])
  return { data, loading, error, reload: load }
}

const STATUS_BADGE: Record<string, string> = {
  pending: "text-neutral-400 border-neutral-700",
  active: "text-blue-400 border-blue-900",
  in_progress: "text-amber-400 border-amber-900",
  completed: "text-green-400 border-green-900",
  cancelled: "text-red-400 border-red-900",
  open: "text-amber-400 border-amber-900",
  closed: "text-neutral-500 border-neutral-700",
  draft: "text-neutral-500 border-neutral-700",
  sent: "text-amber-400 border-amber-900",
  paid: "text-green-400 border-green-900",
  overdue: "text-red-400 border-red-900",
}
function SBadge({ s }: { s: string }) {
  return <span className={`text-[10px] font-mono uppercase px-2 py-0.5 border ${STATUS_BADGE[s] ?? "text-neutral-500 border-neutral-700"}`}>{s.replace(/_/g," ")}</span>
}

function PortalCRMSection() {
  const adminKey = sessionStorage.getItem(SESSION_KEY) ?? ""
  const base = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? ""

  const [tab, setTab] = React.useState<"clients"|"projects"|"messages"|"revisions"|"tickets"|"invoices">("clients")
  const [clients, setClients] = React.useState<PortalClient[]>([])
  const [projects, setProjects] = React.useState<PortalProject[]>([])
  const [messages, setMessages] = React.useState<PortalMessage[]>([])
  const [revisions, setRevisions] = React.useState<PortalRevision[]>([])
  const [tickets, setTickets] = React.useState<PortalTicket[]>([])
  const [invoices, setInvoices] = React.useState<PortalInvoice[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  // Selected client / project for detail
  const [selectedClient, setSelectedClient] = React.useState<PortalClientDetail | null>(null)
  const [selectedProject, setSelectedProject] = React.useState<PortalProject & { milestones?: unknown[]; files?: unknown[] } | null>(null)

  // Forms
  const [newProjectModal, setNewProjectModal] = React.useState(false)
  const [editProject, setEditProject] = React.useState<PortalProject | null>(null)
  const [msgModal, setMsgModal] = React.useState<{ userId: number; projectId?: number } | null>(null)
  const [msgBody, setMsgBody] = React.useState("")
  const [invModal, setInvModal] = React.useState<{ userId: number } | null>(null)
  const [invForm, setInvForm] = React.useState({ title: "", amountCents: "", currency: "USD", status: "sent", issuedAt: "", dueAt: "" })

  const h = { headers: { "x-admin-key": adminKey, "Content-Type": "application/json" } }

  async function apiGet<T>(path: string): Promise<T> {
    const r = await fetch(`${base}/api/admin/portal/${path}`, { headers: { "x-admin-key": adminKey } })
    if (!r.ok) throw new Error(`${r.status}`)
    return r.json()
  }
  async function apiPost<T>(path: string, body: unknown): Promise<T> {
    const r = await fetch(`${base}/api/admin/portal/${path}`, { method: "POST", ...h, body: JSON.stringify(body) })
    if (!r.ok) throw new Error(`${r.status} ${await r.text()}`)
    return r.json()
  }
  async function apiPatch<T>(path: string, body: unknown): Promise<T> {
    const r = await fetch(`${base}/api/admin/portal/${path}`, { method: "PATCH", ...h, body: JSON.stringify(body) })
    if (!r.ok) throw new Error(`${r.status} ${await r.text()}`)
    return r.json()
  }

  async function loadTab(t: typeof tab) {
    setLoading(true); setError("")
    try {
      if (t === "clients") setClients(await apiGet("clients"))
      if (t === "projects") setProjects(await apiGet("projects"))
      if (t === "messages") setMessages(await apiGet("messages"))
      if (t === "revisions") setRevisions(await apiGet("revisions"))
      if (t === "tickets") setTickets(await apiGet("tickets"))
      if (t === "invoices") setInvoices(await apiGet("invoices"))
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Error") }
    finally { setLoading(false) }
  }

  React.useEffect(() => { loadTab(tab) }, [tab])

  async function openClient(id: number) {
    const data = await apiGet<PortalClientDetail>(`clients/${id}`)
    setSelectedClient(data)
  }

  const TABS = [
    { id: "clients", label: "Clients" },
    { id: "projects", label: "Projects" },
    { id: "messages", label: "Messages" },
    { id: "revisions", label: "Revisions" },
    { id: "tickets", label: "Tickets" },
    { id: "invoices", label: "Invoices" },
  ] as const

  // ── New Project Form ────────────────────────────────────────────────────
  function NewProjectForm({ onDone }: { onDone: () => void }) {
    const clientList = clients.length ? clients : []
    const [f, setF] = React.useState({ portalUserId: "", title: "", orderId: "", serviceName: "", assignedTeamMember: "", startDate: "", estCompletionDate: "" })
    const [saving, setSaving] = React.useState(false)
    async function submit(e: React.FormEvent) {
      e.preventDefault(); setSaving(true)
      try {
        await apiPost("projects", { ...f, portalUserId: parseInt(f.portalUserId) })
        onDone(); loadTab("projects")
      } catch(e: unknown) { alert(e instanceof Error ? e.message : "Error") }
      finally { setSaving(false) }
    }
    return (
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Client</label>
            <select required value={f.portalUserId} onChange={e=>setF({...f,portalUserId:e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2">
              <option value="">Select client…</option>
              {clientList.map(c=><option key={c.id} value={c.id}>{c.name||c.email}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Project Title</label>
            <input required value={f.title} onChange={e=>setF({...f,title:e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2" placeholder="Website Redesign" />
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Order ID</label>
            <input value={f.orderId} onChange={e=>setF({...f,orderId:e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2" placeholder="ORD-001" />
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Service</label>
            <input value={f.serviceName} onChange={e=>setF({...f,serviceName:e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2" placeholder="Brand Identity" />
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Assigned To</label>
            <input value={f.assignedTeamMember} onChange={e=>setF({...f,assignedTeamMember:e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2" placeholder="Team member name" />
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Start Date</label>
            <input value={f.startDate} onChange={e=>setF({...f,startDate:e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2" placeholder="Jan 1, 2025" />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Est. Completion</label>
            <input value={f.estCompletionDate} onChange={e=>setF({...f,estCompletionDate:e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2" placeholder="Mar 31, 2025" />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={saving} className="bg-white text-black hover:bg-neutral-200 text-sm">{saving?"Creating…":"Create Project"}</Button>
          <Button type="button" variant="outline" onClick={onDone} className="border-white/15 text-neutral-400 hover:text-white">Cancel</Button>
        </div>
      </form>
    )
  }

  // ── Edit Project Progress ───────────────────────────────────────────────
  function EditProjectForm({ project, onDone }: { project: PortalProject; onDone: () => void }) {
    const [f, setF] = React.useState({
      status: project.status, progressPct: String(project.progressPct),
      latestUpdate: project.latestUpdate, assignedTeamMember: project.assignedTeamMember,
      estCompletionDate: project.estCompletionDate,
    })
    const [saving, setSaving] = React.useState(false)
    async function submit(e: React.FormEvent) {
      e.preventDefault(); setSaving(true)
      try {
        await apiPatch(`projects/${project.id}`, { ...f, progressPct: parseInt(f.progressPct) })
        onDone(); loadTab("projects")
      } catch(e: unknown) { alert(e instanceof Error ? e.message : "Error") }
      finally { setSaving(false) }
    }
    return (
      <form onSubmit={submit} className="space-y-3">
        <p className="text-sm font-semibold text-white">{project.title}</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Status</label>
            <select value={f.status} onChange={e=>setF({...f,status:e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2">
              {["pending","active","in_progress","completed","cancelled"].map(s=><option key={s} value={s}>{s.replace(/_/g," ")}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Progress %</label>
            <input type="number" min="0" max="100" value={f.progressPct} onChange={e=>setF({...f,progressPct:e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2" />
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Assigned To</label>
            <input value={f.assignedTeamMember} onChange={e=>setF({...f,assignedTeamMember:e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2" />
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Est. Completion</label>
            <input value={f.estCompletionDate} onChange={e=>setF({...f,estCompletionDate:e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2" />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Latest Update</label>
            <Textarea value={f.latestUpdate} onChange={e=>setF({...f,latestUpdate:e.target.value})} rows={2} className="w-full mt-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2 resize-none" />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={saving} className="bg-white text-black hover:bg-neutral-200 text-sm">{saving?"Saving…":"Save Changes"}</Button>
          <Button type="button" variant="outline" onClick={onDone} className="border-white/15 text-neutral-400 hover:text-white">Cancel</Button>
        </div>
      </form>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-display font-bold text-white">Client Portal CRM</h2>
          <p className="text-neutral-500 text-sm mt-1">Manage portal clients, projects, messages, and invoices.</p>
        </div>
        {tab === "projects" && (
          <Button onClick={() => { setNewProjectModal(true); loadTab("clients") }} className="bg-white text-black hover:bg-neutral-200 text-sm gap-1.5">
            <Plus className="w-3.5 h-3.5" /> New Project
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-white/10 pb-0">
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id as typeof tab); setSelectedClient(null); setEditProject(null); setNewProjectModal(false) }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${tab===t.id ? "border-white text-white" : "border-transparent text-neutral-500 hover:text-white"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      {loading && <p className="text-neutral-500 text-sm">Loading…</p>}

      {/* New project form */}
      {newProjectModal && !loading && (
        <div className="border border-white/15 bg-white/[0.03] p-6 mb-6">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Create Project</h3>
          <NewProjectForm onDone={() => setNewProjectModal(false)} />
        </div>
      )}

      {/* Edit project form */}
      {editProject && (
        <div className="border border-white/15 bg-white/[0.03] p-6 mb-6">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Update Project</h3>
          <EditProjectForm project={editProject} onDone={() => setEditProject(null)} />
        </div>
      )}

      {/* Send message modal */}
      {msgModal && (
        <div className="border border-white/15 bg-white/[0.03] p-6 mb-6">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Send Message</h3>
          <Textarea value={msgBody} onChange={e=>setMsgBody(e.target.value)} rows={3} placeholder="Write a message…" className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2 resize-none mb-3" />
          <div className="flex gap-2">
            <Button onClick={async()=>{ if(!msgBody.trim())return; await apiPost("messages",{portalUserId:msgModal.userId,projectId:msgModal.projectId,body:msgBody}); setMsgModal(null);setMsgBody(""); loadTab("messages") }} className="bg-white text-black hover:bg-neutral-200 text-sm">Send</Button>
            <Button variant="outline" onClick={()=>setMsgModal(null)} className="border-white/15 text-neutral-400 hover:text-white">Cancel</Button>
          </div>
        </div>
      )}

      {/* Invoice modal */}
      {invModal && (
        <div className="border border-white/15 bg-white/[0.03] p-6 mb-6">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Create Invoice</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {([["title","Title","Invoice for..."],["amountCents","Amount (cents)","10000"],["currency","Currency","USD"],["status","Status","sent"],["issuedAt","Issued At","2025-01-01"],["dueAt","Due At","2025-02-01"]] as const).map(([k,lbl,ph])=>(
              <div key={k}>
                <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">{lbl}</label>
                <input value={(invForm as Record<string,string>)[k]} onChange={e=>setInvForm({...invForm,[k]:e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2" placeholder={ph} />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={async()=>{ await apiPost("invoices",{portalUserId:invModal.userId,...invForm,amountCents:parseInt(invForm.amountCents||"0")}); setInvModal(null);setInvForm({title:"",amountCents:"",currency:"USD",status:"sent",issuedAt:"",dueAt:""}); loadTab("invoices") }} className="bg-white text-black hover:bg-neutral-200 text-sm">Create Invoice</Button>
            <Button variant="outline" onClick={()=>setInvModal(null)} className="border-white/15 text-neutral-400 hover:text-white">Cancel</Button>
          </div>
        </div>
      )}

      {/* Client detail panel */}
      {selectedClient && (
        <div className="border border-white/10 bg-white/[0.02] p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">{selectedClient.name||selectedClient.email}</h3>
              <p className="text-xs text-neutral-500 mt-0.5">{selectedClient.email} {selectedClient.company && `· ${selectedClient.company}`}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setMsgModal({ userId: selectedClient.id })} variant="outline" className="border-white/15 text-neutral-400 hover:text-white text-xs">Message</Button>
              <Button size="sm" onClick={() => setInvModal({ userId: selectedClient.id })} variant="outline" className="border-white/15 text-neutral-400 hover:text-white text-xs">Invoice</Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedClient(null)} className="border-white/15 text-neutral-400 hover:text-white text-xs">✕</Button>
            </div>
          </div>
          <p className="text-xs text-neutral-600 uppercase tracking-wider font-mono mb-2">Projects ({selectedClient.projects.length})</p>
          <div className="space-y-2">
            {selectedClient.projects.length === 0 ? (
              <p className="text-neutral-600 text-xs">No projects yet.</p>
            ) : selectedClient.projects.map(p => (
              <div key={p.id} className="flex items-center justify-between border border-white/5 px-4 py-3 bg-black">
                <div>
                  <p className="text-sm text-white">{p.title}</p>
                  <p className="text-xs text-neutral-600 font-mono">{p.progressPct}% complete</p>
                </div>
                <div className="flex items-center gap-3">
                  <SBadge s={p.status} />
                  <Button size="sm" onClick={()=>setEditProject(p)} variant="outline" className="border-white/15 text-neutral-400 hover:text-white text-xs">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Clients tab ────────────────────────────────────────────────── */}
      {tab === "clients" && !loading && (
        <div className="space-y-2">
          {clients.length === 0 ? (
            <p className="text-neutral-500 text-sm py-8 text-center">No portal clients yet. Clients appear here after they sign up.</p>
          ) : clients.map(c => (
            <div key={c.id} className="flex items-center justify-between border border-white/10 bg-white/[0.02] px-5 py-4 hover:bg-white/[0.04] transition-colors">
              <div>
                <p className="text-sm text-white font-medium">{c.name||"—"}</p>
                <p className="text-xs text-neutral-500">{c.email} {c.company&&`· ${c.company}`}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={()=>openClient(c.id)} variant="outline" className="border-white/15 text-neutral-400 hover:text-white text-xs">View</Button>
                <Button size="sm" onClick={()=>setMsgModal({userId:c.id})} variant="outline" className="border-white/15 text-neutral-400 hover:text-white text-xs">Message</Button>
                <Button size="sm" onClick={()=>setInvModal({userId:c.id})} variant="outline" className="border-white/15 text-neutral-400 hover:text-white text-xs">Invoice</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Projects tab ───────────────────────────────────────────────── */}
      {tab === "projects" && !loading && (
        <div className="space-y-2">
          {projects.length === 0 ? (
            <p className="text-neutral-500 text-sm py-8 text-center">No projects yet.</p>
          ) : projects.map(p => (
            <div key={p.id} className={`border border-white/10 bg-white/[0.02] px-5 py-4 ${editProject?.id===p.id?"border-white/20":""}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white font-medium">{p.title}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{p.serviceName} {p.orderId&&`· #${p.orderId}`} · {p.progressPct}% · {p.assignedTeamMember||"Unassigned"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <SBadge s={p.status} />
                  <Button size="sm" onClick={()=>setEditProject(editProject?.id===p.id?null:p)} variant="outline" className="border-white/15 text-neutral-400 hover:text-white text-xs">Update</Button>
                </div>
              </div>
              {p.latestUpdate && <p className="text-xs text-neutral-600 mt-2 line-clamp-1">{p.latestUpdate}</p>}
            </div>
          ))}
        </div>
      )}

      {/* ── Messages tab ───────────────────────────────────────────────── */}
      {tab === "messages" && !loading && (
        <div className="space-y-2">
          {messages.length === 0 ? <p className="text-neutral-500 text-sm py-8 text-center">No messages yet.</p> : messages.map(m=>(
            <div key={m.id} className={`border px-5 py-4 ${m.sender==="client"&&!m.isRead?"border-white/20 bg-white/[0.04]":"border-white/10 bg-white/[0.02]"}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 border ${m.sender==="client"?"border-white/20 text-white bg-white/10":"border-white/10 text-neutral-500"}`}>{m.sender==="client"?"Client":"You"}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-600 font-mono">{new Date(m.createdAt).toLocaleDateString()}</span>
                  {m.sender==="client"&&!m.isRead&&<span className="w-2 h-2 bg-white rounded-full"/>}
                  {m.sender==="client"&&(
                    <Button size="sm" onClick={()=>setMsgModal({userId:m.portalUserId,projectId:m.projectId??undefined})} variant="outline" className="border-white/15 text-neutral-400 hover:text-white text-xs">Reply</Button>
                  )}
                </div>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">{m.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Revisions tab ──────────────────────────────────────────────── */}
      {tab === "revisions" && !loading && (
        <div className="space-y-2">
          {revisions.length===0?<p className="text-neutral-500 text-sm py-8 text-center">No revision requests.</p>:revisions.map(r=>(
            <div key={r.id} className="border border-white/10 bg-white/[0.02] px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-neutral-300 flex-1">{r.description}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <SBadge s={r.status} />
                  <select value={r.status} onChange={async e=>{await apiPatch(`revisions/${r.id}`,{status:e.target.value});loadTab("revisions")}} className="bg-white/5 border border-white/10 text-white text-xs px-2 py-1">
                    {["pending","in_progress","completed"].map(s=><option key={s} value={s}>{s.replace(/_/g," ")}</option>)}
                  </select>
                </div>
              </div>
              <p className="text-xs text-neutral-600 font-mono mt-2">{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Tickets tab ────────────────────────────────────────────────── */}
      {tab === "tickets" && !loading && (
        <div className="space-y-2">
          {tickets.length===0?<p className="text-neutral-500 text-sm py-8 text-center">No support tickets.</p>:tickets.map(t=>(
            <div key={t.id} className="border border-white/10 bg-white/[0.02] px-5 py-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-white font-medium">{t.subject}</p>
                <div className="flex items-center gap-2">
                  <SBadge s={t.status} />
                  <select value={t.status} onChange={async e=>{await apiPatch(`tickets/${t.id}`,{status:e.target.value});loadTab("tickets")}} className="bg-white/5 border border-white/10 text-white text-xs px-2 py-1">
                    {["open","in_progress","closed"].map(s=><option key={s} value={s}>{s.replace(/_/g," ")}</option>)}
                  </select>
                  <Button size="sm" onClick={async()=>{const body=prompt("Reply:");if(body)await apiPost(`tickets/${t.id}/replies`,{body});}} variant="outline" className="border-white/15 text-neutral-400 hover:text-white text-xs">Reply</Button>
                </div>
              </div>
              <p className="text-xs text-neutral-500 line-clamp-2">{t.body}</p>
              <p className="text-xs text-neutral-600 font-mono mt-2">{new Date(t.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Invoices tab ───────────────────────────────────────────────── */}
      {tab === "invoices" && !loading && (
        <div>
          <div className="flex justify-end mb-4">
            <Button onClick={()=>setInvModal({userId:0})} className="bg-white text-black hover:bg-neutral-200 text-sm gap-1.5"><Plus className="w-3.5 h-3.5"/>New Invoice</Button>
          </div>
          <div className="space-y-2">
            {invoices.length===0?<p className="text-neutral-500 text-sm py-8 text-center">No invoices yet.</p>:invoices.map(inv=>(
              <div key={inv.id} className="border border-white/10 bg-white/[0.02] px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white font-medium">{inv.title}</p>
                    <p className="text-xs text-neutral-500 font-mono">{(inv.amountCents/100).toFixed(2)} {inv.currency}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <SBadge s={inv.status} />
                    <select value={inv.status} onChange={async e=>{await apiPatch(`invoices/${inv.id}`,{status:e.target.value});loadTab("invoices")}} className="bg-white/5 border border-white/10 text-white text-xs px-2 py-1">
                      {["draft","sent","paid","overdue"].map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Sidebar
// ============================================================================

type NavItem = { id: Section; label: string; icon: React.ComponentType<{ className?: string }>; group: string }

const NAV: NavItem[] = [
  { id: "dashboard",     label: "Dashboard",    icon: LayoutDashboard, group: "Overview" },
  { id: "services",      label: "Services",     icon: FileText,        group: "Content" },
  { id: "portfolio",     label: "Portfolio",    icon: Image,           group: "Content" },
  { id: "case-studies",  label: "Case Studies", icon: FileText,        group: "Content" },
  { id: "testimonials",  label: "Testimonials", icon: Star,            group: "Content" },
  { id: "blog",          label: "Blog Posts",   icon: FileText,        group: "Content" },
  { id: "pricing",       label: "Pricing",      icon: DollarSign,      group: "Content" },
  { id: "faq",           label: "FAQ",          icon: HelpCircle,      group: "Content" },
  { id: "team",          label: "Team",         icon: Users,           group: "Content" },
  { id: "clients",       label: "Clients",      icon: Building2,       group: "Content" },
  { id: "contacts",      label: "Contacts",     icon: Mail,            group: "CRM" },
  { id: "bookings",      label: "Bookings",     icon: Calendar,        group: "CRM" },
  { id: "site-settings", label: "Site Settings",icon: Settings,        group: "Settings" },
  { id: "social-links",  label: "Social Links", icon: LinkIcon,        group: "Settings" },
  { id: "portal-crm",   label: "Client Portal", icon: Users,           group: "Portal CRM" },
]

function Sidebar({ active, setActive, onLogout }: { active: Section; setActive: (s: Section) => void; onLogout: () => void }) {
  const groups = ["Overview", "Content", "CRM", "Settings", "Portal CRM"]

  return (
    <aside className="w-56 shrink-0 bg-[#050505] border-r border-white/10 flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <span className="w-1.5 h-1.5 bg-white shrink-0" />
        <span className="font-display font-bold text-sm tracking-tight text-white">DARKLIGHTZ</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        {groups.map(group => {
          const groupItems = NAV.filter(n => n.group === group)
          return (
            <div key={group}>
              <p className="text-[10px] font-medium text-neutral-600 uppercase tracking-widest px-2 mb-2">{group}</p>
              {groupItems.map(item => {
                const isActive = item.id === active
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActive(item.id)}
                    className={`w-full flex items-center gap-2.5 px-2 py-2 text-sm rounded transition-colors ${
                      isActive
                        ? "text-white bg-white/8 border-l-2 border-white pl-[6px]"
                        : "text-neutral-500 hover:text-white hover:bg-white/4"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-2 py-2 text-sm text-neutral-500 hover:text-red-400 transition-colors rounded"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

// ============================================================================
// Main CMS shell
// ============================================================================

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [active, setActive] = useState<Section>("dashboard")

  const sectionMap: Record<Section, React.ReactNode> = {
    dashboard:     <DashboardSection />,
    services:      <ServicesSection />,
    portfolio:     <PortfolioSection />,
    "case-studies":<CaseStudiesSection />,
    testimonials:  <TestimonialsSection />,
    blog:          <BlogSection />,
    pricing:       <PricingSection />,
    faq:           <FaqSection />,
    team:          <TeamSection />,
    clients:       <ClientsSection />,
    contacts:      <ContactsSection />,
    bookings:      <BookingsSection />,
    "site-settings": <SiteSettingsSection />,
    "social-links":  <SocialLinksSection />,
    "portal-crm":    <PortalCRMSection />,
  }

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar active={active} setActive={setActive} onLogout={onLogout} />
      <main className="flex-1 p-8 overflow-auto min-h-screen">
        {sectionMap[active]}
      </main>
    </div>
  )
}

// ============================================================================
// Root export — handles session restore + login/logout
// ============================================================================

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY)
    if (saved) {
      setAdminApiKey(saved)
      setAuthed(true)
    }
    setChecking(false)
  }, [])

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY)
    setAdminApiKey(null)
    setAuthed(false)
  }

  if (checking) return null

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />

  return <Dashboard onLogout={handleLogout} />
}
