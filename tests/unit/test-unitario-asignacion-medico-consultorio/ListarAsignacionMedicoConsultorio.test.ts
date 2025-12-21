import { ListarAsignacionMedicoConsultorio } from "../../../src/core/aplicacion/asignacionMedicoConsultorioCasoUso/ListarAsignacionMedicoConsultorio";
import { IAsignacionMedicoConsultorioRepositorio } from "../../../src/core/dominio/repository/IAsignacionMedicoConsultorioRepositorio";
import { IAsignacionMedicoConsultorio } from "../../../src/core/dominio/entidades/asignacionMedicoConsultorio/IAsignacionMedicoConsultorio";

describe("Pruebas unitarias ListarAsignacionMedicoConsultorio", () => {

    let asignacionesRepoMock: jest.Mocked<IAsignacionMedicoConsultorioRepositorio>;
    let casoUso: ListarAsignacionMedicoConsultorio;

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

        casoUso = new ListarAsignacionMedicoConsultorio(asignacionesRepoMock);
        jest.clearAllMocks();
    });

    test("Debe listar todas las asignaciones sin límite", async () => {
        const asignaciones: IAsignacionMedicoConsultorio[] = [
            {
                idMedico: "1",
                idConsultorio: "100",
                diasDisponibles: ["Lunes"],
                horaInicio: "08:00",
                horaFin: "10:00"
            },
            {
                idMedico: "2",
                idConsultorio: "101",
                diasDisponibles: ["Martes"],
                horaInicio: "10:00",
                horaFin: "12:00"
            }
        ];

        asignacionesRepoMock.listarAsignacionMedicoConsultorio.mockResolvedValue(asignaciones);

        const result = await casoUso.ejecutar();

        expect(result).toEqual(asignaciones);
        expect(asignacionesRepoMock.listarAsignacionMedicoConsultorio).toHaveBeenCalledWith(undefined);
    });

    test("Debe listar asignaciones con un límite especificado", async () => {
        const asignacionesLimitadas: IAsignacionMedicoConsultorio[] = [
            {
                idMedico: "1",
                idConsultorio: "100",
                diasDisponibles: ["Lunes"],
                horaInicio: "08:00",
                horaFin: "10:00"
            }
        ];

        asignacionesRepoMock.listarAsignacionMedicoConsultorio.mockResolvedValue(asignacionesLimitadas);

        const result = await casoUso.ejecutar(1);

        expect(result).toEqual(asignacionesLimitadas);
        expect(asignacionesRepoMock.listarAsignacionMedicoConsultorio).toHaveBeenCalledWith(1);
    });

    test("Debe lanzar un error cuando el repositorio falle", async () => {
        asignacionesRepoMock.listarAsignacionMedicoConsultorio
            .mockRejectedValue(new Error("Error al obtener asignaciones"));

        await expect(casoUso.ejecutar())
            .rejects
            .toThrow("Error al obtener asignaciones");

        expect(asignacionesRepoMock.listarAsignacionMedicoConsultorio).toHaveBeenCalledTimes(1);
    });

});
