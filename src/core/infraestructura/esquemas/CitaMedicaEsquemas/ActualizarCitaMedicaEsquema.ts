import { z } from "zod";
import { EstadosCita } from "../../../../common/estadoCita";

export const ActualizarCitaMedicaEsquema = z.object({
    id_paciente: z.uuid().optional(),
    id_medico: z.uuid().optional(),
    id_consultorio: z.uuid().optional(),
    fecha_cita: z.string().optional(),
    motivoCita: z.string().min(10).optional(),
    estado: z.enum([
        EstadosCita.ATENDIDA,
        EstadosCita.PROGRAMADA,
        EstadosCita.CANCELADA,
        EstadosCita.REPROGRAMADA
    ]).optional(),
    actualizadaEn: z.string().nullable().optional()
});

export type ActualizarCitaMedicaDTO = z.infer<typeof ActualizarCitaMedicaEsquema>;
