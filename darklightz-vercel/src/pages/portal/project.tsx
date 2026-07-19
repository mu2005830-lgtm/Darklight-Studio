import { useRef, useState } from "react"
import { useParams, useLocation } from "wouter"
import { usePortalProject, useRequestProjectUpdate, useUploadProjectFile } from "@/lib/portal-api"
import { PortalLayout } from "@/components/layout/PortalLayout"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
  Calendar, User2, Hash, RefreshCw, Download,
  CheckCircle2, Circle, Clock, AlertTriangle, Upload, FileUp,
} from "lucide-react"
import { Link } from "wouter"
import { toast } from "sonner"

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  pending:     { bg: "bg-neutral-800", text: "text-neutral-400", border: "border-neutral-700" },
  active:      { bg: "bg-blue-950",    text: "text-blue-400",    border: "border-blue-900" },
  in_progress: { bg: "bg-amber-950",   text: "text-amber-400",   border: "border-amber-900" },
  completed:   { bg: "bg-green-950",   text: "text-green-400",   border: "border-green-900" },
  cancelled:   { bg: "bg-red-950",     text: "text-red-400",     border: "border-red-900" },
}

function statusLabel(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

function MilestoneIcon({ status }: { status: string }) {
  if (status === "complete") return <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
  return <Circle className="w-4 h-4 text-neutral-600 shrink-0" />
}

export default function PortalProject() {
  const { id } = useParams<{ id: string }>()
  const [, setLocation] = useLocation()
  const projectId = parseInt(id ?? "0", 10)
  const { data, isLoading, error } = usePortalProject(projectId)
  const requestUpdate = useRequestProjectUpdate()
  const uploadFile = useUploadProjectFile(projectId)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  if (isLoading) {
    return (
      <PortalLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64 bg-white/5" />
          <Skeleton className="h-40 bg-white/5" />
          <Skeleton className="h-60 bg-white/5" />
        </div>
      </PortalLayout>
    )
  }

  if (error || !data) {
    return (
      <PortalLayout>
        <div className="border border-red-500/20 bg-red-500/5 p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-red-400">Project not found.</p>
          <button onClick={() => setLocation("/portal")} className="mt-4 text-xs text-neutral-500 hover:text-white transition-colors">
            ← Back to dashboard
          </button>
        </div>
      </PortalLayout>
    )
  }

  const status = STATUS_STYLES[data.status] ?? STATUS_STYLES.pending

  async function handleRequestUpdate() {
    await requestUpdate.mutateAsync(projectId)
    toast.success("Update requested — we'll be in touch soon.")
  }

  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    for (const file of Array.from(files)) {
      try {
        await uploadFile.mutateAsync(file)
        toast.success(`"${file.name}" uploaded successfully.`)
      } catch {
        toast.error(`Failed to upload "${file.name}". Please try again.`)
      }
    }
  }

  return (
    <PortalLayout>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-xs text-neutral-600">
        <Link href="/portal" className="hover:text-white transition-colors">Dashboard</Link>
        <span>/</span>
        <span className="text-neutral-400">{data.title}</span>
      </div>

      {/* Header */}
      <div className="border border-white/10 bg-white/[0.02] p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-display font-bold text-white tracking-tight mb-2">
              {data.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
              {data.orderId && (
                <span className="flex items-center gap-1.5 font-mono">
                  <Hash className="w-3 h-3" /> {data.orderId}
                </span>
              )}
              {data.serviceName && (
                <span className="text-neutral-500">{data.serviceName}</span>
              )}
              {data.assignedTeamMember && (
                <span className="flex items-center gap-1.5">
                  <User2 className="w-3 h-3" /> {data.assignedTeamMember}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className={cn(
              "text-[10px] font-mono uppercase tracking-wider px-3 py-1 border",
              status.bg, status.text, status.border
            )}>
              {statusLabel(data.status)}
            </span>
            <Button
              onClick={handleRequestUpdate}
              disabled={requestUpdate.isPending}
              size="sm"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 text-xs gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              {requestUpdate.isPending ? "Requested…" : "Request Update"}
            </Button>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-white/5">
          {data.startDate && (
            <div>
              <p className="text-xs text-neutral-600 uppercase tracking-wider font-mono mb-1">Start Date</p>
              <p className="text-sm text-white flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                {data.startDate}
              </p>
            </div>
          )}
          {data.estCompletionDate && (
            <div>
              <p className="text-xs text-neutral-600 uppercase tracking-wider font-mono mb-1">Est. Completion</p>
              <p className="text-sm text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                {data.estCompletionDate}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Progress + Milestones + Latest Update */}
        <div className="md:col-span-2 space-y-6">
          {/* Progress */}
          <div className="border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Progress</h2>
              <span className="text-2xl font-display font-bold text-white">{data.progressPct}%</span>
            </div>
            <Progress value={data.progressPct} className="h-2 bg-white/10 mb-3" />
            {data.latestUpdate && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-neutral-600 uppercase tracking-wider font-mono mb-2">Latest Update</p>
                <p className="text-sm text-neutral-300 leading-relaxed">{data.latestUpdate}</p>
              </div>
            )}
          </div>

          {/* Milestones */}
          {data.milestones.length > 0 && (
            <div className="border border-white/10 bg-white/[0.02] p-6">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Milestone Timeline
              </h2>
              <div className="space-y-0">
                {data.milestones.map((m, i) => (
                  <div key={m.id} className="flex gap-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <MilestoneIcon status={m.status} />
                      {i < data.milestones.length - 1 && (
                        <div className="w-px flex-1 bg-white/10 mt-1 mb-1" />
                      )}
                    </div>
                    {/* Content */}
                    <div className={cn("pb-5 flex-1", i === data.milestones.length - 1 && "pb-0")}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={cn("text-sm font-medium", m.status === "complete" ? "text-neutral-400 line-through" : "text-white")}>
                            {m.title}
                          </p>
                          {m.description && (
                            <p className="text-xs text-neutral-600 mt-0.5">{m.description}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          {m.dueDate && (
                            <p className="text-xs text-neutral-600 font-mono">{m.dueDate}</p>
                          )}
                          {m.status === "complete" && m.completedAt && (
                            <p className="text-xs text-green-600 font-mono">
                              ✓ {format(new Date(m.completedAt), "MMM d")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Files */}
        <div className="space-y-6">
          {/* Admin-delivered files */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Delivered Files
            </h2>
            {data.files.filter(f => f.uploadedBy === "admin").length === 0 ? (
              <div className="border border-white/10 bg-white/[0.02] p-6 text-center">
                <Download className="w-6 h-6 text-neutral-700 mx-auto mb-2" />
                <p className="text-neutral-600 text-xs">No deliverables yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.files.filter(f => f.uploadedBy === "admin").map((file) => (
                  <a
                    key={file.id}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{file.name}</p>
                      <p className="text-xs text-neutral-600 font-mono mt-0.5">
                        {format(new Date(file.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Download className="w-4 h-4 text-neutral-600 group-hover:text-white shrink-0 ml-3 transition-colors" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Client file upload */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Upload Files
            </h2>
            <div
              className={cn(
                "border-2 border-dashed p-6 text-center transition-colors cursor-pointer",
                dragOver ? "border-white/40 bg-white/[0.04]" : "border-white/10 hover:border-white/25"
              )}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files) }}
            >
              <FileUp className="w-6 h-6 text-neutral-600 mx-auto mb-2" />
              <p className="text-xs text-neutral-400 mb-1">
                {uploadFile.isPending ? "Uploading…" : "Drop files here or click to browse"}
              </p>
              <p className="text-[10px] text-neutral-600">Logos, images, PDFs, Word docs, ZIPs, brand assets — up to 50 MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={e => { handleFileUpload(e.target.files); e.target.value = "" }}
            />

            {/* Client-uploaded files */}
            {data.files.filter(f => f.uploadedBy === "client").length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] text-neutral-600 uppercase tracking-wider font-mono">Your uploads</p>
                {data.files.filter(f => f.uploadedBy === "client").map((file) => (
                  <a
                    key={file.id}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{file.name}</p>
                      <p className="text-xs text-neutral-600 font-mono mt-0.5">
                        {format(new Date(file.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Upload className="w-3.5 h-3.5 text-neutral-600 shrink-0 ml-3" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  )
}
