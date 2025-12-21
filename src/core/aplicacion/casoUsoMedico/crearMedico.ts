import { IMedico } from "../../dominio/entidades/medicos/IMedico";
import { IMedicosRepositorio } from "../../dominio/repository/IMedicoRepositorio";
import { Medico } from "../../dominio/entidades/medicos/Medico";

export class CrearMedico {
  constructor(private medicosRepositorio: IMedicosRepositorio) { }

  async crearMedico(datosMedico: IMedico): Promise<string> {
    const id_medico = crypto.randomUUID();
    const nuevoMedico = new Medico(datosMedico, id_medico);
    const idInsertado = await this.medicosRepositorio.crearMedico(nuevoMedico);

    return idInsertado;
  }
}
