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
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
    },
    {
      label: "Clientes",
      value: clientCount,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
    {
      label: "Facturado este mes",
      value: `L. ${formatLps(monthTotal._sum.total ?? 0)}`,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Resumen general del sistema de facturación</p>
        </div>
        <Link
          href="/invoices/new"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nueva Factura
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {stats.map((s) => (
          <div key={s.label}
               className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{s.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">{s.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.iconBg} ${s.iconColor}`}>
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent invoices table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="font-semibold text-slate-900">Facturas Recientes</h2>
            <p className="text-xs text-slate-400 mt-0.5">Últimas 5 facturas creadas</p>
          </div>
          <Link
            href="/invoices"
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
          >
            Ver todas →
          </Link>
        </div>

        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="border-b border-slate-100" style={{ background: "var(--color-surface-1)" }}>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Número</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Cliente</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Fecha</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Estado</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {recentInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors duration-100">
                <td className="px-6 py-4">
                  <Link href={`/invoices/${inv.id}`}
                        className="font-mono text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">
                    {inv.number}
                  </Link>
                </td>
                <td className="px-6 py-4 font-medium text-slate-800">{inv.client.nombre}</td>
                <td className="px-6 py-4 text-slate-500 text-xs">{formatDate(inv.issueDate)}</td>
                <td className="px-6 py-4">
                  <Badge status={inv.status as "DRAFT" | "ISSUED" | "PAID" | "VOID"} />
                </td>
                <td className="px-6 py-4 text-right font-semibold text-slate-900">
                  L. {formatLps(inv.total)}
                </td>
              </tr>
            ))}
            {recentInvoices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                    </svg>
                    <span className="text-sm">No hay facturas aún</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
