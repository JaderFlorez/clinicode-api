import { IMedico } from "./IMedico";

export class Medico implements IMedico {
  id_medico: string;
  nombres: string;
  apellidos: string;
  numero_licencia: string;
  id_especialidad: string;
  telefono?: string | null;
  correo?: string | null;
  

  constructor(datosMedico: IMedico, id_medico: string) {
    this.id_medico = id_medico;
    this.nombres = datosMedico.nombres;
    this.apellidos = datosMedico.apellidos;
    this.numero_licencia = datosMedico.numero_licencia;
    this.id_especialidad = datosMedico.id_especialidad;
    this.telefono = datosMedico.telefono ?? null;
    this.correo = datosMedico.correo ?? null;
  }
}
