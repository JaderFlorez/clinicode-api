import { IPaciente } from "../../dominio/entidades/pacientes/Ipaciente";
import { IPacienteRepositorio } from "../../dominio/repository/IPacienteRepositorio";

export class ActualizarPaciente {
    constructor(private readonly repo: IPacienteRepositorio) {}

    async ejecutar(idPaciente: string, datosPaciente: IPaciente): Promise<IPaciente | null>{
        const pacienteActualizado = await this.repo.actualizarPaciente(idPaciente,datosPaciente);
        return pacienteActualizado || null;
    }
};