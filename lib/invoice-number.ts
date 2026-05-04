"use server";
import { db } from "@/lib/db";

const PREFIX = "000-002-01-";

export function formatInvoiceNumber(n: number): string {
  return `${PREFIX}${n.toString().padStart(8, "0")}`;
}

export async function generateInvoiceNumber(): Promise<string> {
  const company = await db.company.findFirst({ where: { id: "singleton" } });
  if (!company) throw new Error("Company not configured");
  return formatInvoiceNumber(company.currentInvoiceNum);
}
