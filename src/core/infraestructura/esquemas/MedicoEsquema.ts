import { z } from "zod";

export const CrearMedicoEsquema = z.object({
  nombres: z
    .string()
    .nonempty("Los nombres del médico son obligatorios")
    .min(3, "Los nombres deben tener al menos 3 caracteres")
    .max(100, "Los nombres no pueden superar los 100 caracteres"),

  apellidos: z
    .string()
    .nonempty("Los apellidos del médico son obligatorios")
    .min(3, "Los apellidos deben tener al menos 3 caracteres")
    .max(100, "Los apellidos no pueden superar los 100 caracteres"),

  numero_licencia: z
    .string()
    .nonempty("El número de licencia es obligatorio")
    .max(50, "El número de licencia no puede superar los 50 caracteres"),

  id_especialidad: z
    .string()
    .uuid("El ID de especialidad debe ser un UUID válido"),

  telefono: z
    .string()
    .max(20, "El teléfono no puede superar los 20 caracteres")
    .optional()
    .transform((val: string | undefined) => val ?? null),

  correo: z
    .string()
    .email("El correo electrónico no es válido")
    .optional()
    .transform((val) => val ?? null),
});

export type MedicoDTO = z.infer<typeof CrearMedicoEsquema>;


