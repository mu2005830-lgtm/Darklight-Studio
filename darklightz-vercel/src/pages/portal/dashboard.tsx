import { Link } from "wouter"
import { usePortalAuth } from "@/lib/portal-auth"
import { usePortalMe, usePortalProjects, usePortalNotifications, useMarkAllNotificationsRead } from "@/lib/portal-api"
import { PortalLayout } from "@/components/layout/PortalLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Bell, BellOff, Folder, CheckCircle2, Clock, ChevronRight,
  AlertCircle, BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const STATUS_STYLES: Record<string, string> = {
  pending:      "bg-neutral-800 text-neutral-400 border-neutral-700",
  active:       "bg-blue-950 text-blue-400 border-blue-900",
  in_progress:  "bg-amber-950 text-amber-400 border-amber-900",
  completed:    "bg-green-950 text-green-400 border-green-900",
  cancelled:    "bg-red-950 text-red-400 border-red-900",
}

function statusLabel(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function PortalDashboard() {
  const { user } = usePortalAuth()
  const { data: me } = usePortalMe()
  const { data: projects = [], isLoading: projectsLoading } = usePortalProjects()
  const { data: notifications = [], isLoading: notifLoading } = usePortalNotifications()
  const markAllRead = useMarkAllNotificationsRead()

  const active = projects.filter((p) => p.status !== "completed" && p.status !== "cancelled")
  const completed = projects.filter((p) => p.status === "completed")
  const unread = notifications.filter((n) => !n.isRead)

  const displayName = me?.name || user?.email?.split("@")[0] || "Client"

  return (
    <PortalLayout>
      {/* Welcome */}
      <div className="mb-8">
        <p className="text-xs text-neutral-600 font-mono uppercase tracking-widest mb-1">
          Welcome back
        </p>
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">
          {displayName}
        </h1>
        {me?.company && (
          <p className="text-neutral-500 text-sm mt-1">{me.company}</p>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Projects", value: active.length, icon: Folder, color: "text-blue-400" },
          { label: "Completed", value: completed.length, icon: CheckCircle2, color: "text-green-400" },
          { label: "Upcoming", value: active.filter((p) => p.status === "pending").length, icon: Clock, color: "text-amber-400" },
          { label: "Notifications", value: unread.length, icon: Bell, color: "text-white" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-neutral-600 uppercase tracking-wider font-mono">{label}</span>
              <Icon className={cn("w-4 h-4", color)} />
            </div>
            <p className="text-3xl font-display font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Projects */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Your Projects
            </h2>
            <Link href="/portal" className="text-xs text-neutral-500 hover:text-white transition-colors flex items-center gap-1">
              All projects <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {projectsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <Skeleton key={i} className="h-28 bg-white/5" />)}
            </div>
          ) : projects.length === 0 ? (
            <div className="border border-white/10 bg-white/[0.02] p-8 text-center">
              <Folder className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-500 text-sm">No projects yet.</p>
              <p className="text-neutral-700 text-xs mt-1">Projects assigned to you will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <Link
                  key={project.id}
                  href={`/portal/projects/${project.id}`}
                  className="block border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-white/20 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-medium text-sm group-hover:text-white transition-colors">
                        {project.title}
                      </p>
                      {project.orderId && (
                        <p className="text-neutral-600 text-xs font-mono mt-0.5">#{project.orderId}</p>
                      )}
                    </div>
                    <span className={cn(
                      "text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border shrink-0",
                      STATUS_STYLES[project.status] ?? STATUS_STYLES.pending
                    )}>
                      {statusLabel(project.status)}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-600">Progress</span>
                      <span className="text-neutral-400 font-mono">{project.progressPct}%</span>
                    </div>
                    <Progress value={project.progressPct} className="h-1 bg-white/10" />
                  </div>

                  {project.latestUpdate && (
                    <p className="text-neutral-600 text-xs mt-3 line-clamp-1">{project.latestUpdate}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Notifications
            </h2>
            {unread.length > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                className="text-xs text-neutral-500 hover:text-white transition-colors flex items-center gap-1"
              >
                <BellOff className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          {notifLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 bg-white/5" />)}
            </div>
          ) : notifications.length === 0 ? (
            <div className="border border-white/10 bg-white/[0.02] p-6 text-center">
              <Bell className="w-6 h-6 text-neutral-700 mx-auto mb-2" />
              <p className="text-neutral-600 text-xs">No notifications</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[480px] overflow-y-auto">
              {notifications.slice(0, 10).map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "border p-3 text-xs transition-all",
                    n.isRead
                      ? "border-white/5 bg-white/[0.01] text-neutral-600"
                      : "border-white/15 bg-white/[0.04] text-white"
                  )}
                >
                  <p className={cn("font-medium mb-0.5", n.isRead ? "text-neutral-500" : "text-white")}>
                    {n.title}
                  </p>
                  {n.body && <p className="text-neutral-600 line-clamp-2">{n.body}</p>}
                  <p className="text-neutral-700 font-mono mt-1.5">
                    {format(new Date(n.createdAt), "MMM d, h:mm a")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  )
}
