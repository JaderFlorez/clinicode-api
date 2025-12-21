import { IMedico } from "../../dominio/entidades/medicos/IMedico";
import { IMedicosRepositorio } from "../../dominio/repository/IMedicoRepositorio";

export class ListarMedicos {
  constructor(private medicosRepositorio: IMedicosRepositorio) {}

  async obtenerMedicos(limite?: number): Promise<IMedico[]> {
    return await this.medicosRepositorio.listarMedicos(limite);
  }
}
