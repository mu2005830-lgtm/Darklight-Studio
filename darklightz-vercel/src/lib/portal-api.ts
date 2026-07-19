/**
 * Portal API client — typed wrappers around the /api/portal/* endpoints.
 * The Supabase JWT is automatically attached by customFetch (via setAuthTokenGetter
 * called from PortalAuthProvider).
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "./api-client/custom-fetch";
import { supabase } from "./supabase";

const base = () => (import.meta.env.BASE_URL ?? "").replace(/\/$/, "");

// ── Types ─────────────────────────────────────────────────────────────────

export interface PortalUser {
  id: number;
  supabaseUserId: string;
  email: string;
  name: string;
  company: string;
  phone: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortalProject {
  id: number;
  portalUserId: number;
  title: string;
  orderId: string;
  serviceName: string;
  assignedTeamMember: string;
  status: string;
  progressPct: number;
  startDate: string;
  estCompletionDate: string;
  latestUpdate: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortalMilestone {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  completedAt: string | null;
  sortOrder: number;
}

export interface PortalProjectFile {
  id: number;
  projectId: number;
  name: string;
  url: string;
  sizeBytes: number;
  uploadedBy: string;
  createdAt: string;
}

export interface PortalProjectDetail extends PortalProject {
  milestones: PortalMilestone[];
  files: PortalProjectFile[];
}

export interface PortalMessage {
  id: number;
  projectId: number | null;
  portalUserId: number;
  sender: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface PortalRevision {
  id: number;
  projectId: number;
  portalUserId: number;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortalTicket {
  id: number;
  portalUserId: number;
  subject: string;
  body: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortalTicketReply {
  id: number;
  ticketId: number;
  sender: string;
  body: string;
  createdAt: string;
}

export interface PortalTicketDetail extends PortalTicket {
  replies: PortalTicketReply[];
}

export interface PortalInvoice {
  id: number;
  portalUserId: number;
  projectId: number | null;
  title: string;
  amountCents: number;
  currency: string;
  status: string;
  issuedAt: string;
  dueAt: string;
  paidAt: string;
  invoiceUrl: string;
  createdAt: string;
}

export interface PortalNotification {
  id: number;
  portalUserId: number;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  relatedId: number | null;
  createdAt: string;
}

// ── Keys ──────────────────────────────────────────────────────────────────

export const portalKeys = {
  me: () => ["portal", "me"] as const,
  projects: () => ["portal", "projects"] as const,
  project: (id: number) => ["portal", "projects", id] as const,
  messages: () => ["portal", "messages"] as const,
  projectMessages: (projectId: number) => ["portal", "messages", "project", projectId] as const,
  revisions: () => ["portal", "revisions"] as const,
  tickets: () => ["portal", "tickets"] as const,
  ticket: (id: number) => ["portal", "tickets", id] as const,
  invoices: () => ["portal", "invoices"] as const,
  notifications: () => ["portal", "notifications"] as const,
};

// ── Hooks — Me ─────────────────────────────────────────────────────────────

export function usePortalMe() {
  return useQuery({
    queryKey: portalKeys.me(),
    queryFn: () => customFetch<PortalUser>(`${base()}/api/portal/me`),
  });
}

export function useUpdatePortalMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Pick<PortalUser, "name" | "company" | "phone" | "avatarUrl">>) =>
      customFetch<PortalUser>(`${base()}/api/portal/me`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: portalKeys.me() }),
  });
}

// ── Hooks — Projects ───────────────────────────────────────────────────────

export function usePortalProjects() {
  return useQuery({
    queryKey: portalKeys.projects(),
    queryFn: () => customFetch<PortalProject[]>(`${base()}/api/portal/projects`),
  });
}

export function usePortalProject(id: number) {
  return useQuery({
    queryKey: portalKeys.project(id),
    queryFn: () => customFetch<PortalProjectDetail>(`${base()}/api/portal/projects/${id}`),
  });
}

export function useRequestProjectUpdate() {
  return useMutation({
    mutationFn: (projectId: number) =>
      customFetch<{ ok: boolean }>(`${base()}/api/portal/projects/${projectId}/request-update`, {
        method: "POST",
      }),
  });
}

// ── Hooks — Messages ───────────────────────────────────────────────────────

export function usePortalMessages() {
  return useQuery({
    queryKey: portalKeys.messages(),
    queryFn: () => customFetch<PortalMessage[]>(`${base()}/api/portal/messages`),
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { body: string; projectId?: number }) =>
      customFetch<PortalMessage>(`${base()}/api/portal/messages`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: portalKeys.messages() }),
  });
}

export function useMarkMessageRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      customFetch<{ ok: boolean }>(`${base()}/api/portal/messages/${id}/read`, {
        method: "PATCH",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: portalKeys.messages() }),
  });
}

// ── Hooks — Revisions ─────────────────────────────────────────────────────

export function usePortalRevisions() {
  return useQuery({
    queryKey: portalKeys.revisions(),
    queryFn: () => customFetch<PortalRevision[]>(`${base()}/api/portal/revisions`),
  });
}

export function useCreateRevision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { projectId: number; description: string }) =>
      customFetch<PortalRevision>(`${base()}/api/portal/revisions`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: portalKeys.revisions() }),
  });
}

// ── Hooks — Tickets ────────────────────────────────────────────────────────

export function usePortalTickets() {
  return useQuery({
    queryKey: portalKeys.tickets(),
    queryFn: () => customFetch<PortalTicket[]>(`${base()}/api/portal/tickets`),
  });
}

export function usePortalTicket(id: number) {
  return useQuery({
    queryKey: portalKeys.ticket(id),
    queryFn: () => customFetch<PortalTicketDetail>(`${base()}/api/portal/tickets/${id}`),
    enabled: id > 0,
  });
}

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { subject: string; body: string }) =>
      customFetch<PortalTicket>(`${base()}/api/portal/tickets`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: portalKeys.tickets() }),
  });
}

export function useReplyToTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, body }: { ticketId: number; body: string }) =>
      customFetch<PortalTicketReply>(`${base()}/api/portal/tickets/${ticketId}/replies`, {
        method: "POST",
        body: JSON.stringify({ body }),
      }),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: portalKeys.ticket(vars.ticketId) }),
  });
}

export function useCloseTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      customFetch<PortalTicket>(`${base()}/api/portal/tickets/${id}/close`, { method: "PATCH" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: portalKeys.tickets() }),
  });
}

// ── Hooks — Project file upload ────────────────────────────────────────────

export function useUploadProjectFile(projectId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      const BASE = base();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token ?? "";
      const res = await fetch(`${BASE}/api/portal/projects/${projectId}/files`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json() as Promise<PortalProjectFile>;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: portalKeys.project(projectId) }),
  });
}

// ── Hooks — Invoices ───────────────────────────────────────────────────────

export function usePortalInvoices() {
  return useQuery({
    queryKey: portalKeys.invoices(),
    queryFn: () => customFetch<PortalInvoice[]>(`${base()}/api/portal/invoices`),
  });
}

// ── Hooks — Notifications ──────────────────────────────────────────────────

export function usePortalNotifications() {
  return useQuery({
    queryKey: portalKeys.notifications(),
    queryFn: () => customFetch<PortalNotification[]>(`${base()}/api/portal/notifications`),
    refetchInterval: 30_000, // poll every 30s for new notifications
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      customFetch<{ ok: boolean }>(`${base()}/api/portal/notifications/${id}/read`, {
        method: "PATCH",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: portalKeys.notifications() }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      customFetch<{ ok: boolean }>(`${base()}/api/portal/notifications/read-all`, {
        method: "PATCH",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: portalKeys.notifications() }),
  });
}
