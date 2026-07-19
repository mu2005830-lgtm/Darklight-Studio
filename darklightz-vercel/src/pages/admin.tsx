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
  Download, RotateCcw, AlertTriangle, ArrowUpDown, Maximize2,
  FolderInput, Copy, RefreshCw, Check, Trash, Terminal, Play,
  ChevronDown, ChevronRight, Clock,
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
  | "reviews"
  | "media-center"
  | "sql-editor"

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
  pending:     "text-neutral-400 border-neutral-700",
  active:      "text-blue-400 border-blue-900",
  in_progress: "text-amber-400 border-amber-900",
  review:      "text-purple-400 border-purple-900",
  delivered:   "text-cyan-400 border-cyan-900",
  completed:   "text-green-400 border-green-900",
  cancelled:   "text-red-400 border-red-900",
  archived:    "text-neutral-600 border-neutral-800",
  open:        "text-amber-400 border-amber-900",
  closed:      "text-neutral-500 border-neutral-700",
  draft:       "text-neutral-500 border-neutral-700",
  sent:        "text-amber-400 border-amber-900",
  paid:        "text-green-400 border-green-900",
  overdue:     "text-red-400 border-red-900",
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
  const [invForm, setInvForm] = React.useState({ title: "", amountCents: "", currency: "PKR", status: "sent", issuedAt: "", dueAt: "", invoiceUrl: "" })

  // Workflow action modals
  const [workflowModal, setWorkflowModal] = React.useState<{
    projectId: number; projectTitle: string; portalUserId: number;
    action: "notify-client"|"request-info"|"request-files"|"deliver"
  } | null>(null)
  const [workflowMsg, setWorkflowMsg] = React.useState("")
  const [workflowFiles, setWorkflowFiles] = React.useState<{name:string;url:string}[]>([])
  const [workflowBusy, setWorkflowBusy] = React.useState(false)

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

  async function runWorkflow(projectId: number, action: string, message?: string, files?: {name:string;url:string}[]) {
    setWorkflowBusy(true)
    try {
      await apiPost(`projects/${projectId}/workflow`, { action, message, files })
      loadTab("projects")
    } catch(e: unknown) { alert(e instanceof Error ? e.message : "Error") }
    finally { setWorkflowBusy(false) }
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
            {([["title","Title","Invoice for..."],["amountCents","Amount (cents)","10000"],["currency","Currency","PKR"],["status","Status","sent"],["issuedAt","Issued At","2025-01-01"],["dueAt","Due At","2025-02-01"]] as const).map(([k,lbl,ph])=>(
              <div key={k}>
                <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">{lbl}</label>
                <input value={(invForm as Record<string,string>)[k]} onChange={e=>setInvForm({...invForm,[k]:e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2" placeholder={ph} />
              </div>
            ))}
          </div>
          <div className="mb-3">
            <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Custom Invoice PDF URL (optional)</label>
            <div className="flex gap-2 mt-1">
              <input value={invForm.invoiceUrl} onChange={e=>setInvForm({...invForm,invoiceUrl:e.target.value})} className="flex-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2" placeholder="https://… or upload a PDF below" />
              <label className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 text-white text-xs cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap">
                <Upload className="w-3 h-3"/>Upload PDF
                <input type="file" accept=".pdf" className="hidden" onChange={async e=>{
                  const f=e.target.files?.[0]; if(!f) return;
                  const fd=new FormData(); fd.append("file",f); fd.append("folder","Invoices");
                  const r=await fetch(`${base}/api/admin/media/upload`,{method:"POST",headers:{"x-admin-key":adminKey},body:fd});
                  if(r.ok){const d=await r.json();setInvForm(p=>({...p,invoiceUrl:d.url}))}
                  else alert("Upload failed"); e.target.value="";
                }}/>
              </label>
            </div>
            <p className="text-[10px] text-neutral-600 mt-1">When set, clients see a direct download link instead of the generated invoice view.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={async()=>{ await apiPost("invoices",{portalUserId:invModal.userId,...invForm,amountCents:parseInt(invForm.amountCents||"0")}); setInvModal(null);setInvForm({title:"",amountCents:"",currency:"PKR",status:"sent",issuedAt:"",dueAt:"",invoiceUrl:""}); loadTab("invoices") }} className="bg-white text-black hover:bg-neutral-200 text-sm">Create Invoice</Button>
            <Button variant="outline" onClick={()=>setInvModal(null)} className="border-white/15 text-neutral-400 hover:text-white">Cancel</Button>
          </div>
        </div>
      )}


      {/* Workflow action modal (notify / request-info / request-files / deliver) */}
      {workflowModal && (
        <div className="border border-white/15 bg-white/[0.03] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              {{
                "notify-client": "Notify Client",
                "request-info": "Request Information",
                "request-files": "Request Missing Files",
                "deliver": "Deliver Project",
              }[workflowModal.action]}
              <span className="text-neutral-500 font-normal normal-case ml-2">— {workflowModal.projectTitle}</span>
            </h3>
            <Button size="sm" variant="outline" onClick={() => { setWorkflowModal(null); setWorkflowMsg(""); setWorkflowFiles([]) }}
              className="border-white/15 text-neutral-400 hover:text-white text-xs">✕</Button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">
                {workflowModal.action === "deliver" ? "Delivery Message" : "Message"}
              </label>
              <Textarea
                value={workflowMsg}
                onChange={e => setWorkflowMsg(e.target.value)}
                rows={4}
                placeholder={
                  workflowModal.action === "notify-client"  ? "Write a message to the client…" :
                  workflowModal.action === "request-info"   ? "Describe what information you need…" :
                  workflowModal.action === "request-files"  ? "List the files you need from the client…" :
                  "Write a delivery message to the client… (files, access details, next steps)"
                }
                className="w-full mt-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2 resize-none"
              />
            </div>

            {workflowModal.action === "deliver" && (
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Delivery Files (optional)</label>
                <div className="space-y-2 mt-2">
                  {workflowFiles.map((f, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={f.name} onChange={e => setWorkflowFiles(prev => prev.map((x,j)=>j===i?{...x,name:e.target.value}:x))}
                        placeholder="File name (e.g. Website ZIP)" className="flex-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-1.5" />
                      <input value={f.url} onChange={e => setWorkflowFiles(prev => prev.map((x,j)=>j===i?{...x,url:e.target.value}:x))}
                        placeholder="URL or upload link" className="flex-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-1.5" />
                      <button onClick={() => setWorkflowFiles(prev => prev.filter((_,j)=>j!==i))}
                        className="px-2 text-neutral-500 hover:text-red-400 transition-colors text-sm">✕</button>
                    </div>
                  ))}
                  <button onClick={() => setWorkflowFiles(prev => [...prev, {name:"",url:""}])}
                    className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 hover:text-white transition-colors border border-white/10 px-3 py-1.5">
                    + Add File
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <Button
                disabled={workflowBusy || !workflowMsg.trim()}
                onClick={async () => {
                  const files = workflowModal.action === "deliver" ? workflowFiles.filter(f=>f.name&&f.url) : undefined
                  await runWorkflow(workflowModal.projectId, workflowModal.action, workflowMsg, files)
                  setWorkflowModal(null); setWorkflowMsg(""); setWorkflowFiles([])
                }}
                className="bg-white text-black hover:bg-neutral-200 text-sm"
              >
                {workflowBusy ? "Sending…" : workflowModal.action === "deliver" ? "Deliver Project" : "Send"}
              </Button>
              <Button variant="outline" onClick={() => { setWorkflowModal(null); setWorkflowMsg(""); setWorkflowFiles([]) }}
                className="border-white/15 text-neutral-400 hover:text-white">Cancel</Button>
            </div>
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
        <div className="space-y-3">
          {projects.length === 0 ? (
            <p className="text-neutral-500 text-sm py-8 text-center">No projects yet.</p>
          ) : projects.map(p => {
            const isDone     = p.status === "completed" || p.status === "archived"
            const canReopen  = isDone || p.status === "cancelled"
            const canComplete = ["review","delivered","active","in_progress"].includes(p.status)

            return (
              <div key={p.id} className={`border bg-white/[0.02] ${editProject?.id===p.id?"border-white/25":"border-white/10"}`}>
                {/* Project header row */}
                <div className="flex items-start justify-between px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="text-sm text-white font-medium">{p.title}</p>
                      <SBadge s={p.status} />
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {[p.serviceName, p.orderId && `#${p.orderId}`, `${p.progressPct}%`, p.assignedTeamMember||"Unassigned"].filter(Boolean).join(" · ")}
                    </p>
                    {p.latestUpdate && <p className="text-xs text-neutral-600 mt-1 line-clamp-1 italic">{p.latestUpdate}</p>}
                  </div>
                  {/* Update form toggle */}
                  <Button size="sm" onClick={()=>setEditProject(editProject?.id===p.id?null:p)}
                    variant="outline" className="border-white/15 text-neutral-400 hover:text-white text-xs ml-4 shrink-0">
                    {editProject?.id===p.id ? "Close" : "Edit"}
                  </Button>
                </div>

                {/* Action buttons */}
                <div className="px-5 pb-4 flex flex-wrap gap-1.5">
                  {/* Save Draft */}
                  <button onClick={async()=>{
                    const note = prompt("Draft note / latest update:")
                    if(!note) return
                    await runWorkflow(p.id,"save-draft",note)
                  }} className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 border border-white/10 text-neutral-500 hover:text-white hover:border-white/25 transition-colors">
                    Save Draft
                  </button>

                  {/* Notify Client */}
                  <button onClick={()=>{setWorkflowModal({projectId:p.id,projectTitle:p.title,portalUserId:p.portalUserId,action:"notify-client"});setWorkflowMsg("")}}
                    className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 border border-white/10 text-neutral-500 hover:text-white hover:border-white/25 transition-colors">
                    Notify Client
                  </button>

                  {/* Request Info */}
                  <button onClick={()=>{setWorkflowModal({projectId:p.id,projectTitle:p.title,portalUserId:p.portalUserId,action:"request-info"});setWorkflowMsg("")}}
                    className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 border border-white/10 text-neutral-500 hover:text-white hover:border-white/25 transition-colors">
                    Request Info
                  </button>

                  {/* Request Files */}
                  <button onClick={()=>{setWorkflowModal({projectId:p.id,projectTitle:p.title,portalUserId:p.portalUserId,action:"request-files"});setWorkflowMsg("")}}
                    className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 border border-white/10 text-neutral-500 hover:text-white hover:border-white/25 transition-colors">
                    Request Files
                  </button>

                  {/* Ready for Review */}
                  {!isDone && p.status !== "review" && (
                    <button onClick={async()=>{
                      if(!confirm(`Mark "${p.title}" as Ready for Review? The client will be notified.`)) return
                      await runWorkflow(p.id,"ready-for-review")
                    }} className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 border border-purple-900 text-purple-400 hover:bg-purple-950/30 transition-colors">
                      Ready for Review
                    </button>
                  )}

                  {/* Deliver Project */}
                  {!isDone && (
                    <button onClick={()=>{setWorkflowModal({projectId:p.id,projectTitle:p.title,portalUserId:p.portalUserId,action:"deliver"});setWorkflowMsg("");setWorkflowFiles([])}}
                      className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 border border-cyan-900 text-cyan-400 hover:bg-cyan-950/30 transition-colors">
                      Deliver Project
                    </button>
                  )}

                  {/* Send Invoice */}
                  <button onClick={()=>setInvModal({userId:p.portalUserId})}
                    className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 border border-white/10 text-neutral-500 hover:text-white hover:border-white/25 transition-colors">
                    Send Invoice
                  </button>

                  {/* Mark Completed */}
                  {canComplete && (
                    <button onClick={async()=>{
                      if(!confirm(`Mark "${p.title}" as Completed? This will lock the project, email the client, and send a review invite.`)) return
                      await runWorkflow(p.id,"complete")
                    }} className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 border border-green-900 text-green-400 hover:bg-green-950/30 transition-colors">
                      ✓ Mark Completed
                    </button>
                  )}

                  {/* Reopen */}
                  {canReopen && (
                    <button onClick={async()=>{
                      if(!confirm(`Reopen "${p.title}"?`)) return
                      await runWorkflow(p.id,"reopen")
                    }} className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 border border-blue-900 text-blue-400 hover:bg-blue-950/30 transition-colors">
                      ↺ Reopen
                    </button>
                  )}

                  {/* Archive */}
                  {!isDone && (
                    <button onClick={async()=>{
                      if(!confirm(`Archive "${p.title}"? The project will be locked.`)) return
                      await runWorkflow(p.id,"archive")
                    }} className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 border border-white/10 text-neutral-600 hover:text-neutral-400 hover:border-white/20 transition-colors">
                      Archive
                    </button>
                  )}
                </div>
              </div>
            )
          })}
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
// Media Center Section — professional CMS-style asset manager
// ============================================================================

const MEDIA_FOLDERS: { label: string; path: string }[] = [
  { label: "Hero Images",  path: "Hero Images" },
  { label: "Studio Story", path: "Studio Story" },
  { label: "Portfolio",    path: "Portfolio" },
  { label: "Case Studies", path: "Case Studies" },
  { label: "Journal",      path: "Journal" },
  { label: "Services",     path: "Services" },
  { label: "Team",         path: "Team" },
  { label: "Testimonials", path: "Testimonials" },
  { label: "Client Logos", path: "Client Logos" },
  { label: "SEO Images",   path: "SEO Images" },
  { label: "Invoices",     path: "Invoices" },
  { label: "Documents",    path: "Documents" },
  { label: "Brand Assets", path: "Brand Assets" },
  { label: "uploads",      path: "uploads" },
]

type MediaFile = {
  name: string; path: string; isFolder: boolean;
  size: number; mimetype: string; createdAt: string; updatedAt: string;
  publicUrl: string; folder?: string;
}

type SortKey = "date" | "name" | "size"

type UsageRecord = { table: string; id: number; label: string; section: string }

function MediaCenterSection() {
  const adminKey = sessionStorage.getItem(SESSION_KEY) ?? ""
  const base = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? ""

  // ── Core state ─────────────────────────────────────────────────────────────
  const [folder, setFolder] = React.useState("__all__")
  const [files, setFiles] = React.useState<MediaFile[]>([])
  const [loading, setLoading] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [sort, setSort] = React.useState<SortKey>("date")
  const [error, setError] = React.useState("")

  // ── UI state ───────────────────────────────────────────────────────────────
  const [copied, setCopied] = React.useState<string | null>(null)
  const [preview, setPreview] = React.useState<MediaFile | null>(null)
  const [previewUsages, setPreviewUsages] = React.useState<UsageRecord[]>([])
  const [previewUsageLoading, setPreviewUsageLoading] = React.useState(false)
  const [previewDims, setPreviewDims] = React.useState<{ w: number; h: number } | null>(null)

  // ── Rename dialog ──────────────────────────────────────────────────────────
  const [renameFile, setRenameFile] = React.useState<MediaFile | null>(null)
  const [renameVal, setRenameVal] = React.useState("")
  const [renameBusy, setRenameBusy] = React.useState(false)

  // ── Move dialog ────────────────────────────────────────────────────────────
  const [moveFile, setMoveFile] = React.useState<MediaFile | null>(null)
  const [moveDest, setMoveDest] = React.useState(MEDIA_FOLDERS[0].path)
  const [moveBusy, setMoveBusy] = React.useState(false)

  // ── Replace ────────────────────────────────────────────────────────────────
  const [replaceTarget, setReplaceTarget] = React.useState<MediaFile | null>(null)

  // ── Delete confirmation (when in use) ─────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = React.useState<MediaFile | null>(null)
  const [deleteUsages, setDeleteUsages] = React.useState<UsageRecord[]>([])
  const [deleteUsageLoading, setDeleteUsageLoading] = React.useState(false)

  const uploadInputRef = React.useRef<HTMLInputElement>(null)
  const replaceInputRef = React.useRef<HTMLInputElement>(null)
  const h = { "x-admin-key": adminKey }

  const isTrash = folder === "__trash__"

  // ── Helpers ────────────────────────────────────────────────────────────────
  async function load(f: string) {
    setLoading(true); setError("")
    try {
      const r = await fetch(`${base}/api/admin/media?folder=${encodeURIComponent(f)}`, { headers: h })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error ?? `HTTP ${r.status}`)
      setFiles(d.files ?? [])
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Error loading files") }
    finally { setLoading(false) }
  }

  React.useEffect(() => { load(folder) }, [folder])

  function formatBytes(bytes: number) {
    if (!bytes) return "—"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1048576).toFixed(1)} MB`
  }

  const isImage = (f: MediaFile) =>
    f.mimetype.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(f.name)

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url.split("?")[0])
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  async function downloadFile(file: MediaFile) {
    try {
      const r = await fetch(file.publicUrl)
      const blob = await r.blob()
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = file.name
      a.click()
      URL.revokeObjectURL(a.href)
    } catch { setError("Download failed") }
  }

  async function fetchUsage(url: string): Promise<UsageRecord[]> {
    try {
      const r = await fetch(`${base}/api/admin/media/usage?url=${encodeURIComponent(url)}`, { headers: h })
      if (!r.ok) return []
      const d = await r.json()
      return d.usages ?? []
    } catch { return [] }
  }

  // ── Upload ─────────────────────────────────────────────────────────────────
  async function handleUpload(fileList: FileList | null) {
    if (!fileList) return
    setUploading(true); setError("")
    const uploadFolder = folder === "__all__" || folder === "__trash__" ? "uploads" : folder
    for (const file of Array.from(fileList)) {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("folder", uploadFolder)
      const r = await fetch(`${base}/api/admin/media/upload`, { method: "POST", headers: h, body: fd })
      if (!r.ok) { const d = await r.json(); setError(`Failed to upload ${file.name}: ${d.error ?? r.status}`); continue }
    }
    setUploading(false)
    load(folder)
  }

  // ── Replace in-place ───────────────────────────────────────────────────────
  async function handleReplace(fileList: FileList | null) {
    if (!fileList || !replaceTarget) return
    const file = fileList[0]
    const fd = new FormData()
    fd.append("file", file)
    fd.append("path", replaceTarget.path)
    setUploading(true); setError("")
    const r = await fetch(`${base}/api/admin/media/replace`, { method: "POST", headers: h, body: fd })
    setUploading(false)
    if (!r.ok) { const d = await r.json(); setError(`Replace failed: ${d.error ?? r.status}`); return }
    setReplaceTarget(null)
    load(folder)
  }

  // ── Soft delete → trash ────────────────────────────────────────────────────
  async function initiateDelete(file: MediaFile) {
    setDeleteTarget(file)
    setDeleteUsages([])
    setDeleteUsageLoading(true)
    const usages = await fetchUsage(file.publicUrl)
    setDeleteUsages(usages)
    setDeleteUsageLoading(false)
  }

  async function confirmTrash() {
    if (!deleteTarget) return
    const r = await fetch(`${base}/api/admin/media/trash`, {
      method: "POST",
      headers: { ...h, "Content-Type": "application/json" },
      body: JSON.stringify({ path: deleteTarget.path }),
    })
    if (!r.ok) { const d = await r.json(); setError(d.error ?? "Delete failed"); }
    setDeleteTarget(null)
    if (preview?.path === deleteTarget.path) setPreview(null)
    load(folder)
  }

  // ── Restore from trash ─────────────────────────────────────────────────────
  async function handleRestore(file: MediaFile) {
    const r = await fetch(`${base}/api/admin/media/restore`, {
      method: "POST",
      headers: { ...h, "Content-Type": "application/json" },
      body: JSON.stringify({ path: file.path }),
    })
    if (!r.ok) { const d = await r.json(); setError(d.error ?? "Restore failed"); return }
    load(folder)
  }

  // ── Permanent delete ───────────────────────────────────────────────────────
  async function handlePermanentDelete(file: MediaFile) {
    if (!confirm(`Permanently delete "${file.name}"? This cannot be undone.`)) return
    const r = await fetch(`${base}/api/admin/media`, {
      method: "DELETE",
      headers: { ...h, "Content-Type": "application/json" },
      body: JSON.stringify({ path: file.path }),
    })
    if (!r.ok) { const d = await r.json(); setError(d.error ?? "Delete failed"); return }
    load(folder)
  }

  // ── Rename ────────────────────────────────────────────────────────────────
  async function handleRename() {
    if (!renameFile || !renameVal.trim()) return
    setRenameBusy(true)
    const parts = renameFile.path.split("/")
    parts[parts.length - 1] = renameVal.trim()
    const newPath = parts.join("/")
    const r = await fetch(`${base}/api/admin/media/move`, {
      method: "POST",
      headers: { ...h, "Content-Type": "application/json" },
      body: JSON.stringify({ from: renameFile.path, to: newPath }),
    })
    setRenameBusy(false)
    if (!r.ok) { const d = await r.json(); setError(d.error ?? "Rename failed"); return }
    setRenameFile(null)
    load(folder)
  }

  // ── Move ──────────────────────────────────────────────────────────────────
  async function handleMove() {
    if (!moveFile) return
    setMoveBusy(true)
    const filename = moveFile.path.split("/").pop() ?? moveFile.name
    const newPath = `${moveDest}/${filename}`
    const r = await fetch(`${base}/api/admin/media/move`, {
      method: "POST",
      headers: { ...h, "Content-Type": "application/json" },
      body: JSON.stringify({ from: moveFile.path, to: newPath }),
    })
    setMoveBusy(false)
    if (!r.ok) { const d = await r.json(); setError(d.error ?? "Move failed"); return }
    setMoveFile(null)
    load(folder)
  }

  // ── Duplicate ─────────────────────────────────────────────────────────────
  async function handleDuplicate(file: MediaFile) {
    const r = await fetch(`${base}/api/admin/media/duplicate`, {
      method: "POST",
      headers: { ...h, "Content-Type": "application/json" },
      body: JSON.stringify({ path: file.path }),
    })
    if (!r.ok) { const d = await r.json(); setError(d.error ?? "Duplicate failed"); return }
    load(folder)
  }

  // ── Preview modal open ────────────────────────────────────────────────────
  async function openPreview(file: MediaFile) {
    setPreview(file)
    setPreviewUsages([])
    setPreviewDims(null)
    setPreviewUsageLoading(true)
    if (isImage(file)) {
      const img = new window.Image()
      img.onload = () => setPreviewDims({ w: img.naturalWidth, h: img.naturalHeight })
      img.src = file.publicUrl
    }
    const usages = await fetchUsage(file.publicUrl)
    setPreviewUsages(usages)
    setPreviewUsageLoading(false)
  }

  // ── Filtered + sorted ─────────────────────────────────────────────────────
  const filtered = React.useMemo(() => {
    const term = search.toLowerCase()
    const list = files.filter(f => !f.isFolder && f.name.toLowerCase().includes(term))
    return [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name)
      if (sort === "size") return b.size - a.size
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [files, search, sort])

  // ── Shared button styles ──────────────────────────────────────────────────
  const iconBtn = "p-1.5 border border-white/10 text-neutral-500 hover:text-white hover:border-white/30 transition-colors"
  const iconBtnDanger = "p-1.5 border border-white/10 text-neutral-500 hover:text-red-400 hover:border-red-400/30 transition-colors"

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <SectionHeader
        title="Media Center"
        action={
          <div className="flex items-center gap-2">
            <Input
              className="bg-black border-white/10 text-white text-sm h-8 w-40"
              placeholder="Search files…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {/* Sort */}
            <div className="flex items-center gap-1 border border-white/10 px-2 h-8">
              <ArrowUpDown className="w-3 h-3 text-neutral-600" />
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortKey)}
                className="bg-transparent text-neutral-400 text-[10px] font-mono uppercase tracking-wider outline-none cursor-pointer"
              >
                <option value="date">Date</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
              </select>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-white/15 text-neutral-400 hover:text-white h-8"
              onClick={() => load(folder)}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              className="bg-white text-black hover:bg-neutral-200 gap-1.5 h-8"
              disabled={uploading || isTrash}
              onClick={() => uploadInputRef.current?.click()}
            >
              <Upload className="w-3.5 h-3.5" />
              {uploading ? "Uploading…" : "Upload"}
            </Button>
            <input ref={uploadInputRef} type="file" multiple className="hidden"
              onChange={e => { handleUpload(e.target.files); e.target.value = "" }} />
            <input ref={replaceInputRef} type="file" className="hidden"
              onChange={e => { handleReplace(e.target.files); e.target.value = "" }} />
          </div>
        }
      />

      {/* ── Folder tabs ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {[{ label: "All", path: "__all__" }, ...MEDIA_FOLDERS, { label: "🗑 Trash", path: "__trash__" }].map(f => (
          <button key={f.path} onClick={() => setFolder(f.path)}
            className={`text-[10px] uppercase tracking-wider font-mono px-3 py-1.5 border transition-colors ${
              folder === f.path
                ? f.path === "__trash__" ? "bg-red-950 text-red-300 border-red-800" : "bg-white text-black border-white"
                : f.path === "__trash__" ? "border-red-900/30 text-neutral-600 hover:text-red-400 hover:border-red-800/50" : "border-white/15 text-neutral-500 hover:text-white hover:border-white/30"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Error banner ───────────────────────────────────────────────────── */}
      {error && (
        <div className="border border-red-500/30 bg-red-500/5 p-4 mb-6">
          <p className="text-red-400 text-xs font-mono leading-relaxed">{error}</p>
          {error.includes("SUPABASE_SERVICE_ROLE_KEY") && (
            <div className="mt-3 space-y-1 text-[11px] text-neutral-400">
              <p className="font-semibold text-white">How to fix:</p>
              <p>1. Go to <span className="text-white font-mono">vercel.com → darklightz → darklight-studio → Settings → Environment Variables</span></p>
              <p>2. Add <span className="text-white font-mono">SUPABASE_SERVICE_ROLE_KEY</span> — from Supabase → Settings → API → service_role secret</p>
              <p>3. Save, then Redeploy on the latest deployment.</p>
            </div>
          )}
          {error.includes("Bucket") && (
            <div className="mt-3 space-y-1 text-[11px] text-neutral-400">
              <p className="font-semibold text-white">How to fix:</p>
              <p>1. Supabase → Storage → Create bucket named <span className="text-white font-mono">darklightz-media</span> → set Public</p>
            </div>
          )}
        </div>
      )}

      {/* ── Trash notice ───────────────────────────────────────────────────── */}
      {isTrash && !loading && (
        <div className="border border-red-900/40 bg-red-950/10 px-4 py-3 mb-5 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <p className="text-[11px] text-neutral-400">
            Files in Trash are still stored in Supabase but hidden from the site. Restore to bring them back, or permanently delete to free storage.
          </p>
        </div>
      )}

      {/* ── Grid ───────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-40 bg-white/5 animate-pulse" />)}
        </div>
      ) : !error && filtered.length === 0 ? (
        <div className="border border-white/10 bg-white/[0.02] p-12 text-center">
          {isTrash
            ? <Trash className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
            : <Image className="w-8 h-8 text-neutral-700 mx-auto mb-3" />}
          <p className="text-neutral-500 text-sm">
            {isTrash ? "Trash is empty." : "No files in this folder yet."}
          </p>
          {!isTrash && (
            <p className="text-neutral-700 text-xs mt-1">
              {folder === "__all__" ? "Upload files using the button above." : `Upload files to the "${folder}" folder using the button above.`}
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(file => (
            <div key={file.path} className="border border-white/10 bg-white/[0.02] overflow-hidden group flex flex-col">
              {/* Thumbnail */}
              <div
                className="h-32 bg-black flex items-center justify-center overflow-hidden relative cursor-pointer"
                onClick={() => openPreview(file)}
              >
                {isImage(file) ? (
                  <img src={file.publicUrl} alt={file.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <FileText className="w-8 h-8 text-neutral-600" />
                    <span className="text-[10px] text-neutral-600 font-mono uppercase">
                      {file.name.split(".").pop() || "file"}
                    </span>
                  </div>
                )}
                {/* Folder badge on All tab */}
                {folder === "__all__" && file.folder && file.folder !== "root" && (
                  <span className="absolute top-1.5 left-1.5 bg-black/70 text-[9px] font-mono text-neutral-400 px-1.5 py-0.5">
                    {file.folder}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Maximize2 className="w-5 h-5 text-white drop-shadow" />
                </div>
              </div>

              {/* Meta */}
              <div className="p-3 flex flex-col gap-1.5 flex-1">
                <p className="text-xs text-white truncate leading-tight" title={file.name}>{file.name}</p>
                <div className="flex items-center gap-2 text-[10px] text-neutral-600 font-mono">
                  <span>{formatBytes(file.size)}</span>
                  {file.createdAt && (
                    <span>· {new Date(file.createdAt).toLocaleDateString()}</span>
                  )}
                </div>

                {/* Actions */}
                {isTrash ? (
                  /* Trash actions */
                  <div className="flex gap-1.5 mt-1">
                    <button onClick={() => handleRestore(file)}
                      className="flex-1 text-[10px] uppercase tracking-wider py-1 border border-white/10 text-neutral-500 hover:text-green-400 hover:border-green-900/50 transition-colors flex items-center justify-center gap-1">
                      <RotateCcw className="w-3 h-3" /> Restore
                    </button>
                    <button onClick={() => handlePermanentDelete(file)}
                      className="px-2 py-1 border border-white/10 text-neutral-500 hover:text-red-400 hover:border-red-400/30 transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  /* Normal actions */
                  <div className="flex items-center gap-1 mt-1">
                    {/* Preview/Details */}
                    <button onClick={() => openPreview(file)} title="Preview & details" className={iconBtn}>
                      <Eye className="w-3 h-3" />
                    </button>
                    {/* Replace */}
                    <button onClick={() => { setReplaceTarget(file); replaceInputRef.current?.click() }} title="Replace file" className={iconBtn}>
                      <RefreshCw className="w-3 h-3" />
                    </button>
                    {/* Copy URL */}
                    <button onClick={() => copyUrl(file.publicUrl)} title="Copy URL" className={iconBtn}>
                      {copied === file.publicUrl ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                    {/* Download */}
                    <button onClick={() => downloadFile(file)} title="Download" className={iconBtn}>
                      <Download className="w-3 h-3" />
                    </button>
                    {/* Rename */}
                    <button onClick={() => { setRenameFile(file); setRenameVal(file.name) }} title="Rename" className={iconBtn}>
                      <Pencil className="w-3 h-3" />
                    </button>
                    {/* Move */}
                    <button onClick={() => { setMoveFile(file); setMoveDest(MEDIA_FOLDERS[0].path) }} title="Move to folder" className={iconBtn}>
                      <FolderInput className="w-3 h-3" />
                    </button>
                    {/* Duplicate */}
                    <button onClick={() => handleDuplicate(file)} title="Duplicate" className={iconBtn}>
                      <FileText className="w-3 h-3" />
                    </button>
                    {/* Delete → Trash */}
                    <button onClick={() => initiateDelete(file)} title="Move to Trash" className={iconBtnDanger}>
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Preview / Details modal ─────────────────────────────────────────── */}
      <Dialog open={!!preview} onOpenChange={open => !open && setPreview(null)}>
        <DialogContent className="bg-black border border-white/10 text-white max-w-3xl w-full p-0 overflow-hidden">
          {preview && (
            <div className="flex flex-col md:flex-row">
              {/* Image pane */}
              <div className="md:w-1/2 bg-neutral-950 flex items-center justify-center min-h-48 md:min-h-0">
                {isImage(preview) ? (
                  <img src={preview.publicUrl} alt={preview.name}
                    className="max-w-full max-h-80 md:max-h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center gap-2 p-8">
                    <FileText className="w-16 h-16 text-neutral-600" />
                    <span className="text-xs text-neutral-500 font-mono uppercase">{preview.name.split(".").pop()}</span>
                  </div>
                )}
              </div>

              {/* Info pane */}
              <div className="md:w-1/2 p-5 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
                <div>
                  <p className="text-white font-medium text-sm leading-tight break-all">{preview.name}</p>
                  <p className="text-neutral-500 text-[10px] font-mono mt-1">{preview.path}</p>
                </div>

                {/* Metadata grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                  {[
                    ["Size",       formatBytes(preview.size)],
                    ["Type",       preview.mimetype || "—"],
                    ["Uploaded",   preview.createdAt ? new Date(preview.createdAt).toLocaleString() : "—"],
                    ["Folder",     preview.folder && preview.folder !== "root" ? preview.folder : "Root"],
                    ["Dimensions", previewDims ? `${previewDims.w} × ${previewDims.h} px` : isImage(preview) ? "Loading…" : "—"],
                    ["Aspect",     previewDims ? (() => {
                      const g = (a: number, b: number): number => b === 0 ? a : g(b, a % b)
                      const d = g(previewDims.w, previewDims.h)
                      return `${previewDims.w/d}:${previewDims.h/d}`
                    })() : "—"],
                  ].map(([k, v]) => (
                    <React.Fragment key={k}>
                      <span className="text-neutral-600 font-mono uppercase tracking-wider">{k}</span>
                      <span className="text-neutral-300 break-all">{v}</span>
                    </React.Fragment>
                  ))}
                </div>

                {/* Usage */}
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-2">Used In</p>
                  {previewUsageLoading ? (
                    <p className="text-neutral-600 text-xs">Checking…</p>
                  ) : previewUsages.length === 0 ? (
                    <p className="text-neutral-600 text-xs">Not used anywhere.</p>
                  ) : (
                    <ul className="space-y-1">
                      {previewUsages.map((u, i) => (
                        <li key={i} className="text-xs text-neutral-300">
                          <span className="text-neutral-500">{u.section}: </span>{u.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                  <Button size="sm" variant="outline"
                    className="border-white/15 text-neutral-400 hover:text-white text-xs gap-1"
                    onClick={() => copyUrl(preview.publicUrl)}>
                    <Copy className="w-3 h-3" />
                    {copied === preview.publicUrl ? "Copied!" : "Copy URL"}
                  </Button>
                  <Button size="sm" variant="outline"
                    className="border-white/15 text-neutral-400 hover:text-white text-xs gap-1"
                    onClick={() => downloadFile(preview)}>
                    <Download className="w-3 h-3" /> Download
                  </Button>
                  <Button size="sm" variant="outline"
                    className="border-white/15 text-neutral-400 hover:text-white text-xs gap-1"
                    onClick={() => { setReplaceTarget(preview); replaceInputRef.current?.click() }}>
                    <RefreshCw className="w-3 h-3" /> Replace
                  </Button>
                  <Button size="sm" variant="outline"
                    className="border-white/15 text-neutral-400 hover:text-white text-xs gap-1"
                    onClick={() => { setRenameFile(preview); setRenameVal(preview.name); setPreview(null) }}>
                    <Pencil className="w-3 h-3" /> Rename
                  </Button>
                  <Button size="sm" variant="outline"
                    className="border-white/15 text-neutral-400 hover:text-white text-xs gap-1"
                    onClick={() => { setMoveFile(preview); setMoveDest(MEDIA_FOLDERS[0].path); setPreview(null) }}>
                    <FolderInput className="w-3 h-3" /> Move
                  </Button>
                  <Button size="sm" variant="outline"
                    className="border-white/15 text-neutral-400 hover:text-white text-xs gap-1"
                    onClick={() => { handleDuplicate(preview); setPreview(null) }}>
                    <FileText className="w-3 h-3" /> Duplicate
                  </Button>
                  <Button size="sm" variant="outline"
                    className="border-red-900/40 text-red-500 hover:text-red-300 hover:border-red-700 text-xs gap-1"
                    onClick={() => { initiateDelete(preview); setPreview(null) }}>
                    <Trash2 className="w-3 h-3" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation dialog ─────────────────────────────────────── */}
      <Dialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <DialogContent className="bg-black border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-base font-display">Move to Trash?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-neutral-300 break-all">
              "<span className="text-white">{deleteTarget?.name}</span>" will be moved to Trash.
              You can restore it at any time.
            </p>
            {deleteUsageLoading && (
              <p className="text-xs text-neutral-500">Checking if this image is in use…</p>
            )}
            {!deleteUsageLoading && deleteUsages.length > 0 && (
              <div className="border border-amber-900/40 bg-amber-950/10 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-amber-300 font-medium mb-1">
                      This image is currently in use on {deleteUsages.length} page{deleteUsages.length !== 1 ? "s" : ""}:
                    </p>
                    <ul className="space-y-0.5">
                      {deleteUsages.map((u, i) => (
                        <li key={i} className="text-[11px] text-neutral-400">
                          <span className="text-neutral-300">{u.section}:</span> {u.label}
                        </li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-neutral-500 mt-2">
                      Moving it to Trash will leave a broken image on those pages until you assign a replacement.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="outline"
                className="border-white/15 text-neutral-400 hover:text-white text-xs"
                onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button size="sm"
                className="bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 text-xs gap-1"
                onClick={confirmTrash}>
                <Trash2 className="w-3 h-3" /> Move to Trash
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Rename dialog ──────────────────────────────────────────────────── */}
      <Dialog open={!!renameFile} onOpenChange={open => !open && setRenameFile(null)}>
        <DialogContent className="bg-black border border-white/10 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white text-base font-display">Rename File</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              className="bg-black border-white/10 text-white text-sm"
              value={renameVal}
              onChange={e => setRenameVal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleRename()}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="outline"
                className="border-white/15 text-neutral-400 hover:text-white text-xs"
                onClick={() => setRenameFile(null)}>
                Cancel
              </Button>
              <Button size="sm"
                className="bg-white text-black hover:bg-neutral-200 text-xs"
                disabled={renameBusy || !renameVal.trim()}
                onClick={handleRename}>
                {renameBusy ? "Renaming…" : "Rename"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Move dialog ────────────────────────────────────────────────────── */}
      <Dialog open={!!moveFile} onOpenChange={open => !open && setMoveFile(null)}>
        <DialogContent className="bg-black border border-white/10 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white text-base font-display">Move to Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-xs text-neutral-500 break-all">Moving: <span className="text-white">{moveFile?.name}</span></p>
            <select
              value={moveDest}
              onChange={e => setMoveDest(e.target.value)}
              className="w-full bg-black border border-white/10 text-white text-sm px-3 py-2 outline-none"
            >
              {MEDIA_FOLDERS.map(f => (
                <option key={f.path} value={f.path}>{f.label}</option>
              ))}
            </select>
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="outline"
                className="border-white/15 text-neutral-400 hover:text-white text-xs"
                onClick={() => setMoveFile(null)}>
                Cancel
              </Button>
              <Button size="sm"
                className="bg-white text-black hover:bg-neutral-200 text-xs gap-1"
                disabled={moveBusy}
                onClick={handleMove}>
                <FolderInput className="w-3 h-3" />
                {moveBusy ? "Moving…" : "Move"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================================================
// Reviews Section
// ============================================================================

type ReviewItem = {
  id: number; name: string; company: string | null; rating: number;
  review: string; status: string; createdAt: string;
}

function ReviewsSection() {
  const adminKey = sessionStorage.getItem(SESSION_KEY) ?? ""
  const base = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? ""
  const h = { headers: { "x-admin-key": adminKey, "Content-Type": "application/json" } }

  const [items, setItems] = React.useState<ReviewItem[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  async function load() {
    setLoading(true); setError("")
    try {
      const r = await fetch(`${base}/api/admin/reviews`, { headers: { "x-admin-key": adminKey } })
      if (!r.ok) throw new Error(`${r.status}`)
      setItems(await r.json())
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Error") }
    finally { setLoading(false) }
  }
  React.useEffect(() => { load() }, [])

  async function setStatus(id: number, status: string) {
    try {
      const r = await fetch(`${base}/api/admin/reviews/${id}`, { method: "PATCH", ...h, body: JSON.stringify({ status }) })
      if (!r.ok) throw new Error(`${r.status}`)
      load()
    } catch (e: unknown) { alert(e instanceof Error ? e.message : "Error") }
  }

  async function del(id: number) {
    if (!confirm("Delete this review permanently?")) return
    try {
      const r = await fetch(`${base}/api/admin/reviews/${id}`, { method: "DELETE", headers: { "x-admin-key": adminKey } })
      if (!r.ok) throw new Error(`${r.status}`)
      load()
    } catch (e: unknown) { alert(e instanceof Error ? e.message : "Error") }
  }

  const pending  = items.filter(i => i.status === "pending")
  const approved = items.filter(i => i.status === "approved")
  const rejected = items.filter(i => i.status === "rejected")

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-display font-bold text-white">Reviews</h2>
          <p className="text-neutral-500 text-sm mt-1">Approve or reject client reviews before they go public.</p>
        </div>
        <Button onClick={load} variant="outline" className="border-white/15 text-neutral-400 hover:text-white text-xs">Refresh</Button>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      {loading && <p className="text-neutral-500 text-sm">Loading…</p>}

      {/* Pending reviews first */}
      {!loading && pending.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-3">{pending.length} Pending Approval</p>
          <div className="space-y-3">
            {pending.map(item => (
              <div key={item.id} className="border border-amber-900/40 bg-amber-950/10 px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      {item.company && <p className="text-xs text-neutral-500">{item.company}</p>}
                      <p className="text-xs text-amber-400">{"★".repeat(item.rating)}{"☆".repeat(5-item.rating)}</p>
                    </div>
                    <p className="text-sm text-neutral-300 italic">"{item.review}"</p>
                    <p className="text-xs text-neutral-600 font-mono mt-2">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" onClick={() => setStatus(item.id, "approved")} className="bg-green-900/50 hover:bg-green-900 border border-green-800 text-green-300 text-xs">Approve</Button>
                    <Button size="sm" onClick={() => setStatus(item.id, "rejected")} className="bg-red-950/50 hover:bg-red-950 border border-red-900 text-red-400 text-xs">Reject</Button>
                    <Button size="sm" onClick={() => del(item.id)} variant="outline" className="border-white/10 text-neutral-600 hover:text-red-400 hover:border-red-900 text-xs">Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved */}
      {!loading && approved.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-mono uppercase tracking-wider text-green-400 mb-3">{approved.length} Approved — Public</p>
          <div className="space-y-2">
            {approved.map(item => (
              <div key={item.id} className="border border-white/10 bg-white/[0.02] px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      {item.company && <p className="text-xs text-neutral-500">{item.company}</p>}
                      <p className="text-xs text-yellow-400">{"★".repeat(item.rating)}</p>
                    </div>
                    <p className="text-xs text-neutral-500 italic mt-1 line-clamp-1">"{item.review}"</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" onClick={() => setStatus(item.id, "pending")} variant="outline" className="border-white/15 text-neutral-400 hover:text-white text-xs">Unpublish</Button>
                    <Button size="sm" onClick={() => del(item.id)} variant="outline" className="border-white/10 text-neutral-600 hover:text-red-400 hover:border-red-900 text-xs">Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejected */}
      {!loading && rejected.length > 0 && (
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-3">{rejected.length} Rejected</p>
          <div className="space-y-2">
            {rejected.map(item => (
              <div key={item.id} className="border border-white/5 bg-white/[0.01] px-5 py-4 opacity-50">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-neutral-400">{item.name} {item.company ? `· ${item.company}` : ""}</p>
                    <p className="text-xs text-neutral-600 italic mt-1 line-clamp-1">"{item.review}"</p>
                  </div>
                  <Button size="sm" onClick={() => del(item.id)} variant="outline" className="border-white/10 text-neutral-600 hover:text-red-400 hover:border-red-900 text-xs shrink-0">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="border border-white/10 p-12 text-center">
          <Star className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-500 text-sm">No reviews yet.</p>
          <p className="text-neutral-700 text-xs mt-1">Share the link <span className="text-neutral-500">/submit-review</span> with clients.</p>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// SQL Editor Section
// ============================================================================

type SqlResult = {
  command: string
  rowCount: number
  columns: string[]
  rows: Record<string, unknown>[]
}

const QUICK_QUERIES = [
  { label: "All tables",       sql: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;" },
  { label: "portfolio_projects", sql: "SELECT * FROM portfolio_projects ORDER BY sort_order LIMIT 50;" },
  { label: "case_studies",     sql: "SELECT * FROM case_studies ORDER BY sort_order LIMIT 50;" },
  { label: "blog_posts",       sql: "SELECT id, title, category, published_at FROM blog_posts ORDER BY published_at DESC LIMIT 50;" },
  { label: "services",         sql: "SELECT id, title, category, sort_order FROM services ORDER BY sort_order LIMIT 50;" },
  { label: "testimonials",     sql: "SELECT * FROM testimonials LIMIT 50;" },
  { label: "team_members",     sql: "SELECT * FROM team_members ORDER BY sort_order LIMIT 50;" },
  { label: "clients",          sql: "SELECT * FROM clients ORDER BY sort_order LIMIT 50;" },
  { label: "pricing_plans",    sql: "SELECT * FROM pricing_plans ORDER BY sort_order LIMIT 50;" },
  { label: "site_settings",    sql: "SELECT * FROM site_settings LIMIT 1;" },
  { label: "contact_submissions", sql: "SELECT id, name, email, status, created_at FROM contact_submissions ORDER BY created_at DESC LIMIT 50;" },
  { label: "bookings",         sql: "SELECT id, name, email, service, status, created_at FROM bookings ORDER BY created_at DESC LIMIT 50;" },
]

function SqlEditorSection() {
  const adminKey = sessionStorage.getItem(SESSION_KEY) ?? ""
  const base = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? ""
  const h = { "x-admin-key": adminKey, "Content-Type": "application/json" }

  const [query, setQuery] = React.useState("SELECT table_name\nFROM information_schema.tables\nWHERE table_schema = 'public'\nORDER BY table_name;")
  const [running, setRunning] = React.useState(false)
  const [results, setResults] = React.useState<SqlResult[]>([])
  const [execMs, setExecMs] = React.useState<number | null>(null)
  const [error, setError] = React.useState("")
  const [history, setHistory] = React.useState<string[]>([])
  const [histOpen, setHistOpen] = React.useState(false)
  const [quickOpen, setQuickOpen] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  async function runQuery() {
    if (!query.trim()) return
    setRunning(true); setError(""); setResults([]); setExecMs(null)
    try {
      const r = await fetch(`${base}/api/admin/sql`, {
        method: "POST",
        headers: h,
        body: JSON.stringify({ query: query.trim() }),
      })
      const d = await r.json()
      if (!r.ok || !d.ok) {
        setError(d.error ?? `HTTP ${r.status}`)
        setExecMs(d.executionMs ?? null)
      } else {
        setResults(d.results ?? [])
        setExecMs(d.executionMs ?? null)
        setHistory(prev => [query.trim(), ...prev.filter(q => q !== query.trim())].slice(0, 20))
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Network error")
    }
    setRunning(false)
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      runQuery()
    }
    // Tab → 2 spaces
    if (e.key === "Tab") {
      e.preventDefault()
      const el = e.currentTarget
      const start = el.selectionStart
      const end = el.selectionEnd
      const next = query.substring(0, start) + "  " + query.substring(end)
      setQuery(next)
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = start + 2 })
    }
  }

  function formatCell(val: unknown): string {
    if (val === null || val === undefined) return "NULL"
    if (typeof val === "object") return JSON.stringify(val)
    return String(val)
  }

  const totalRows = results.reduce((s, r) => s + r.rowCount, 0)

  return (
    <div>
      <SectionHeader
        title="SQL Editor"
        action={
          <div className="flex items-center gap-2">
            {/* Quick queries */}
            <div className="relative">
              <button
                onClick={() => { setQuickOpen(o => !o); setHistOpen(false) }}
                className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 border border-white/15 text-neutral-500 hover:text-white hover:border-white/30 transition-colors"
              >
                Quick Queries <ChevronDown className="w-3 h-3" />
              </button>
              {quickOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 w-56 bg-[#0a0a0a] border border-white/10 shadow-xl">
                  {QUICK_QUERIES.map(q => (
                    <button key={q.label} onClick={() => { setQuery(q.sql); setQuickOpen(false); textareaRef.current?.focus() }}
                      className="w-full text-left px-3 py-2 text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition-colors font-mono border-b border-white/5 last:border-0">
                      {q.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* History */}
            {history.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => { setHistOpen(o => !o); setQuickOpen(false) }}
                  className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 border border-white/15 text-neutral-500 hover:text-white hover:border-white/30 transition-colors"
                >
                  <Clock className="w-3 h-3" /> History
                </button>
                {histOpen && (
                  <div className="absolute right-0 top-full mt-1 z-50 w-96 bg-[#0a0a0a] border border-white/10 shadow-xl max-h-64 overflow-y-auto">
                    {history.map((q, i) => (
                      <button key={i} onClick={() => { setQuery(q); setHistOpen(false); textareaRef.current?.focus() }}
                        className="w-full text-left px-3 py-2 text-[10px] text-neutral-500 hover:text-white hover:bg-white/5 transition-colors font-mono border-b border-white/5 last:border-0 truncate block">
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Run */}
            <Button
              size="sm"
              className="bg-white text-black hover:bg-neutral-200 gap-1.5"
              disabled={running || !query.trim()}
              onClick={runQuery}
            >
              <Play className="w-3.5 h-3.5" />
              {running ? "Running…" : "Run"}
            </Button>
          </div>
        }
      />

      {/* Info bar */}
      <div className="flex items-center gap-3 mb-2 text-[10px] font-mono text-neutral-600">
        <span className="flex items-center gap-1"><Terminal className="w-3 h-3" /> PostgreSQL</span>
        <span>·</span>
        <span>Ctrl+Enter to run</span>
        <span>·</span>
        <span>Tab for indent</span>
      </div>

      {/* Editor */}
      <div className="border border-white/10 mb-4">
        <textarea
          ref={textareaRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          className="w-full bg-[#050505] text-green-300 font-mono text-sm p-4 resize-y outline-none min-h-40 leading-relaxed placeholder:text-neutral-700"
          placeholder="-- Write your SQL here&#10;SELECT * FROM services LIMIT 10;"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
        <div className="border-t border-white/10 px-3 py-1.5 flex items-center justify-between bg-black/50">
          <span className="text-[10px] text-neutral-700 font-mono">{query.split("\n").length} lines · {query.length} chars</span>
          <button
            onClick={() => setQuery("")}
            className="text-[10px] text-neutral-700 hover:text-neutral-400 transition-colors font-mono uppercase tracking-wider"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="border border-red-500/30 bg-red-950/10 p-4 mb-4 font-mono">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 text-xs font-semibold mb-1">Query Error</p>
              <p className="text-red-300 text-xs leading-relaxed whitespace-pre-wrap">{error}</p>
            </div>
          </div>
          {execMs !== null && (
            <p className="text-neutral-600 text-[10px] mt-2 font-mono">Executed in {execMs}ms</p>
          )}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          {/* Stats bar */}
          <div className="flex items-center gap-4 text-[10px] font-mono text-neutral-500">
            <span className="text-green-400">✓ Query succeeded</span>
            <span>{totalRows} row{totalRows !== 1 ? "s" : ""} returned</span>
            {execMs !== null && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{execMs}ms</span>}
            {results.length > 1 && <span>{results.length} result sets</span>}
          </div>

          {results.map((result, ri) => (
            <div key={ri} className="border border-white/10 overflow-hidden">
              {/* Result header */}
              <div className="flex items-center justify-between px-3 py-2 bg-white/[0.02] border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">{result.command}</span>
                  <span className="text-[10px] font-mono text-neutral-600">{result.rowCount} row{result.rowCount !== 1 ? "s" : ""}</span>
                  {result.columns.length > 0 && (
                    <span className="text-[10px] font-mono text-neutral-700">{result.columns.length} col{result.columns.length !== 1 ? "s" : ""}</span>
                  )}
                </div>
                {/* Copy as JSON */}
                <button
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(result.rows, null, 2))}
                  className="text-[10px] font-mono text-neutral-600 hover:text-white transition-colors uppercase tracking-wider"
                >
                  Copy JSON
                </button>
              </div>

              {result.columns.length === 0 ? (
                <p className="px-4 py-3 text-xs text-neutral-500 font-mono">{result.command} — {result.rowCount} row{result.rowCount !== 1 ? "s" : ""} affected.</p>
              ) : result.rows.length === 0 ? (
                <p className="px-4 py-3 text-xs text-neutral-500">No rows returned.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono min-w-max">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-3 py-2 text-left text-[10px] text-neutral-600 w-10 select-none font-normal">#</th>
                        {result.columns.map(col => (
                          <th key={col} className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-neutral-500 font-medium whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="px-3 py-1.5 text-neutral-700 text-[10px] select-none">{rowIdx + 1}</td>
                          {result.columns.map(col => {
                            const val = row[col]
                            const isNull = val === null || val === undefined
                            const isNum = typeof val === "number"
                            const isBool = typeof val === "boolean"
                            return (
                              <td key={col} className={`px-3 py-1.5 whitespace-nowrap max-w-xs truncate ${
                                isNull ? "text-neutral-700 italic" : isNum ? "text-blue-300" : isBool ? "text-amber-300" : "text-neutral-200"
                              }`} title={formatCell(val)}>
                                {isNull ? "NULL" : isBool ? String(val) : formatCell(val)}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!running && !error && results.length === 0 && (
        <div className="border border-white/10 bg-white/[0.02] p-12 text-center">
          <Terminal className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-500 text-sm">Write a query and press Run (or Ctrl+Enter)</p>
          <p className="text-neutral-700 text-xs mt-1">Results appear here as a table. Use Quick Queries for common lookups.</p>
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
  { id: "reviews",      label: "Reviews",       icon: Star,            group: "CRM" },
  { id: "media-center", label: "Media Center",  icon: Image,           group: "Settings" },
  { id: "sql-editor",   label: "SQL Editor",    icon: Terminal,        group: "Database" },
]

function Sidebar({ active, setActive, onLogout }: { active: Section; setActive: (s: Section) => void; onLogout: () => void }) {
  const groups = ["Overview", "Content", "CRM", "Settings", "Portal CRM", "Database"]

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
    reviews:         <ReviewsSection />,
    "media-center":  <MediaCenterSection />,
    "sql-editor":    <SqlEditorSection />,
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
