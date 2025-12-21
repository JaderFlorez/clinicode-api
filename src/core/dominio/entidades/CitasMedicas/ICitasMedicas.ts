import { EstadoCita } from "../../../../common/estadoCita";

export interface ICitasMedicas {
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

export interface DatosReprogramacion {
    fecha_cita?: string;
    id_consultorio?: string;
}