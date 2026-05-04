import { z } from "zod";

export const settingsSchema = z.object({
  name: z.string().min(1),
  legalName: z.string().min(1),
  rtn: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(1),
  celular: z.string().default(""),
  email: z.email("Correo inválido"),
  cai: z.string().min(1),
  rangoDesde: z.string().min(1),
  rangoHasta: z.string().min(1),
  fechaRecepcion: z.string().min(1),
  fechaLimiteEmision: z.string().min(1),
  numeroInicioSistema: z.coerce.number().int().min(1).default(1),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
