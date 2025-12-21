import { ActualizarMedico } from "../../../src/core/aplicacion/casoUsoMedico/actualizaMedico";
import { IMedicosRepositorio } from "../../../src/core/dominio/repository/IMedicoRepositorio";
import { IMedico } from "../../../src/core/dominio/entidades/medicos/IMedico";
import { timeStamp } from "node:console";

describe("Pruebas unitarias ActualizarMedico", () => {

  let repoMock: jest.Mocked<IMedicosRepositorio>;
  let actualizarMedicoCasoUso: ActualizarMedico;

  beforeEach(() => {
    repoMock = {
      crearMedico: jest.fn(),
      listarMedicos: jest.fn(),
      obtenerMedicoPorId: jest.fn(),
      actualizarMedico: jest.fn(),
      eliminarMedico: jest.fn(),
    };

    actualizarMedicoCasoUso = new ActualizarMedico(repoMock);
  });

  test("Debe actualizar un médico y devolver los datos actualizados", async () => {

    const id_medico = "";

    const datosMedico: IMedico = {
      id_medico: "", 
      nombres: "Carlos",
      apellidos: "Romero",
      numero_licencia: `${timeStamp}`, 
      id_especialidad: "e65ddf7c-6c18-4bb7-ad3e-3a1d74e54b22",
      telefono: "3101112233",
      correo: "carlos@example.com",
    };

    const datosActualizados: IMedico = {
      ...datosMedico,
      telefono: "3009998877", 
    };

    repoMock.actualizarMedico.mockResolvedValue(datosActualizados);

    const resultado = await actualizarMedicoCasoUso.actualizarMedico(id_medico, datosMedico);

    expect(repoMock.actualizarMedico).toHaveBeenCalledWith(
      id_medico,
      expect.objectContaining({
        nombres: "Carlos",
        apellidos: "Romero",
        numero_licencia: `${timeStamp}`, 
        id_especialidad: "e65ddf7c-6c18-4bb7-ad3e-3a1d74e54b22",
        telefono: "3101112233",
        correo: "carlos@example.com",
      })
    );

    expect(resultado).toEqual(datosActualizados);
  });

  test("Debe convertir undefined a null en teléfono y correo", async () => {

    const id_medico = "abc-123";

    const datosEntrada: IMedico = {
      id_medico,
      nombres: "Carlos",
      apellidos: "Romero",
      numero_licencia: `${timeStamp}`, 
      id_especialidad: "e65ddf7c-6c18-4bb7-ad3e-3a1d74e54b22",
      telefono: undefined as any,
      correo: undefined as any,
    };

    const datosEsperados = {
      ...datosEntrada,
      telefono: null,
      correo: null,
    };

    repoMock.actualizarMedico.mockResolvedValue(datosEsperados);

    const resultado = await actualizarMedicoCasoUso.actualizarMedico(id_medico, datosEntrada);

    expect(repoMock.actualizarMedico).toHaveBeenCalledWith(
      id_medico,
      expect.objectContaining({
        telefono: null,
        correo: null,
      })
    );

    expect(resultado).toEqual(datosEsperados);
  });

  test("Debe lanzar un error si el repositorio falla", async () => {

    const id_medico = "fail-001";

    const datosMedico: IMedico = {
      id_medico,
      nombres: "Carlos",
      apellidos: "Romero",
      numero_licencia: `${timeStamp}`, 
      id_especialidad: "e65ddf7c-6c18-4bb7-ad3e-3a1d74e54b22",
      telefono: "3101112233",
      correo: "carlos@example.com",
    };

    repoMock.actualizarMedico.mockRejectedValue(new Error("Error al actualizar médico"));

    await expect(
      actualizarMedicoCasoUso.actualizarMedico(id_medico, datosMedico)
    ).rejects.toThrow("Error al actualizar médico");

    expect(repoMock.actualizarMedico).toHaveBeenCalled();
  });

});
