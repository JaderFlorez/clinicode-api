import { IMedicosRepositorio } from "../../dominio/repository/IMedicoRepositorio";

export class EliminarMedico {
  constructor(private medicosRepositorio: IMedicosRepositorio) {}

  async eliminarMedico(id_medico: string): Promise<void> {
    await this.medicosRepositorio.eliminarMedico(id_medico);
  }
}
