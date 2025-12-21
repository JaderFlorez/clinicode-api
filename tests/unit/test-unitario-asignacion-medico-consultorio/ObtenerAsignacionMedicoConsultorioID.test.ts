import { ObtenerAsignacionMedicoConsultorioID } from "../../../src/core/aplicacion/asignacionMedicoConsultorioCasoUso/ObtenerAsignacionMedicoConsultorioID";
import { IAsignacionMedicoConsultorioRepositorio } from "../../../src/core/dominio/repository/IAsignacionMedicoConsultorioRepositorio";
import { IAsignacionMedicoConsultorio } from "../../../src/core/dominio/entidades/asignacionMedicoConsultorio/IAsignacionMedicoConsultorio";

describe("Pruebas unitarias ObtenerAsignacionMedicoConsultorioID", () => {

    let asignacionesRepoMock: jest.Mocked<IAsignacionMedicoConsultorioRepositorio>;
    let casoUso: ObtenerAsignacionMedicoConsultorioID;

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

        casoUso = new ObtenerAsignacionMedicoConsultorioID(asignacionesRepoMock);
        jest.clearAllMocks();
    });

    test("Debe obtener una asignación por ID correctamente", async () => {
        const asignacion: IAsignacionMedicoConsultorio = {
            idAsignacion: "abc-123",
            idMedico: "med-001",
            idConsultorio: "cons-555",
            diasDisponibles: ["Lunes"],
            horaInicio: "08:00",
            horaFin: "12:00"
        };

        asignacionesRepoMock.obtenerAsignacionMedicoConsultorioPorId.mockResolvedValue(asignacion);

        const result = await casoUso.ejecutar("abc-123");

        expect(result).toEqual(asignacion);
        expect(asignacionesRepoMock.obtenerAsignacionMedicoConsultorioPorId).toHaveBeenCalledWith("abc-123");
    });

    test("Debe retornar null si no existe la asignación", async () => {
        asignacionesRepoMock.obtenerAsignacionMedicoConsultorioPorId.mockResolvedValue(null);

        const result = await casoUso.ejecutar("id-no-existe");

        expect(result).toBeNull();
        expect(asignacionesRepoMock.obtenerAsignacionMedicoConsultorioPorId).toHaveBeenCalledWith("id-no-existe");
    });

    test("Debe lanzar error si el repositorio falla", async () => {
        asignacionesRepoMock.obtenerAsignacionMedicoConsultorioPorId
            .mockRejectedValue(new Error("Error al obtener asignación"));

        await expect(casoUso.ejecutar("abc-123"))
            .rejects
            .toThrow("Error al obtener asignación");

        expect(asignacionesRepoMock.obtenerAsignacionMedicoConsultorioPorId).toHaveBeenCalledTimes(1);
    });

});
