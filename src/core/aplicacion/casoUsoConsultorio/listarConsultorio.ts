import { IConsultorioRepositorio } from "../../dominio/repository/IConsultorioRepositorio";
import { Consultorio } from "../../dominio/entidades/consultorios/IConsultorio";


export class ListarConsultorios {
    constructor(private repo: IConsultorioRepositorio) { }

    async ejecutar(): Promise<Consultorio[]> {
        return await this.repo.listar();
    }
}
