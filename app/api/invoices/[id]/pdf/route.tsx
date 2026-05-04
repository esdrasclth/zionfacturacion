import { renderToStream } from "@react-pdf/renderer";
import { readFileSync } from "fs";
import { join } from "path";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { InvoicePdf } from "@/pdf/invoice-pdf";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;

  const invoice = await db.invoice.findUnique({
    where: { id },
    include: { client: true, items: { orderBy: { order: "asc" } } },
  });

  if (!invoice) return new Response("Not found", { status: 404 });

  const company = await db.company.findFirst({ where: { id: "singleton" } });
  if (!company) return new Response("Company not configured", { status: 500 });

  const inv = {
    ...invoice,
    exonerado: Number(invoice.exonerado),
    descuento: Number(invoice.descuento),
    exento: Number(invoice.exento),
    gravado15: Number(invoice.gravado15),
    gravado18: Number(invoice.gravado18),
    isv15: Number(invoice.isv15),
    isv18: Number(invoice.isv18),
    total: Number(invoice.total),
    items: invoice.items.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      discount: Number(item.discount),
      total: Number(item.total),
      isvRate: Number(item.isvRate),
    })),
  };

  const logoBuffer = readFileSync(join(process.cwd(), "public", "logo.png"));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  const stream = await renderToStream(
    <InvoicePdf invoice={inv} company={company} logoSrc={logoSrc} />
  );

  return new Response(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="factura-${invoice.number}.pdf"`,
    },
  });
}
