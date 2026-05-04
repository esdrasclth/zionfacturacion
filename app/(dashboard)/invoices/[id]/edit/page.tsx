import { getInvoice } from "@/lib/actions/invoices";
import { getClients } from "@/lib/actions/clients";
import { InvoiceForm } from "@/components/invoice/invoice-form";
import { notFound } from "next/navigation";

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [invoice, clients] = await Promise.all([getInvoice(id), getClients()]);
  if (!invoice) notFound();

  const inv = {
    ...invoice,
    items: invoice.items.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      discount: Number(item.discount),
      total: Number(item.total),
      isvRate: Number(item.isvRate),
    })),
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Editar Factura</h1>
      <p className="text-sm text-gray-500 mb-6 font-mono">{invoice.number}</p>
      <div className="bg-white rounded-lg border p-6">
        <InvoiceForm clients={clients} invoice={inv} />
      </div>
    </div>
  );
}
