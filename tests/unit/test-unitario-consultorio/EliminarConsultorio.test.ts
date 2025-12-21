import { EliminarConsultorio } from "../../../src/core/aplicacion/casoUsoConsultorio/eliminarConsultorio";
import { IConsultorioRepositorio } from "../../../src/core/dominio/repository/IConsultorioRepositorio";

describe("Pruebas unitarias - EliminarConsultorio", () => {
    let repoMock: jest.Mocked<IConsultorioRepositorio>;
    let eliminarConsultorioCasoUso: EliminarConsultorio;

    beforeEach(() => {
        // Mock del repositorio
        repoMock = {
            crear: jest.fn(),
            listar: jest.fn(),
            obtenerPorId: jest.fn(),
            actualizar: jest.fn(),
            eliminar: jest.fn(),
            actualizarDisponibilidad: jest.fn(),
            obtenerConsultorioPorID: jest.fn(),
        };

        eliminarConsultorioCasoUso = new EliminarConsultorio(repoMock);
    });

    test("Debe eliminar un consultorio correctamente", async () => {
        
        const idConsultorio = "c1234567-89ab-cdef-0123-456789abcdef";
        repoMock.eliminar.mockResolvedValue(true);

        
        const resultado = await eliminarConsultorioCasoUso.ejecutar(idConsultorio);

        
        expect(repoMock.eliminar).toHaveBeenCalledTimes(1);
        expect(repoMock.eliminar).toHaveBeenCalledWith(idConsultorio);
        expect(resultado).toBe(true);
    });

    test("Debe lanzar error cuando el consultorio no existe", async () => {
        
        const idConsultorio = "id-inexistente";
        repoMock.eliminar.mockResolvedValue(false);

        
        await expect(eliminarConsultorioCasoUso.ejecutar(idConsultorio))
            .rejects
            .toThrow("No se pudo eliminar el consultorio o no existe.");

        expect(repoMock.eliminar).toHaveBeenCalledWith(idConsultorio);
    });

    test("Debe propagar el error cuando el repositorio falla", async () => {
        
        const idConsultorio = "c1234567-89ab-cdef-0123-456789abcdef";
        const errorMessage = "Error al eliminar el consultorio";
        repoMock.eliminar.mockRejectedValue(new Error(errorMessage));

        
        await expect(eliminarConsultorioCasoUso.ejecutar(idConsultorio))
            .rejects
            .toThrow(errorMessage);

        expect(repoMock.eliminar).toHaveBeenCalledTimes(1);
    });

    test("Debe manejar IDs con diferentes formatos", async () => {
        
        const idsValidos = [
            "c1234567-89ab-cdef-0123-456789abcdef",
            "12345",
            "consultorio-abc-123",
        ];

        repoMock.eliminar.mockResolvedValue(true);

        
        for (const id of idsValidos) {
            await eliminarConsultorioCasoUso.ejecutar(id);
            expect(repoMock.eliminar).toHaveBeenCalledWith(id);
        }
    });

    test("Debe manejar error de restricción de clave foránea", async () => {
        
        const idConsultorio = "c1234567-89ab-cdef-0123-456789abcdef";
        const errorMessage = "No se puede eliminar: el consultorio tiene citas asociadas";
        repoMock.eliminar.mockRejectedValue(new Error(errorMessage));

        
        await expect(eliminarConsultorioCasoUso.ejecutar(idConsultorio))
            .rejects
            .toThrow(errorMessage);
    });
});
