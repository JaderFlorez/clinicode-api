import { IAsignacionMedicoConsultorio } from "../../dominio/entidades/asignacionMedicoConsultorio/IAsignacionMedicoConsultorio";
import { IAsignacionMedicoConsultorioRepositorio } from "../../dominio/repository/IAsignacionMedicoConsultorioRepositorio";

export class ListarAsignacionMedicoConsultorio {
    constructor(private readonly repo: IAsignacionMedicoConsultorioRepositorio) {}

    async ejecutar(limite?:number): Promise<IAsignacionMedicoConsultorio[]> {
        const asignacionesObtenidas = this.repo.listarAsignacionMedicoConsultorio(limite);
        return await asignacionesObtenidas;

    }
};