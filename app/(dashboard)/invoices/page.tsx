import { getInvoices } from "@/lib/actions/invoices";
import { formatLps, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { DeleteInvoiceButton } from "@/components/invoice/delete-invoice-button";
import Link from "next/link";

export default async function InvoicesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const invoices = await getInvoices(q);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Facturas</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {invoices.length} factura{invoices.length !== 1 ? "s" : ""} en total
          </p>
        </div>
        <Link
          href="/invoices/new"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nueva Factura
        </Link>
      </div>

      {/* Search */}
      <div className="mb-5">
        <form className="relative w-80">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
               fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por número o cliente..."
            className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white text-slate-900 placeholder-slate-400
              hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100" style={{ background: "var(--color-surface-1)" }}>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Número</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Cliente</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Fecha</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Estado</th>
              <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Total</th>
              <th className="px-6 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors duration-100">
                <td className="px-6 py-4 font-mono text-xs font-semibold text-indigo-600">{inv.number}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{inv.client.nombre}</td>
                <td className="px-6 py-4 text-slate-500 text-xs">{formatDate(inv.issueDate)}</td>
                <td className="px-6 py-4">
                  <Badge status={inv.status as "DRAFT" | "ISSUED" | "PAID" | "VOID"} />
                </td>
                <td className="px-6 py-4 text-right font-semibold text-slate-900">L. {formatLps(inv.total)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link href={`/invoices/${inv.id}`}
                          className="text-xs font-medium text-indigo-600 border border-indigo-200 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                      Ver
                    </Link>
                    <Link href={`/invoices/${inv.id}/edit`}
                          className="text-xs font-medium text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                      Editar
                    </Link>
                    <DeleteInvoiceButton id={inv.id} compact />
                  </div>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                    </svg>
                    <span className="text-sm">No se encontraron facturas</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
