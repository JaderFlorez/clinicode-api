import { z } from "zod";

export const CancelarReprogramarEsquema = z.object({
    accion: z.enum(["cancelar", "reprogramar"]),
    fecha_cita: z.string().optional(),
    id_consultorio: z.string().uuid().optional()
});

export type CancelarReprogramarDTO = z.infer<typeof CancelarReprogramarEsquema>;
