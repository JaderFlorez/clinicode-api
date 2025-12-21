import { EliminarMedico } from "../../../src/core/aplicacion/casoUsoMedico/eliminarMedico";
import { IMedicosRepositorio } from "../../../src/core/dominio/repository/IMedicoRepositorio";

describe("EliminarMedico - Caso de Uso", () => {

  let repoMock: jest.Mocked<IMedicosRepositorio>;
  let eliminarMedicoCasoUso: EliminarMedico;

    beforeEach(() => {
    repoMock = {
      crearMedico: jest.fn(),
      listarMedicos: jest.fn(),
      obtenerMedicoPorId: jest.fn(),
      actualizarMedico: jest.fn(),
      eliminarMedico: jest.fn(),
    };

    eliminarMedicoCasoUso = new EliminarMedico(repoMock);
  });

  test("Eliminar un médico correctamente", async () => {
    const id_medico = "e9aa6c87-0d7c-4726-a357-f7222e4e407a";

    repoMock.eliminarMedico.mockResolvedValue(undefined);

    await eliminarMedicoCasoUso.eliminarMedico(id_medico);

    expect(repoMock.eliminarMedico).toHaveBeenCalled();
    expect(repoMock.eliminarMedico).toHaveBeenCalledWith(id_medico);
  });

  test("Lanza un error si el repositorio falla", async () => {
    const id_medico = "e9aa6c87-0d7c-4726-a357-f7222e4e407a";

    repoMock.eliminarMedico.mockRejectedValue(
      new Error("No se logro eliminar el medico")
    );

    await expect(eliminarMedicoCasoUso.eliminarMedico(id_medico))
      .rejects
      .toThrow("No se logro eliminar el medico");

      expect(repoMock.eliminarMedico).toHaveBeenCalled();
  });
});
