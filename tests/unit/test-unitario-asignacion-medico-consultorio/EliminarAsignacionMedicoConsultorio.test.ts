import { EliminarAsignacionMedicoConsultorio } from "../../../src/core/aplicacion/asignacionMedicoConsultorioCasoUso/EliminarAsignacionMedicoConsultorio";
import { IAsignacionMedicoConsultorioRepositorio } from "../../../src/core/dominio/repository/IAsignacionMedicoConsultorioRepositorio";

describe("Pruebas unitarias EliminarAsignacionMedicoConsultorio", () => {

    let asignacionesRepoMock: jest.Mocked<IAsignacionMedicoConsultorioRepositorio>;
    let casoUso: EliminarAsignacionMedicoConsultorio;

    beforeEach(() => {
        asignacionesRepoMock = {
            crearAsignacionMedicoConsultorio: jest.fn(),
            listarAsignacionMedicoConsultorio: jest.fn(),
            obtenerAsignacionMedicoConsultorioPorId: jest.fn(),
            actualizarAsignacionMedicoConsultorio: jest.fn(),
            eliminarAsignacionMedicoConsultorio: jest.fn(),
            buscarAsignacionesPorConsultorio: jest.fn(),
            buscarAsignacionesPorMedico: jest.fn(),
            buscarAsignacionDuplicada: jest.fn(),
        };

        casoUso = new EliminarAsignacionMedicoConsultorio(asignacionesRepoMock);
        jest.clearAllMocks();
    });

    test("Debe eliminar una asignación correctamente", async () => {
        const idAsignacion = "32de3586-258c-42c2-bf23-73233a96d999";

        asignacionesRepoMock.eliminarAsignacionMedicoConsultorio.mockResolvedValue(undefined);

        await expect(casoUso.ejecutar(idAsignacion)).resolves.toBeUndefined();

        expect(asignacionesRepoMock.eliminarAsignacionMedicoConsultorio).toHaveBeenCalledTimes(1);
        expect(asignacionesRepoMock.eliminarAsignacionMedicoConsultorio).toHaveBeenCalledWith(idAsignacion);
    });

    test("Debe propagar el error si el repositorio falla al eliminar", async () => {
        const idAsignacion = "32de3586-258c-42c2-bf23-73233a96d999";

        asignacionesRepoMock.eliminarAsignacionMedicoConsultorio.mockRejectedValue(new Error("Error al eliminar asignación"));

        await expect(casoUso.ejecutar(idAsignacion)).rejects.toThrow("Error al eliminar asignación");

        expect(asignacionesRepoMock.eliminarAsignacionMedicoConsultorio).toHaveBeenCalledTimes(1);
        expect(asignacionesRepoMock.eliminarAsignacionMedicoConsultorio).toHaveBeenCalledWith(idAsignacion);
    });

});
