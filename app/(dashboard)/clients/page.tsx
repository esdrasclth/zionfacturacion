import { getClients } from "@/lib/actions/clients";
import Link from "next/link";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500 mt-1">{clients.length} cliente{clients.length !== 1 ? "s" : ""} registrado{clients.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/clients/new"
          className="flex items-center gap-1.5 text-sm bg-gray-950 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo Cliente
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">RTN</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Teléfono</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Correo</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {clients.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3.5 font-medium text-gray-800">{c.nombre}</td>
                <td className="px-6 py-3.5 font-mono text-xs text-gray-600">{c.rtn}</td>
                <td className="px-6 py-3.5 text-gray-500">{c.telefono || <span className="text-gray-300">—</span>}</td>
                <td className="px-6 py-3.5 text-gray-500">{c.email || <span className="text-gray-300">—</span>}</td>
                <td className="px-6 py-3.5 text-right">
                  <Link href={`/clients/${c.id}/edit`} className="text-xs font-medium text-gray-950 border border-gray-200 px-2.5 py-1 rounded hover:bg-gray-100 transition-colors">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">No hay clientes registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
