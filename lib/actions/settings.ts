"use server";
import { db } from "@/lib/db";
import { settingsSchema, type SettingsInput } from "@/lib/validations/settings";
import { revalidatePath } from "next/cache";

export async function getCompany() {
  return db.company.findFirst({ where: { id: "singleton" } });
}

function parseRangoNum(rango: string): number {
  const part = rango.split("-").pop() ?? "1";
  return parseInt(part, 10) || 1;
}

export async function upsertCompany(data: SettingsInput) {
  const parsed = settingsSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const existing = await db.company.findFirst({ where: { id: "singleton" } });

  const rangoStart = parseRangoNum(parsed.data.rangoDesde);
  const rangoEnd = parseRangoNum(parsed.data.rangoHasta);
  const inicioSistema = parsed.data.numeroInicioSistema;

  if (inicioSistema < rangoStart || inicioSistema > rangoEnd) {
    return {
      error: {
        numeroInicioSistema: [
          `Debe estar entre ${rangoStart} y ${rangoEnd} (el rango autorizado)`,
        ],
      },
    };
  }

  const rangoChanged = !existing || existing.rangoDesde !== parsed.data.rangoDesde;
  const inicioChanged = !existing || existing.numeroInicioSistema !== inicioSistema;

  // Only reset the counter when it's safe to do so
  let shouldResetCounter = false;
  if (rangoChanged) {
    shouldResetCounter = true;
  } else if (inicioChanged) {
    const invoiceCount = await db.invoice.count();
    if (invoiceCount > 0) {
      return {
        error: {
          numeroInicioSistema: [
            "No se puede cambiar el número de inicio porque ya existen facturas registradas",
          ],
        },
      };
    }
    shouldResetCounter = true;
  }

  const company = await db.company.upsert({
    where: { id: "singleton" },
    update: {
      ...parsed.data,
      fechaRecepcion: new Date(parsed.data.fechaRecepcion),
      fechaLimiteEmision: new Date(parsed.data.fechaLimiteEmision),
      ...(shouldResetCounter ? { currentInvoiceNum: inicioSistema } : {}),
    },
    create: {
      id: "singleton",
      ...parsed.data,
      fechaRecepcion: new Date(parsed.data.fechaRecepcion),
      fechaLimiteEmision: new Date(parsed.data.fechaLimiteEmision),
      currentInvoiceNum: inicioSistema,
    },
  });

  revalidatePath("/settings");
  return { company };
}
