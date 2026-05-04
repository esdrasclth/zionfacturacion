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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Facturas</h1>
          <p className="text-sm text-gray-500 mt-1">{invoices.length} factura{invoices.length !== 1 ? "s" : ""} en total</p>
        </div>
        <Link
          href="/invoices/new"
          className="flex items-center gap-1.5 text-sm bg-gray-950 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nueva Factura
        </Link>
      </div>

      <div className="mb-5">
        <form className="relative w-80">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por número o cliente..."
            className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-950 focus:border-transparent transition"
          />
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Número</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3.5 font-mono text-xs text-gray-600">{inv.number}</td>
                <td className="px-6 py-3.5 font-medium text-gray-800">{inv.client.nombre}</td>
                <td className="px-6 py-3.5 text-gray-500 text-xs">{formatDate(inv.issueDate)}</td>
                <td className="px-6 py-3.5"><Badge status={inv.status as "DRAFT" | "ISSUED" | "PAID" | "VOID"} /></td>
                <td className="px-6 py-3.5 text-right font-semibold text-gray-900">L. {formatLps(inv.total)}</td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/invoices/${inv.id}`} className="text-xs font-medium text-gray-950 border border-gray-200 px-2.5 py-1 rounded hover:bg-gray-100 transition-colors">
                      Ver →
                    </Link>
                    <Link href={`/invoices/${inv.id}/edit`} className="text-xs font-medium text-gray-600 border border-gray-200 px-2.5 py-1 rounded hover:bg-gray-100 transition-colors">
                      Editar
                    </Link>
                    <DeleteInvoiceButton id={inv.id} compact />
                  </div>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">No se encontraron facturas</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
