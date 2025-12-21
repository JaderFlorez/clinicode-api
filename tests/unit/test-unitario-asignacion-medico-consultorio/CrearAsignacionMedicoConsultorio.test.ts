import { CrearAsignacionMedicoConsultorio } from "../../../src/core/aplicacion/asignacionMedicoConsultorioCasoUso/CrearAsignacionMedicoConsultorio";
import { IAsignacionMedicoConsultorioRepositorio } from "../../../src/core/dominio/repository/IAsignacionMedicoConsultorioRepositorio";
import { IMedicosRepositorio } from "../../../src/core/dominio/repository/IMedicoRepositorio";
import { IConsultorioRepositorio } from "../../../src/core/dominio/repository/IConsultorioRepositorio";
import { IAsignacionMedicoConsultorio } from "../../../src/core/dominio/entidades/asignacionMedicoConsultorio/IAsignacionMedicoConsultorio";

describe("Pruebas unitarias CrearAsignacionMedicoConsultorio", () => {

    let asignacionesRepoMock: jest.Mocked<IAsignacionMedicoConsultorioRepositorio>;
    let medicosRepoMock: jest.Mocked<IMedicosRepositorio>;
    let consultorioRepoMock: jest.Mocked<IConsultorioRepositorio>;
    let casoUso: CrearAsignacionMedicoConsultorio;

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

        medicosRepoMock = {
            crearMedico: jest.fn(),
            listarMedicos: jest.fn(),
            obtenerMedicoPorId: jest.fn(),
            actualizarMedico: jest.fn(),
            eliminarMedico: jest.fn(),
        };

        consultorioRepoMock = {
            crear: jest.fn(),
            listar: jest.fn(),
            obtenerPorId: jest.fn(),
            actualizar: jest.fn(),
            eliminar: jest.fn(),
            actualizarDisponibilidad: jest.fn(),
            obtenerConsultorioPorID: jest.fn(),
        };

        casoUso = new CrearAsignacionMedicoConsultorio(
            asignacionesRepoMock,
            medicosRepoMock,
            consultorioRepoMock
        );
    });

    const datosAsignacion: IAsignacionMedicoConsultorio = {
        idMedico: "32de3586-258c-42c2-bf23-73233a96d777",
        idConsultorio: "32de3586-258c-42c2-bf23-73233a96d888",
        diasDisponibles: ["Lunes", "Martes"],
        horaInicio: "08:00",
        horaFin: "12:00",
    };

    test("Crear la asignación cuando todo es válido", async () => {
        medicosRepoMock.obtenerMedicoPorId.mockResolvedValue({ id: "32de3586-258c-42c2-bf23-73233a96d777" } as any);
        consultorioRepoMock.obtenerPorId.mockResolvedValue({ id: "32de3586-258c-42c2-bf23-73233a96d888" } as any);

        asignacionesRepoMock.buscarAsignacionDuplicada.mockResolvedValue(null);
        asignacionesRepoMock.buscarAsignacionesPorConsultorio.mockResolvedValue([]);
        asignacionesRepoMock.buscarAsignacionesPorMedico.mockResolvedValue([]);

        const asignacionCreada = { ...datosAsignacion };
        asignacionesRepoMock.crearAsignacionMedicoConsultorio.mockResolvedValue(asignacionCreada);

        const result = await casoUso.ejecutar(datosAsignacion);

        expect(result).toEqual(asignacionCreada);
        expect(asignacionesRepoMock.crearAsignacionMedicoConsultorio).toHaveBeenCalledWith(datosAsignacion);
    });

    test("Debe lanzar error si el médico no existe", async () => {
        medicosRepoMock.obtenerMedicoPorId.mockResolvedValue(null);

        await expect(casoUso.ejecutar(datosAsignacion))
            .rejects
            .toThrow("El médico especificado no existe");
    });

    test("Debe lanzar error si el consultorio no existe", async () => {
        medicosRepoMock.obtenerMedicoPorId.mockResolvedValue({} as any);
        consultorioRepoMock.obtenerPorId.mockResolvedValue(null);

        await expect(casoUso.ejecutar(datosAsignacion))
            .rejects
            .toThrow("El consultorio especificado no existe");
    });

    test("Debe lanzar error si ya existe una asignación duplicada", async () => {
        medicosRepoMock.obtenerMedicoPorId.mockResolvedValue({} as any);
        consultorioRepoMock.obtenerPorId.mockResolvedValue({} as any);
        asignacionesRepoMock.buscarAsignacionDuplicada.mockResolvedValue({} as any);

        await expect(casoUso.ejecutar(datosAsignacion))
            .rejects
            .toThrow("Ya existe una asignación idéntica para este médico, consultorio y horario");
    });

    test("Debe lanzar error si el consultorio tiene conflicto de horario", async () => {
        medicosRepoMock.obtenerMedicoPorId.mockResolvedValue({} as any);
        consultorioRepoMock.obtenerPorId.mockResolvedValue({} as any);
        asignacionesRepoMock.buscarAsignacionDuplicada.mockResolvedValue(null);

        asignacionesRepoMock.buscarAsignacionesPorConsultorio.mockResolvedValue([
            {
                diasDisponibles: ["Lunes"],
                horaInicio: "09:00",
                horaFin: "11:00",
            } as any
        ]);

        await expect(casoUso.ejecutar(datosAsignacion))
            .rejects
            .toThrow("El consultorio ya tiene una asignación en los mismos días u horario");
    });

    test("Debe lanzar error si el médico ya tiene un conflicto de horario", async () => {
        medicosRepoMock.obtenerMedicoPorId.mockResolvedValue({} as any);
        consultorioRepoMock.obtenerPorId.mockResolvedValue({} as any);
        asignacionesRepoMock.buscarAsignacionDuplicada.mockResolvedValue(null);

        asignacionesRepoMock.buscarAsignacionesPorConsultorio.mockResolvedValue([]);
        asignacionesRepoMock.buscarAsignacionesPorMedico.mockResolvedValue([
            {
                diasDisponibles: ["Martes"],
                horaInicio: "10:00",
                horaFin: "13:00",
            } as any
        ]);

        await expect(casoUso.ejecutar(datosAsignacion))
            .rejects
            .toThrow("El médico ya tiene otra asignación en los mismos días u horario");
    });

    test("Debe lanzar error si el repositorio falla al crear la asignación", async () => {
        medicosRepoMock.obtenerMedicoPorId.mockResolvedValue({} as any);
        consultorioRepoMock.obtenerPorId.mockResolvedValue({} as any);

        asignacionesRepoMock.buscarAsignacionDuplicada.mockResolvedValue(null);
        asignacionesRepoMock.buscarAsignacionesPorConsultorio.mockResolvedValue([]);
        asignacionesRepoMock.buscarAsignacionesPorMedico.mockResolvedValue([]);

        asignacionesRepoMock.crearAsignacionMedicoConsultorio.mockRejectedValue(
            new Error("Error al crear asignación")
        );

        await expect(casoUso.ejecutar(datosAsignacion))
            .rejects
            .toThrow("Error al crear asignación");
    });
});
