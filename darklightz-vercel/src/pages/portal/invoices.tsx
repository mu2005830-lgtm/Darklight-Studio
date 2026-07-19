import { usePortalInvoices } from "@/lib/portal-api"
import { PortalLayout } from "@/components/layout/PortalLayout"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Receipt, Download, ExternalLink } from "lucide-react"

const STATUS_STYLES: Record<string, string> = {
  draft:    "border-neutral-700 text-neutral-500 bg-neutral-900",
  sent:     "border-amber-900 text-amber-400 bg-amber-950",
  paid:     "border-green-900 text-green-400 bg-green-950",
  overdue:  "border-red-900 text-red-400 bg-red-950",
}

function statusLabel(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function formatAmount(cents: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100)
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency}`
  }
}

export default function PortalInvoices() {
  const { data: invoices = [], isLoading } = usePortalInvoices()

  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amountCents, 0)

  const totalPending = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((sum, i) => sum + i.amountCents, 0)

  return (
    <PortalLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-lg font-display font-bold text-white tracking-tight">Invoices</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Your payment history and outstanding invoices.
          </p>
        </div>

        {/* Summary */}
        {invoices.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Invoices", value: invoices.length.toString() },
              { label: "Paid", value: formatAmount(totalPaid, invoices[0]?.currency ?? "PKR") },
              { label: "Outstanding", value: formatAmount(totalPending, invoices[0]?.currency ?? "PKR") },
            ].map(({ label, value }) => (
              <div key={label} className="border border-white/10 bg-white/[0.02] p-5">
                <p className="text-xs text-neutral-600 uppercase tracking-wider font-mono mb-2">{label}</p>
                <p className="text-xl font-display font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Invoice list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 bg-white/5" />)}
          </div>
        ) : invoices.length === 0 ? (
          <div className="border border-white/10 bg-white/[0.02] p-10 text-center">
            <Receipt className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">No invoices yet.</p>
            <p className="text-neutral-700 text-xs mt-1">Invoices will appear here when issued.</p>
          </div>
        ) : (
          <div className="border border-white/10 divide-y divide-white/5">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3">
              <span className="col-span-4 text-xs text-neutral-600 uppercase tracking-wider font-mono">Invoice</span>
              <span className="col-span-2 text-xs text-neutral-600 uppercase tracking-wider font-mono">Issued</span>
              <span className="col-span-2 text-xs text-neutral-600 uppercase tracking-wider font-mono">Due</span>
              <span className="col-span-2 text-xs text-neutral-600 uppercase tracking-wider font-mono">Amount</span>
              <span className="col-span-2 text-xs text-neutral-600 uppercase tracking-wider font-mono">Status</span>
            </div>

            {invoices.map((inv) => (
              <div key={inv.id} className="grid grid-cols-12 gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="col-span-4">
                  <p className="text-sm text-white font-medium">{inv.title}</p>
                  <p className="text-xs text-neutral-600 font-mono mt-0.5">#{inv.id}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-neutral-400">
                    {inv.issuedAt
                      ? format(new Date(inv.issuedAt), "MMM d, yyyy")
                      : <span className="text-neutral-700">—</span>}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className={cn(
                    "text-xs",
                    inv.status === "overdue" ? "text-red-400" : "text-neutral-400"
                  )}>
                    {inv.dueAt
                      ? format(new Date(inv.dueAt), "MMM d, yyyy")
                      : <span className="text-neutral-700">—</span>}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-white font-mono">
                    {formatAmount(inv.amountCents, inv.currency)}
                  </p>
                </div>
                <div className="col-span-2 flex items-center justify-between">
                  <span className={cn(
                    "text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border",
                    STATUS_STYLES[inv.status] ?? ""
                  )}>
                    {statusLabel(inv.status)}
                  </span>
                  <a
                    href={inv.invoiceUrl ?? `/portal/invoices/${inv.id}/print`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-white transition-colors"
                    title={inv.invoiceUrl ? "Download invoice" : "View & download PDF"}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  )
}
