import { IAsignacionMedicoConsultorioRepositorio } from "../../dominio/repository/IAsignacionMedicoConsultorioRepositorio";

export class EliminarAsignacionMedicoConsultorio {
    constructor(private readonly repo: IAsignacionMedicoConsultorioRepositorio){}

    async ejecutar(idAsignacion: string): Promise<void> {
        await this.repo.eliminarAsignacionMedicoConsultorio(idAsignacion);
    }
};