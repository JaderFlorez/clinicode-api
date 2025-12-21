import { IPaciente } from "../../dominio/entidades/pacientes/Ipaciente";
import { IPacienteRepositorio } from "../../dominio/repository/IPacienteRepositorio";

export class ObtenerPacientePorId {
    constructor(private readonly repo: IPacienteRepositorio) {}

    async ejecutar(idPaciente: string): Promise<IPaciente | null> {
        const pacienteObtenido = await this.repo.obtenerPacientePorId(idPaciente);
        return pacienteObtenido;
    }
};