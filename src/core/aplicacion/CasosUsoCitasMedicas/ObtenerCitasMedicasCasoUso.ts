import { ICitasMedicas } from "../../dominio/entidades/CitasMedicas/ICitasMedicas";
import { ICitasMedicasRepositorio } from "../../dominio/repository/ICitasMedicasRepositorio";


export class ObtenerCitasMedicasCasoUso {
    constructor(private repositorio: ICitasMedicasRepositorio) { }

    async ejecutar(): Promise<ICitasMedicas[]> {
        return await this.repositorio.obtenerCitasMedicas();
    }
}