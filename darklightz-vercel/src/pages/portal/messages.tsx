import { useState } from "react"
import {
  usePortalMessages,
  useSendMessage,
  useMarkMessageRead,
  usePortalProjects,
} from "@/lib/portal-api"
import { PortalLayout } from "@/components/layout/PortalLayout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { MessageSquare, Send } from "lucide-react"
import { toast } from "sonner"

export default function PortalMessages() {
  const { data: messages = [], isLoading } = usePortalMessages()
  const { data: projects = [] } = usePortalProjects()
  const sendMessage = useSendMessage()
  const markRead = useMarkMessageRead()

  const [body, setBody] = useState("")
  const [projectId, setProjectId] = useState<string>("none")

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    await sendMessage.mutateAsync({
      body: body.trim(),
      projectId: projectId !== "none" ? parseInt(projectId, 10) : undefined,
    })
    setBody("")
    setProjectId("none")
    toast.success("Message sent.")
  }

  const unread = messages.filter((m) => m.sender === "admin" && !m.isRead)

  return (
    <PortalLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-lg font-display font-bold text-white tracking-tight">Messages</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Direct communication with the Darklightz team.
          </p>
        </div>

        {/* Compose */}
        <div className="border border-white/10 bg-white/[0.02] p-6 mb-6">
          <h2 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
            New Message
          </h2>
          <form onSubmit={handleSend} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">
                Project (optional)
              </label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="General enquiry" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10">
                  <SelectItem value="none" className="text-neutral-400">General enquiry</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)} className="text-white">
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">
                Message
              </label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message…"
                rows={4}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 resize-none"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={sendMessage.isPending || !body.trim()}
                className="bg-white text-black hover:bg-neutral-200 font-semibold gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                {sendMessage.isPending ? "Sending…" : "Send Message"}
              </Button>
            </div>
          </form>
        </div>

        {/* Mark unread as read */}
        {unread.length > 0 && (
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-neutral-500">
              {unread.length} unread {unread.length === 1 ? "message" : "messages"} from our team
            </p>
            <button
              onClick={() => unread.forEach((m) => markRead.mutate(m.id))}
              className="text-xs text-neutral-500 hover:text-white transition-colors"
            >
              Mark all read
            </button>
          </div>
        )}

        {/* Thread */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 bg-white/5" />)}
          </div>
        ) : messages.length === 0 ? (
          <div className="border border-white/10 bg-white/[0.02] p-10 text-center">
            <MessageSquare className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">No messages yet.</p>
            <p className="text-neutral-700 text-xs mt-1">Send a message above to start a conversation.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "border p-4 transition-all",
                  m.sender === "admin"
                    ? m.isRead
                      ? "border-white/5 bg-white/[0.01]"
                      : "border-white/15 bg-white/[0.04]"
                    : "border-white/5 bg-black"
                )}
                onClick={() => {
                  if (m.sender === "admin" && !m.isRead) markRead.mutate(m.id)
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border",
                      m.sender === "admin"
                        ? "border-white/20 text-white bg-white/10"
                        : "border-white/10 text-neutral-500 bg-transparent"
                    )}>
                      {m.sender === "admin" ? "Darklightz" : "You"}
                    </span>
                    {m.sender === "admin" && !m.isRead && (
                      <span className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-xs text-neutral-600 font-mono">
                    {format(new Date(m.createdAt), "MMM d, h:mm a")}
                  </span>
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">{m.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  )
}
