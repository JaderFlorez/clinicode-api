import { z } from "zod";

export const CrearConsultorioEsquema = z.object({
    nombre: z
        .string()
        .nonempty("El nombre del consultorio es obligatorio")
        .min(3, "El nombre del consultorio debe tener al menos 3 caracteres")
        .max(100, "El nombre del consultorio no puede exceder los 100 caracteres"),
    ubicacion: z
        .string()
        .nonempty("La ubicación del consultorio es obligatoria")
        .min(5, "La ubicación debe tener al menos 5 caracteres")
        .max(200, "La ubicación no puede exceder los 200 caracteres"),
    disponible: z
        .boolean()
        .default(true)
});

export const ActualizarConsultorioEsquema = z.object({
    nombre: z
        .string()
        .min(3, "El nombre del consultorio debe tener al menos 3 caracteres")
        .max(100, "El nombre del consultorio no puede exceder los 100 caracteres")
        .optional(),
    ubicacion: z
        .string()
        .min(5, "La ubicación debe tener al menos 5 caracteres")
        .max(200, "La ubicación no puede exceder los 200 caracteres")
        .optional(),
    disponible: z
        .boolean()
        .optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "Debe proporcionar al menos un campo para actualizar"
    }
);


export const ConsultorioIdEsquema = z.object({
    id_consultorio: z
        .string()
        .nonempty("El ID del consultorio es obligatorio")
});


export type CrearConsultorioDTO = z.infer<typeof CrearConsultorioEsquema>;
export type ActualizarConsultorioDTO = z.infer<typeof ActualizarConsultorioEsquema>;
export type ConsultorioIdDTO = z.infer<typeof ConsultorioIdEsquema>;


export interface ConsultorioResponseDTO {
    id: number;
    nombre: string;
    ubicacion: string;
    disponible: boolean;
}
