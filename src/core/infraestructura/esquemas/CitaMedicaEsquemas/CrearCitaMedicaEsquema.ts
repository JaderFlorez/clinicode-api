import { z } from "zod";
import { EstadosCita } from "../../../../common/estadoCita";

export const CrearCitaMedicaEsquema = z.object({
    id_paciente: z.string(),
    id_medico: z.uuid(),
    id_consultorio: z.uuid(),
    fecha_cita: z.string(),
    motivoCita: z.string().min(10),
    estado: z.enum([
        EstadosCita.PROGRAMADA,
        EstadosCita.CANCELADA,
        EstadosCita.REPROGRAMADA,
        EstadosCita.ATENDIDA
    ]).default(EstadosCita.PROGRAMADA)
});

export type CrearCitaMedicaDTO = z.infer<typeof CrearCitaMedicaEsquema>;
