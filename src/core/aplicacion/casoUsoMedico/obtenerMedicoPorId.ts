import { IMedico } from "../../dominio/entidades/medicos/IMedico";
import { IMedicosRepositorio } from "../../dominio/repository/IMedicoRepositorio";

export class ObtenerMedicoPorId {
  constructor(private medicosRepositorio: IMedicosRepositorio) {}

  async obtenerMedicoPorId(id_medico: string): Promise<IMedico | null> {
    const medico = await this.medicosRepositorio.obtenerMedicoPorId(id_medico);
    return medico;
  }
}
