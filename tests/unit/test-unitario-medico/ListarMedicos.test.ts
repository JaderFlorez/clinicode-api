import { ListarMedicos } from "../../../src/core/aplicacion/casoUsoMedico/listarMedico";
import { IMedicosRepositorio } from "../../../src/core/dominio/repository/IMedicoRepositorio";
import { IMedico } from "../../../src/core/dominio/entidades/medicos/IMedico";
import { timeStamp } from "node:console";

describe("Pruebas unitarias ListarMedicos", () => {

  let repoMock: jest.Mocked<IMedicosRepositorio>;
  let listarMedicosCasoUso: ListarMedicos;

  beforeEach(() => {
    repoMock = {
      crearMedico: jest.fn(),
      listarMedicos: jest.fn(),
      obtenerMedicoPorId: jest.fn(),
      actualizarMedico: jest.fn(),
      eliminarMedico: jest.fn(),
    };

    listarMedicosCasoUso = new ListarMedicos(repoMock);
  });

  test("Debe listar médicos correctamente", async () => {
    const medicosMock: IMedico[] = [
      {
        id_medico: "",
        nombres: "Juan",
        apellidos: "Perez",
        numero_licencia: `${timeStamp}`, 
        id_especialidad: "e65ddf7c-6c18-4bb7-ad3e-3a1d74e54b22",
        telefono: "3000000000",
        correo: "juan@test.com",
      },
      {
        id_medico: "",
        nombres: "Maria",
        apellidos: "Gomez",
        numero_licencia: `${timeStamp}`, 
        id_especialidad: "e65ddf7c-6c18-4bb7-ad3e-3a1d74e54b22",
        telefono: "3011111111",
        correo: "maria@test.com",
      }
    ];

    repoMock.listarMedicos.mockResolvedValue(medicosMock);

    const resultado = await listarMedicosCasoUso.obtenerMedicos();

    expect(repoMock.listarMedicos).toHaveBeenCalled();
    expect(resultado).toEqual(medicosMock);
  });

  test("Debe lanzar un error si el repositorio falla", async () => {
    repoMock.listarMedicos.mockRejectedValue(new Error("Error al listar médicos"));

    await expect(listarMedicosCasoUso.obtenerMedicos())
      .rejects
      .toThrow("Error al listar médicos");

    expect(repoMock.listarMedicos).toHaveBeenCalled();
  });

});
