import { getInvoice } from "@/lib/actions/invoices";
import { getCompany } from "@/lib/actions/settings";
import { InvoiceView } from "@/components/invoice/invoice-view";
import { DeleteInvoiceButton } from "@/components/invoice/delete-invoice-button";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [invoice, company] = await Promise.all([getInvoice(id), getCompany()]);
  if (!invoice || !company) notFound();

  const inv = {
    ...invoice,
    tipoPago: invoice.tipoPago,
    subtotal: Number(invoice.subtotal), descuento: Number(invoice.descuento),
    exonerado: Number(invoice.exonerado), exento: Number(invoice.exento),
    gravado15: Number(invoice.gravado15), gravado18: Number(invoice.gravado18),
    isv15: Number(invoice.isv15), isv18: Number(invoice.isv18), total: Number(invoice.total),
    items: invoice.items.map((item) => ({
      ...item,
      quantity: Number(item.quantity), unitPrice: Number(item.unitPrice),
      discount: Number(item.discount), total: Number(item.total), isvRate: Number(item.isvRate),
    })),
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/invoices" className="text-sm text-gray-500 hover:text-gray-700">← Facturas</Link>
          <Badge status={invoice.status as "DRAFT" | "ISSUED" | "PAID" | "VOID"} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/invoices/${id}/edit`}
            className="inline-flex items-center gap-1.5 border border-gray-300 text-sm px-4 py-2 rounded hover:bg-gray-50 transition-colors"
          >
            Editar
          </Link>
          <DeleteInvoiceButton id={id} redirectTo="/invoices" />
          <a
            href={`/api/invoices/${id}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            ↓ Descargar PDF
          </a>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div style={{ width: "794px" }}>
          <InvoiceView invoice={inv} company={company} />
        </div>
      </div>
    </div>
  );
}
