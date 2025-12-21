export interface IMedico {
  id_medico?: string;
  nombres: string;
  apellidos: string;
  numero_licencia: string;
  id_especialidad: string;
  telefono?: string | null;
  correo?: string | null;
}
