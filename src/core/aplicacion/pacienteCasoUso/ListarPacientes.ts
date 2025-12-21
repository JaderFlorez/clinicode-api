import { IPaciente } from "../../dominio/entidades/pacientes/Ipaciente";
import { IPacienteRepositorio } from "../../dominio/repository/IPacienteRepositorio";

export class ListarPacientes {
    constructor(private readonly repo: IPacienteRepositorio) {}

    async ejecutar(limite?:number): Promise<IPaciente[]>{
        const pacientesObtenidos = this.repo.listarPacientes(limite);
        return await pacientesObtenidos;
    }
};