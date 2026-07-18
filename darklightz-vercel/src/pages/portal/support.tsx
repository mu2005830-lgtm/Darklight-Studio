import { useState } from "react"
import { Link } from "wouter"
import {
  usePortalTickets,
  usePortalTicket,
  useCreateTicket,
  useReplyToTicket,
  useCloseTicket,
} from "@/lib/portal-api"
import { PortalLayout } from "@/components/layout/PortalLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Headphones, Plus, ChevronRight, X, Send } from "lucide-react"
import { toast } from "sonner"

const STATUS_STYLES: Record<string, string> = {
  open:        "border-amber-900 text-amber-400 bg-amber-950",
  in_progress: "border-blue-900 text-blue-400 bg-blue-950",
  closed:      "border-neutral-700 text-neutral-500 bg-neutral-900",
}

function statusLabel(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

function TicketDetail({ ticketId, onBack }: { ticketId: number; onBack: () => void }) {
  const { data, isLoading } = usePortalTicket(ticketId)
  const replyToTicket = useReplyToTicket()
  const closeTicket = useCloseTicket()
  const [reply, setReply] = useState("")

  async function handleReply(e: React.FormEvent) {
    e.preventDefault()
    if (!reply.trim()) return
    await replyToTicket.mutateAsync({ ticketId, body: reply.trim() })
    setReply("")
    toast.success("Reply sent.")
  }

  async function handleClose() {
    await closeTicket.mutateAsync(ticketId)
    toast.success("Ticket closed.")
    onBack()
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48 bg-white/5" />
        <Skeleton className="h-40 bg-white/5" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 text-xs text-neutral-600">
        <button onClick={onBack} className="hover:text-white transition-colors">Support</button>
        <span>/</span>
        <span className="text-neutral-400 truncate max-w-xs">{data.subject}</span>
      </div>

      <div className="border border-white/10 bg-white/[0.02] p-6 mb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-semibold text-white">{data.subject}</h2>
            <p className="text-xs text-neutral-600 font-mono mt-1">
              Opened {format(new Date(data.createdAt), "MMM d, yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={cn(
              "text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border",
              STATUS_STYLES[data.status] ?? ""
            )}>
              {statusLabel(data.status)}
            </span>
            {data.status !== "closed" && (
              <Button
                onClick={handleClose}
                size="sm"
                variant="outline"
                className="border-white/15 text-neutral-400 hover:text-white hover:bg-white/5 text-xs gap-1"
              >
                <X className="w-3 h-3" /> Close
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">{data.body}</p>
      </div>

      {/* Replies */}
      {data.replies.length > 0 && (
        <div className="space-y-3 mb-4">
          {data.replies.map((r) => (
            <div
              key={r.id}
              className={cn(
                "border p-4",
                r.sender === "admin"
                  ? "border-white/15 bg-white/[0.04] ml-0 mr-8"
                  : "border-white/5 bg-black ml-8 mr-0"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn(
                  "text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border",
                  r.sender === "admin"
                    ? "border-white/20 text-white bg-white/10"
                    : "border-white/10 text-neutral-500"
                )}>
                  {r.sender === "admin" ? "Darklightz" : "You"}
                </span>
                <span className="text-xs text-neutral-600 font-mono">
                  {format(new Date(r.createdAt), "MMM d, h:mm a")}
                </span>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">{r.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reply form */}
      {data.status !== "closed" && (
        <form onSubmit={handleReply} className="border border-white/10 bg-white/[0.02] p-4">
          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write a reply…"
            rows={3}
            required
            className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 resize-none mb-3"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={replyToTicket.isPending || !reply.trim()}
              size="sm"
              className="bg-white text-black hover:bg-neutral-200 font-semibold gap-1.5"
            >
              <Send className="w-3 h-3" />
              {replyToTicket.isPending ? "Sending…" : "Reply"}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default function PortalSupport() {
  const { data: tickets = [], isLoading } = usePortalTickets()
  const createTicket = useCreateTicket()

  const [activeTicketId, setActiveTicketId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!subject.trim() || !body.trim()) return
    const ticket = await createTicket.mutateAsync({ subject: subject.trim(), body: body.trim() })
    setSubject("")
    setBody("")
    setShowForm(false)
    toast.success("Support ticket created.")
    setActiveTicketId(ticket.id)
  }

  if (activeTicketId !== null) {
    return (
      <PortalLayout>
        <div className="max-w-3xl mx-auto">
          <TicketDetail ticketId={activeTicketId} onBack={() => setActiveTicketId(null)} />
        </div>
      </PortalLayout>
    )
  }

  return (
    <PortalLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-lg font-display font-bold text-white tracking-tight">Support</h1>
            <p className="text-neutral-500 text-sm mt-1">
              Open and manage your support tickets.
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            size="sm"
            className="bg-white text-black hover:bg-neutral-200 font-semibold gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            New Ticket
          </Button>
        </div>

        {/* New ticket form */}
        {showForm && (
          <div className="border border-white/15 bg-white/[0.03] p-6 mb-6">
            <h2 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Open a Ticket</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Subject</label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of your issue"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Details</label>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Describe your issue in detail…"
                  rows={5}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={createTicket.isPending}
                  className="bg-white text-black hover:bg-neutral-200 font-semibold"
                >
                  {createTicket.isPending ? "Creating…" : "Create Ticket"}
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

        {/* Ticket list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => <Skeleton key={i} className="h-20 bg-white/5" />)}
          </div>
        ) : tickets.length === 0 ? (
          <div className="border border-white/10 bg-white/[0.02] p-10 text-center">
            <Headphones className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">No support tickets yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTicketId(t.id)}
                className="w-full text-left border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-white/20 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white group-hover:text-white truncate">
                      {t.subject}
                    </p>
                    <p className="text-xs text-neutral-600 font-mono mt-1">
                      {format(new Date(t.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={cn(
                      "text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border",
                      STATUS_STYLES[t.status] ?? ""
                    )}>
                      {statusLabel(t.status)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  )
}
