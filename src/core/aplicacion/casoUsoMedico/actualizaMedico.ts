import { IMedico } from "../../dominio/entidades/medicos/IMedico";
import { IMedicosRepositorio } from "../../dominio/repository/IMedicoRepositorio";

export class ActualizarMedico {
  constructor(private medicosRepositorio: IMedicosRepositorio) {}

  async actualizarMedico(id_medico: string, datos: IMedico): Promise<IMedico | null> {
    const datosActualizados = {
      nombres: datos.nombres,
      apellidos: datos.apellidos,
      numero_licencia: datos.numero_licencia,
      id_especialidad: datos.id_especialidad,
      telefono: datos.telefono ?? null,
      correo: datos.correo ?? null,
    };

    const medicoActualizado = await this.medicosRepositorio.actualizarMedico(
      id_medico,
      datosActualizados
    );

    return medicoActualizado || null;
  }
}
