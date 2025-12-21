import { IConsultorioRepositorio } from "../../dominio/repository/IConsultorioRepositorio";
import { CrearConsultorioDTO } from "../../infraestructura/esquemas/ConsultorioEsquema";
export class CrearConsultorio {
    constructor(private repo: IConsultorioRepositorio) { }

    async ejecutar(datos: CrearConsultorioDTO): Promise<void> {
        await this.repo.crear(datos);
    }
}
