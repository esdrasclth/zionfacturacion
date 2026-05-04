import { z } from "zod";

export const invoiceItemSchema = z.object({
  quantity: z.number().positive("La cantidad debe ser mayor a 0"),
  description: z.string().min(1, "La descripción es requerida"),
  unitPrice: z.number().min(0),
  discount: z.number().min(0).default(0),
  isvRate: z.number().refine((v) => [0, 15, 18].includes(v), "ISV debe ser 0, 15 o 18"),
  order: z.number().int().default(0),
});

export const TIPOS_PAGO = ["CONTADO", "CREDITO", "TRANSFERENCIA", "CHEQUE"] as const;
export type TipoPago = typeof TIPOS_PAGO[number];

export const invoiceSchema = z.object({
  clientId: z.string().min(1, "Selecciona un cliente"),
  issueDate: z.string().min(1, "La fecha es requerida"),
  tipoPago: z.enum(TIPOS_PAGO).default("CONTADO"),
  ordenCompraExenta: z.string().optional(),
  regExonerados: z.string().optional(),
  regSag: z.string().optional(),
  carnetDiplomatico: z.string().optional(),
  exportacionCA: z.boolean().default(false),
  exportacionFueraCA: z.boolean().default(false),
  items: z.array(invoiceItemSchema).min(1, "Agrega al menos un ítem"),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type InvoiceItemInput = z.infer<typeof invoiceItemSchema>;
