import { IMedico } from "../../dominio/entidades/medicos/IMedico";
import { MedicoDTO } from "../../infraestructura/esquemas/MedicoEsquema";

export interface IMedicoCasosUso {
  listarMedicos(limite?: number): Promise<IMedico[]>;
  obtenerMedicoPorId(id_medico: string): Promise<IMedico | null>;
  crearMedico(medico: MedicoDTO): Promise<string>;
  actualizarMedico(id_medico: string, medico: IMedico): Promise<IMedico | null>;
  eliminarMedico(id_medico: string): Promise<void>;
}
