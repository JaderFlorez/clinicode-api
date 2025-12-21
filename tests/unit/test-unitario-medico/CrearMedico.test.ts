import { CrearMedico } from "../../../src/core/aplicacion/casoUsoMedico/crearMedico";
import { IMedicosRepositorio } from "../../../src/core/dominio/repository/IMedicoRepositorio";
import { IMedico } from "../../../src/core/dominio/entidades/medicos/IMedico";
import { timeStamp } from "node:console";

describe("Pruebas unitarias CrearMedico", () => {

  let repoMock: jest.Mocked<IMedicosRepositorio>;
  let crearMedicoCasoUso: CrearMedico;

  beforeEach(() => {
    repoMock = {
      crearMedico: jest.fn(),
      listarMedicos: jest.fn(),
      obtenerMedicoPorId: jest.fn(),
      actualizarMedico: jest.fn(),
      eliminarMedico: jest.fn(),
    };

    crearMedicoCasoUso = new CrearMedico(repoMock);
  });


  test("Debe crear un médico y retornar el ID", async () => {

    const datosMedico: IMedico = {
      id_medico: "", 
      nombres: "Carlos",
      apellidos: "Romero",
      numero_licencia: `${timeStamp}`, 
      id_especialidad: "e65ddf7c-6c18-4bb7-ad3e-3a1d74e54b22",
      telefono: "3101112233",
      correo: "carlos@example.com",
    };

    const idGenerado = "";

    repoMock.crearMedico.mockResolvedValue(idGenerado);

    const resultado = await crearMedicoCasoUso.crearMedico(datosMedico);

    expect(repoMock.crearMedico).toHaveBeenCalled();
    expect(repoMock.crearMedico).toHaveBeenCalledWith(expect.any(Object)); 
    expect(resultado).toBe(idGenerado);
  });

  test("Debe lanzar un error si el repositorio falla", async () => {

    const datosMedico: IMedico = {
      id_medico: "",
      nombres: "Laura",
      apellidos: "Gómez",
      numero_licencia: "LIC-5555",
      id_especialidad: "a1bc345d-6767-48ea-bd7f-f744c92ed880",
      telefono: null,
      correo: "laura@test.com",
    };

    repoMock.crearMedico.mockRejectedValue(
      new Error("Error al crear médico")
    );

    await expect(crearMedicoCasoUso.crearMedico(datosMedico))
      .rejects
      .toThrow("Error al crear médico");

    expect(repoMock.crearMedico).toHaveBeenCalled();
  });

});
