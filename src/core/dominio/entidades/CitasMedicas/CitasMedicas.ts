import { ICitasMedicas } from "./ICitasMedicas";

export class CitasMedicas implements ICitasMedicas {
    id_cita: string;
    id_paciente: string;
    id_medico: string;
    id_consultorio: string;
    fecha_cita: string;
    motivoCita: string;
    estado: ICitasMedicas["estado"];
    creadaEn: string;
    actualizadaEn: string | null;


    constructor(datosCita: ICitasMedicas) {
        this.id_cita = datosCita.id_cita;
        this.id_paciente = datosCita.id_paciente;
        this.id_medico = datosCita.id_medico;
        this.id_consultorio = datosCita.id_consultorio;
        this.fecha_cita = datosCita.fecha_cita;
        this.motivoCita = datosCita.motivoCita;
        this.estado = datosCita.estado;
        this.creadaEn = datosCita.creadaEn;
        this.actualizadaEn = datosCita.actualizadaEn ?? null;
    }
}