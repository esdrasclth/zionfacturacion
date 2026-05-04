import { config } from "dotenv";
config({ path: ".env.local" });
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const db = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("admin123", 12);

  await db.user.upsert({
    where: { email: "admin@zion.com" },
    update: {},
    create: {
      email: "admin@zion.com",
      password,
      name: "Administrador",
    },
  });

  await db.company.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      name: "ZION STUDIOS®",
      legalName: "INVERCAMA S DE R.L",
      rtn: "0801-XXXX-XXXXX",
      address: "Tegucigalpa, Honduras",
      phone: "+504 XXXX-XXXX",
      email: "info@zionstudios.com",
      cai: "000000-000000-000000-000000-000000-00",
      rangoDesde: "000-002-01-00000001",
      rangoHasta: "000-002-01-00001000",
      fechaRecepcion: new Date("2025-01-01"),
      fechaLimiteEmision: new Date("2026-12-31"),
      currentInvoiceNum: 1,
    },
  });

  console.log("✓ Seed completado");
  console.log("  Usuario: admin@zion.com / admin123");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
