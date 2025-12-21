import { ICitasMedicas } from "../../dominio/entidades/CitasMedicas/ICitasMedicas";
import { ICitasMedicasRepositorio } from "../../dominio/repository/ICitasMedicasRepositorio";
import { ActualizarCitaMedicaDTO } from "../../infraestructura/esquemas/CitaMedicaEsquemas/ActualizarCitaMedicaEsquema";


export class ActualizarCitaMedicaCasoUso {
    constructor(private repositorio: ICitasMedicasRepositorio) { }

    async ejecutar(id_cita: string, datos: ActualizarCitaMedicaDTO): Promise<ICitasMedicas | null> {

        const citaExistente = await this.repositorio.obtenerCitaMedicaPorID(id_cita);
        if (!citaExistente) {
            throw new Error("La cita médica no existe.");
        }

        const citaActualizada: ICitasMedicas = {
            id_cita: citaExistente.id_cita,
            id_paciente: datos.id_paciente ?? citaExistente.id_paciente,
            id_medico: datos.id_medico ?? citaExistente.id_medico,
            id_consultorio: datos.id_consultorio ?? citaExistente.id_consultorio,
            fecha_cita: datos.fecha_cita ?? citaExistente.fecha_cita,
            motivoCita: datos.motivoCita ?? citaExistente.motivoCita,
            estado: datos.estado ?? citaExistente.estado,
            creadaEn: citaExistente.creadaEn,
            actualizadaEn: new Date().toISOString()
        };

        return await this.repositorio.actualizarCitaMedica(id_cita, citaActualizada);
    }
}