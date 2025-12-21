import { IServicioConsultarCitasPacientesRepositorio } from "../../dominio/repository/IServicioConsultarCitasPacientesRepositorio";
import { IConsultarCitasPaciente } from "../../dominio/entidades/servicioConsultarCitasPaciente/IConsultarCitasPaciente";

export class ServicioConsultarCitasPacienteCasoUso {
  constructor(
    private readonly consultarCitasRepositorio: IServicioConsultarCitasPacientesRepositorio
  ) {}

  async consultarCitasMedicas(numeroDocumento: string): Promise<IConsultarCitasPaciente[]> {
    const resultado = await this.consultarCitasRepositorio.obtenerCitasPorPaciente(numeroDocumento);
    return resultado.citas ?? [];
  }
}
