import { IConsultorioRepositorio } from "../../dominio/repository/IConsultorioRepositorio";
import { ActualizarConsultorioDTO } from "../../infraestructura/esquemas/ConsultorioEsquema";
import { Consultorio } from "../../dominio/entidades/consultorios/IConsultorio";

export class ActualizarConsultorio {
    constructor(private repo: IConsultorioRepositorio) { }

    async ejecutar(id_consultorio: string, datos: ActualizarConsultorioDTO): Promise<Consultorio> {
        const resultado = await this.repo.actualizar(id_consultorio, datos);
        return resultado;
    }
}
