import { ServicioConsultarCitasPacienteCasoUso} from "../../../src/core/aplicacion/casoUsoServicioConsultarCitasPaciente/servicioConsultarCitasPaciente";
import { IServicioConsultarCitasPacientesRepositorio } from "../../../src/core/dominio/repository/IServicioConsultarCitasPacientesRepositorio";
import { IConsultarCitasPaciente } from "../../../src/core/dominio/entidades/servicioConsultarCitasPaciente/IConsultarCitasPaciente";

describe("TEST UNITARIO - Consultar Citas Paciente", () => {

  const mockRepositorio: jest.Mocked<IServicioConsultarCitasPacientesRepositorio> = {
    obtenerCitasPorPaciente: jest.fn()
  };

  const casoUso = new ServicioConsultarCitasPacienteCasoUso(mockRepositorio);

  const numeroDocumento = "1234561029384756"

  test("Debe devolver las citas correctamente", async () => {

    const citasMock: IConsultarCitasPaciente[] = [
      {
        id_cita: "",
        fecha_cita: "2025-10-10",
        estado: "Programada",
        medico: {
          nombres: "Juan",
          apellidos: "Pérez",
          especialidad: "Cardiología"
        },
        consultorio: {
          nombre: "Consultorio A",
          ubicacion: "Piso 2"
        }
      }
    ];

    mockRepositorio.obtenerCitasPorPaciente.mockResolvedValue({
      mensaje: "Citas obtenidas correctamente",
      citas: citasMock
    });

    const resultado = await casoUso.consultarCitasMedicas(numeroDocumento);

    expect(resultado).toEqual(citasMock);
    expect(mockRepositorio.obtenerCitasPorPaciente).toHaveBeenCalledWith(numeroDocumento);
  });

  test("Debe devolver lista vacía si el paciente no tiene citas", async () => {

    mockRepositorio.obtenerCitasPorPaciente.mockResolvedValue({
      mensaje: "El paciente no tiene citas registradas",
      citas: []
    });

    const resultado = await casoUso.consultarCitasMedicas(numeroDocumento);

    expect(resultado).toEqual([]);
  });
});
