import { ObtenerMedicoPorId } from "../../../src/core/aplicacion/casoUsoMedico/obtenerMedicoPorId";
import { IMedicosRepositorio } from "../../../src/core/dominio/repository/IMedicoRepositorio";
import { IMedico } from "../../../src/core/dominio/entidades/medicos/IMedico";
import { timeStamp } from "node:console";

describe("Pruebas unitarias ObtenerMedicoPorId", () => {

  let repoMock: jest.Mocked<IMedicosRepositorio>;
  let obtenerMedicoCasoUso: ObtenerMedicoPorId;

  beforeEach(() => {
    repoMock = {
      crearMedico: jest.fn(),
      listarMedicos: jest.fn(),
      obtenerMedicoPorId: jest.fn(),
      actualizarMedico: jest.fn(),
      eliminarMedico: jest.fn(),
    };

    obtenerMedicoCasoUso = new ObtenerMedicoPorId(repoMock);
  });

  test("Debe retornar un médico si existe", async () => {
    const medicoMock: IMedico = {
      id_medico: "",
      nombres: "Carlos",
      apellidos: "Lopez",
      numero_licencia: `${timeStamp}`, 
      id_especialidad: "e65ddf7c-6c18-4bb7-ad3e-3a1d74e54b22",
      telefono: "3001234567",
      correo: "carlos@test.com",
    };

    repoMock.obtenerMedicoPorId.mockResolvedValue(medicoMock);

    const resultado = await obtenerMedicoCasoUso.obtenerMedicoPorId("");

    expect(repoMock.obtenerMedicoPorId).toHaveBeenCalledWith("");
    expect(resultado).toEqual(medicoMock);
  });

  test("Debe retornar null si el médico no existe", async () => {
    repoMock.obtenerMedicoPorId.mockResolvedValue(null);

    const resultado = await obtenerMedicoCasoUso.obtenerMedicoPorId("");

    expect(repoMock.obtenerMedicoPorId).toHaveBeenCalledWith("");
    expect(resultado).toBeNull();
  });

  test("Debe lanzar error si el repositorio falla", async () => {
    repoMock.obtenerMedicoPorId.mockRejectedValue(
      new Error("Error al obtener médico")
    );

    await expect(obtenerMedicoCasoUso.obtenerMedicoPorId(""))
      .rejects
      .toThrow("Error al obtener médico");

    expect(repoMock.obtenerMedicoPorId).toHaveBeenCalled();
  });

});
