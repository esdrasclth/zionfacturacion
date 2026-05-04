import { db } from "@/lib/db";
import { formatLps, formatDate } from "@/lib/format";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const [invoiceCount, clientCount, recentInvoices] = await Promise.all([
    db.invoice.count(),
    db.client.count(),
    db.invoice.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { client: { select: { nombre: true } } },
    }),
  ]);

  const monthTotal = await db.invoice.aggregate({
    _sum: { total: true },
    where: {
      createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      status: { not: "VOID" },
    },
  });

  const stats = [
    {
      label: "Total Facturas",
      value: invoiceCount,
      accent: "border-blue-500",
      icon: <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    },
    {
      label: "Clientes",
      value: clientCount,
      accent: "border-emerald-500",
      icon: <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    },
    {
      label: "Facturado este mes",
      value: `L. ${formatLps(monthTotal._sum.total ?? 0)}`,
      accent: "border-violet-500",
      icon: <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen general del sistema de facturación</p>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`bg-white rounded-xl border border-gray-200 border-t-4 ${s.accent} p-5 shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">{s.label}</span>
              {s.icon}
            </div>
            <div className="text-3xl font-bold text-gray-900">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">Facturas Recientes</h2>
            <p className="text-xs text-gray-400 mt-0.5">Últimas 5 facturas creadas</p>
          </div>
          <Link
            href="/invoices/new"
            className="flex items-center gap-1.5 text-sm bg-gray-950 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nueva Factura
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Número</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3.5">
                  <Link href={`/invoices/${inv.id}`} className="font-mono text-xs text-blue-600 hover:text-blue-800 hover:underline">
                    {inv.number}
                  </Link>
                </td>
                <td className="px-6 py-3.5 font-medium text-gray-800">{inv.client.nombre}</td>
                <td className="px-6 py-3.5 text-gray-500 text-xs">{formatDate(inv.issueDate)}</td>
                <td className="px-6 py-3.5"><Badge status={inv.status as "DRAFT" | "ISSUED" | "PAID" | "VOID"} /></td>
                <td className="px-6 py-3.5 text-right font-semibold text-gray-900">L. {formatLps(inv.total)}</td>
              </tr>
            ))}
            {recentInvoices.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">No hay facturas aún</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
