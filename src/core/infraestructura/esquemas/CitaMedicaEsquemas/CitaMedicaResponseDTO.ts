import { EstadoCita } from "../../../../common/estadoCita";

/**
 * DTO para la respuesta de cita médica
 * Incluye todos los campos de la entidad
 */
export interface CitaMedicaResponseDTO {
    id_cita: string;
    id_paciente: string;
    id_medico: string;
    id_consultorio: string;
    fecha_cita: string;
    motivoCita: string;
    estado: EstadoCita;
    creadaEn: string;
    actualizadaEn: string | null;
}

/**
 * DTO para el ID de la cita médica en params
 */
export interface CitaMedicaIdDTO {
    id_cita: string;
}
