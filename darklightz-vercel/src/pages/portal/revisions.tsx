import { useState } from "react"
import { usePortalRevisions, useCreateRevision, usePortalProjects } from "@/lib/portal-api"
import { PortalLayout } from "@/components/layout/PortalLayout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { RefreshCw, Plus, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

const STATUS_STYLES: Record<string, string> = {
  pending:     "border-amber-900 text-amber-400 bg-amber-950",
  in_progress: "border-blue-900 text-blue-400 bg-blue-950",
  completed:   "border-green-900 text-green-400 bg-green-950",
}

function statusLabel(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function PortalRevisions() {
  const { data: revisions = [], isLoading } = usePortalRevisions()
  const { data: projects = [] } = usePortalProjects()
  const createRevision = useCreateRevision()

  const [description, setDescription] = useState("")
  const [projectId, setProjectId] = useState<string>("")
  const [showForm, setShowForm] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim() || !projectId) return
    await createRevision.mutateAsync({
      projectId: parseInt(projectId, 10),
      description: description.trim(),
    })
    setDescription("")
    setProjectId("")
    setShowForm(false)
    toast.success("Revision request submitted.")
  }

  return (
    <PortalLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-lg font-display font-bold text-white tracking-tight">Revision Requests</h1>
            <p className="text-neutral-500 text-sm mt-1">
              Request changes or revisions on your active projects.
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            size="sm"
            className="bg-white text-black hover:bg-neutral-200 font-semibold gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Request Revision
          </Button>
        </div>

        {/* New revision form */}
        {showForm && (
          <div className="border border-white/15 bg-white/[0.03] p-6 mb-6">
            <h2 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              New Revision Request
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Project</label>
                <Select value={projectId} onValueChange={setProjectId} required>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)} className="text-white">
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the revision you need…"
                  rows={4}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={createRevision.isPending || !projectId || !description.trim()}
                  className="bg-white text-black hover:bg-neutral-200 font-semibold"
                >
                  {createRevision.isPending ? "Submitting…" : "Submit Request"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-white/15 text-neutral-400 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => <Skeleton key={i} className="h-24 bg-white/5" />)}
          </div>
        ) : revisions.length === 0 ? (
          <div className="border border-white/10 bg-white/[0.02] p-10 text-center">
            <RefreshCw className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">No revision requests yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {revisions.map((r) => (
              <div key={r.id} className="border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <p className="text-sm text-neutral-300 leading-relaxed flex-1">{r.description}</p>
                  <span className={cn(
                    "text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border shrink-0",
                    STATUS_STYLES[r.status] ?? "border-white/10 text-neutral-500"
                  )}>
                    {statusLabel(r.status)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-neutral-600 font-mono">
                  <span>Submitted {format(new Date(r.createdAt), "MMM d, yyyy")}</span>
                  {r.status !== r.status && (
                    <span>Updated {format(new Date(r.updatedAt), "MMM d, yyyy")}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  )
}
