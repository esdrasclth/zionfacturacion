import { getClients } from "@/lib/actions/clients";
import Link from "next/link";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Clientes</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {clients.length} cliente{clients.length !== 1 ? "s" : ""} registrado{clients.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/clients/new"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nuevo Cliente
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="border-b border-slate-100" style={{ background: "var(--color-surface-1)" }}>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Nombre</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">RTN</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Teléfono</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Correo</th>
              <th className="px-6 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {clients.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/60 transition-colors duration-100">
                <td className="px-6 py-4 font-medium text-slate-800">{c.nombre}</td>
                <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600">{c.rtn}</td>
                <td className="px-6 py-4 text-slate-500">{c.telefono || <span className="text-slate-300">—</span>}</td>
                <td className="px-6 py-4 text-slate-500">{c.email || <span className="text-slate-300">—</span>}</td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/clients/${c.id}/edit`}
                        className="text-xs font-medium text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                    </svg>
                    <span className="text-sm">No hay clientes registrados</span>
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
