import { EstadosCita } from "../../../common/estadoCita";
import { CitasMedicas } from "../../dominio/entidades/CitasMedicas/CitasMedicas";
import { ICitasMedicas } from "../../dominio/entidades/CitasMedicas/ICitasMedicas";
import { ICitasMedicasRepositorio } from "../../dominio/repository/ICitasMedicasRepositorio";
import { IConsultorioRepositorio } from "../../dominio/repository/IConsultorioRepositorio";
import { IMedicosRepositorio } from "../../dominio/repository/IMedicoRepositorio";
import { IPacienteRepositorio } from "../../dominio/repository/IPacienteRepositorio";
import { CrearCitaMedicaDTO } from "../../infraestructura/esquemas/CitaMedicaEsquemas/CrearCitaMedicaEsquema";
export class CrearCitaMedicaCasoUso {
    constructor(
        private citaRepositorio: ICitasMedicasRepositorio,
        private pacienteRepositorio: IPacienteRepositorio,
        private medicoRepositorio: IMedicosRepositorio,
        private consultorioRepositorio: IConsultorioRepositorio
    ) { }

    async ejecutar(datos: ICitasMedicas): Promise<ICitasMedicas> {

        const paciente = await this.pacienteRepositorio.obtenerPacientePorId(datos.id_paciente);
        if (!paciente) throw new Error("El paciente no existe.");

        const medico = await this.medicoRepositorio.obtenerMedicoPorId(datos.id_medico);
        if (!medico) throw new Error("El médico no existe.");

        if (datos.id_consultorio) {
            const consultorio = await this.consultorioRepositorio.obtenerConsultorioPorID(datos.id_consultorio);
            if (!consultorio) throw new Error("El consultorio no existe.");
        }

        const conflicto = await this.citaRepositorio.validarConflictosDeAgenda({
            ...datos,
            id_cita: "",
            estado: EstadosCita.PROGRAMADA,
            creadaEn: "",
            actualizadaEn: ""
        });
        if (conflicto) throw new Error(conflicto);

        const nuevaCita: ICitasMedicas = {
            ...datos,
            id_cita: crypto.randomUUID(),
            estado: EstadosCita.PROGRAMADA,
            creadaEn: new Date().toISOString(),
            actualizadaEn: null
        };

        return await this.citaRepositorio.crearCitaMedica(nuevaCita);
    }
}