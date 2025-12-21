import { ConsultorioRepositorioSupabase } from "../../infraestructura/repositorios/consultorioRepositorioSupabase";


export class EliminarConsultorio {
    constructor(private readonly consultorioRepositorio: ConsultorioRepositorioSupabase) { }

    async ejecutar(id: string) {
        if (!id) {
            throw new Error("El ID del consultorio es obligatorio.");
        }

        const eliminado = await this.consultorioRepositorio.eliminar(id);
        if (!eliminado) {
            throw new Error("No se pudo eliminar el consultorio o no existe.");
        }

        return eliminado;
    }
}
