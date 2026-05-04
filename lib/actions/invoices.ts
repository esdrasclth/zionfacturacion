"use server";
import { db } from "@/lib/db";
import { invoiceSchema, type InvoiceInput } from "@/lib/validations/invoice";
import { revalidatePath } from "next/cache";
import { InvoiceStatus } from "@/app/generated/prisma/client";

function calcTotals(items: InvoiceInput["items"]) {
  let gravado15 = 0, gravado18 = 0, exento = 0, descuento = 0;

  for (const item of items) {
    const net = item.unitPrice * item.quantity - item.discount;
    descuento += item.discount;
    if (item.isvRate === 15) gravado15 += net;
    else if (item.isvRate === 18) gravado18 += net;
    else exento += net;
  }

  const isv15 = gravado15 * 0.15;
  const isv18 = gravado18 * 0.18;
  const subtotal = gravado15 + gravado18 + exento;
  const total = subtotal + isv15 + isv18;

  return { subtotal, descuento, exonerado: 0, exento, gravado15, gravado18, isv15, isv18, total };
}

export async function createInvoice(data: InvoiceInput) {
  const parsed = invoiceSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const totals = calcTotals(parsed.data.items);

  const invoice = await db.$transaction(async (tx) => {
    const company = await tx.company.findFirst({ where: { id: "singleton" } });
    if (!company) throw new Error("Company not configured");

    const rangoStart = parseInt(company.rangoDesde.split("-").pop() ?? "1", 10) || 1;
    const currentNum = Math.max(company.currentInvoiceNum, rangoStart);
    const prefix = company.rangoDesde.substring(0, company.rangoDesde.lastIndexOf("-") + 1);
    const num = currentNum.toString().padStart(8, "0");
    const number = `${prefix}${num}`;

    await tx.company.update({
      where: { id: "singleton" },
      data: { currentInvoiceNum: currentNum + 1 },
    });

    return tx.invoice.create({
      data: {
        number,
        clientId: parsed.data.clientId,
        issueDate: new Date(parsed.data.issueDate),
        status: "DRAFT",
        tipoPago: parsed.data.tipoPago,
        ordenCompraExenta: parsed.data.ordenCompraExenta,
        regExonerados: parsed.data.regExonerados,
        regSag: parsed.data.regSag,
        carnetDiplomatico: parsed.data.carnetDiplomatico,
        exportacionCA: parsed.data.exportacionCA,
        exportacionFueraCA: parsed.data.exportacionFueraCA,
        cai: company.cai,
        rangoDesde: company.rangoDesde,
        rangoHasta: company.rangoHasta,
        fechaRecepcion: company.fechaRecepcion,
        fechaLimiteEmision: company.fechaLimiteEmision,
        ...totals,
        items: {
          create: parsed.data.items.map((item, i) => ({
            quantity: item.quantity,
            description: item.description,
            unitPrice: item.unitPrice,
            discount: item.discount,
            total: item.unitPrice * item.quantity - item.discount,
            isvRate: item.isvRate,
            order: i,
          })),
        },
      },
      include: { client: true, items: { orderBy: { order: "asc" } } },
    });
  });

  revalidatePath("/invoices");
  return { invoice };
}

export async function getInvoice(id: string) {
  return db.invoice.findUnique({
    where: { id },
    include: {
      client: true,
      items: { orderBy: { order: "asc" } },
    },
  });
}

export async function getInvoices(search?: string) {
  return db.invoice.findMany({
    where: search
      ? {
          OR: [
            { number: { contains: search, mode: "insensitive" } },
            { client: { nombre: { contains: search, mode: "insensitive" } } },
          ],
        }
      : undefined,
    include: { client: { select: { nombre: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateInvoice(id: string, data: InvoiceInput) {
  const parsed = invoiceSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const totals = calcTotals(parsed.data.items);

  const invoice = await db.$transaction(async (tx) => {
    await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
    return tx.invoice.update({
      where: { id },
      data: {
        clientId: parsed.data.clientId,
        issueDate: new Date(parsed.data.issueDate),
        tipoPago: parsed.data.tipoPago,
        ordenCompraExenta: parsed.data.ordenCompraExenta,
        regExonerados: parsed.data.regExonerados,
        regSag: parsed.data.regSag,
        carnetDiplomatico: parsed.data.carnetDiplomatico,
        exportacionCA: parsed.data.exportacionCA,
        exportacionFueraCA: parsed.data.exportacionFueraCA,
        ...totals,
        items: {
          create: parsed.data.items.map((item, i) => ({
            quantity: item.quantity,
            description: item.description,
            unitPrice: item.unitPrice,
            discount: item.discount,
            total: item.unitPrice * item.quantity - item.discount,
            isvRate: item.isvRate,
            order: i,
          })),
        },
      },
      include: { client: true, items: { orderBy: { order: "asc" } } },
    });
  });

  revalidatePath("/invoices");
  revalidatePath(`/invoices/${id}`);
  return { invoice };
}

export async function deleteInvoice(id: string) {
  await db.invoice.delete({ where: { id } });
  revalidatePath("/invoices");
  return { success: true };
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus) {
  const invoice = await db.invoice.update({ where: { id }, data: { status } });
  revalidatePath("/invoices");
  revalidatePath(`/invoices/${id}`);
  return { invoice };
}
