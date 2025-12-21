import { ICitasMedicas } from "../../dominio/entidades/CitasMedicas/ICitasMedicas";
import { ICitasMedicasRepositorio } from "../../dominio/repository/ICitasMedicasRepositorio";

export class ObtenerCitaMedicaPorIdCasoUso {
    constructor(private repositorio: ICitasMedicasRepositorio) { }

    async ejecutar(id_cita: string): Promise<ICitasMedicas | null> {
        return await this.repositorio.obtenerCitaMedicaPorID(id_cita);
    }
}