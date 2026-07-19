import { usePortalInvoices } from "@/lib/portal-api"
import { useRoute } from "wouter"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

function formatAmount(cents: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-PK", { style: "currency", currency }).format(cents / 100)
  } catch {
    return `${currency} ${(cents / 100).toFixed(0)}`
  }
}

export default function InvoicePrint() {
  const [, params] = useRoute("/portal/invoices/:id/print")
  const invoiceId = params?.id ? parseInt(params.id, 10) : null
  const { data: invoices = [] } = usePortalInvoices()
  const inv = invoices.find((i) => i.id === invoiceId)

  if (!inv) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-500">Loading invoice…</p>
    </div>
  )

  return (
    <div className="bg-white min-h-screen p-0">
      {/* Print controls — hidden when printing */}
      <div className="print:hidden sticky top-0 z-10 bg-gray-100 border-b border-gray-200 px-8 py-3 flex items-center justify-between">
        <span className="text-sm text-gray-500 font-mono">Invoice #{inv.id} — {inv.title}</span>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="px-5 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-900 transition-colors"
          >
            Download PDF
          </button>
          <button
            onClick={() => window.close()}
            className="px-4 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Invoice document */}
      <div className="max-w-3xl mx-auto px-12 py-16 print:py-10 print:px-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-16 print:mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-black uppercase">DARKLIGHTZ</h1>
            <p className="text-gray-400 text-sm mt-1">STUDIO</p>
            <div className="mt-4 text-sm text-gray-600 space-y-0.5">
              <p>darklightzstudiu@gmail.com</p>
              <p>+92 335 0501287</p>
              <p>Walton, Lahore, Punjab, Pakistan</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-1">Invoice</p>
            <p className="text-4xl font-black text-black">#{inv.id}</p>
            <div className="mt-4 text-sm text-gray-600 space-y-0.5">
              {inv.issuedAt && <p>Issued: {format(new Date(inv.issuedAt), "dd MMM yyyy")}</p>}
              {inv.dueAt && <p>Due: {format(new Date(inv.dueAt), "dd MMM yyyy")}</p>}
              <p className={cn(
                "mt-2 inline-block px-3 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full",
                inv.status === "paid" ? "bg-green-100 text-green-700" :
                inv.status === "overdue" ? "bg-red-100 text-red-700" :
                "bg-yellow-100 text-yellow-700"
              )}>
                {inv.status}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-black mb-12 print:mb-8" />

        {/* Service line item */}
        <div className="mb-12 print:mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Description</th>
                <th className="text-right py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-5 text-black font-medium">{inv.title}</td>
                <td className="py-5 text-black font-medium text-right">{formatAmount(inv.amountCents, inv.currency)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex justify-end mb-16 print:mb-12">
          <div className="w-64">
            <div className="flex justify-between py-3 border-t-2 border-black">
              <p className="font-black text-lg uppercase tracking-wider text-black">Total</p>
              <p className="font-black text-lg text-black">{formatAmount(inv.amountCents, inv.currency)}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-400">Thank you for choosing Darklightz Studio.</p>
          <p className="text-xs text-gray-300 mt-2">darklightzstudiu@gmail.com · +92 335 0501287 · Walton, Lahore, Pakistan</p>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  )
}
