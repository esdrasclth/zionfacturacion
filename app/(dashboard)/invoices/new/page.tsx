import { getClients } from "@/lib/actions/clients";
import { InvoiceForm } from "@/components/invoice/invoice-form";

export default async function NewInvoicePage() {
  const clients = await getClients();
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nueva Factura</h1>
        <p className="text-sm text-gray-500 mt-1">Completa los datos para crear una nueva factura</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <InvoiceForm clients={clients} />
      </div>
    </div>
  );
}
