import { z } from "zod";

export const clientSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  rtn: z.string().min(1, "El RTN es requerido"),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  email: z.email("Correo inválido").optional().or(z.literal("")),
});

export type ClientInput = z.infer<typeof clientSchema>;
