"use server";
import { db } from "@/lib/db";
import { clientSchema, type ClientInput } from "@/lib/validations/client";
import { revalidatePath } from "next/cache";

export async function getClients() {
  return db.client.findMany({ orderBy: { nombre: "asc" } });
}

export async function getClient(id: string) {
  return db.client.findUnique({
    where: { id },
    include: { _count: { select: { invoices: true } } },
  });
}

export async function createClient(data: ClientInput) {
  const parsed = clientSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const client = await db.client.create({ data: parsed.data });
  revalidatePath("/clients");
  return { client };
}

export async function updateClient(id: string, data: ClientInput) {
  const parsed = clientSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const client = await db.client.update({ where: { id }, data: parsed.data });
  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
  return { client };
}

export async function deleteClient(id: string) {
  const count = await db.invoice.count({ where: { clientId: id } });
  if (count > 0) {
    return { error: "No se puede eliminar un cliente con facturas asociadas" };
  }
  await db.client.delete({ where: { id } });
  revalidatePath("/clients");
  return { success: true };
}
