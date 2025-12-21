export interface IConsultarCitasPaciente {
  id_cita: string;
  fecha_cita: string;
  estado: string;
  medico: {
    nombres: string;
    apellidos: string;
    especialidad: string;
  };
  consultorio: {
    nombre: string;
    ubicacion: string;
  };
}
