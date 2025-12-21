import { IConsultarCitasPaciente } from "../servicioConsultarCitasPaciente/IConsultarCitasPaciente";

export class CitaMedica implements IConsultarCitasPaciente {
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

  constructor(datos: IConsultarCitasPaciente) {
    this.id_cita = datos.id_cita;
    this.fecha_cita = datos.fecha_cita;
    this.estado = datos.estado;
    this.medico = {
      nombres: datos.medico.nombres,
      apellidos: datos.medico.apellidos,
      especialidad: datos.medico.especialidad,
    };
    this.consultorio = {
      nombre: datos.consultorio.nombre,
      ubicacion: datos.consultorio.ubicacion,
    };
  }
}
