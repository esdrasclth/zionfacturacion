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
  const rangoChanged = !existing || existing.rangoDesde !== parsed.data.rangoDesde;

  const company = await db.company.upsert({
    where: { id: "singleton" },
    update: {
      ...parsed.data,
      fechaRecepcion: new Date(parsed.data.fechaRecepcion),
      fechaLimiteEmision: new Date(parsed.data.fechaLimiteEmision),
      ...(rangoChanged ? { currentInvoiceNum: parseRangoNum(parsed.data.rangoDesde) } : {}),
    },
    create: {
      id: "singleton",
      ...parsed.data,
      fechaRecepcion: new Date(parsed.data.fechaRecepcion),
      fechaLimiteEmision: new Date(parsed.data.fechaLimiteEmision),
      currentInvoiceNum: parseRangoNum(parsed.data.rangoDesde),
    },
  });

  revalidatePath("/settings");
  return { company };
}
