import { IConsultarCitasPaciente } from "../entidades/servicioConsultarCitasPaciente/IConsultarCitasPaciente";

export interface IServicioConsultarCitasPacientesRepositorio {
  obtenerCitasPorPaciente(
    numeroDocumento: string
  ): Promise<{ mensaje: string; citas: IConsultarCitasPaciente[] }>;
}

