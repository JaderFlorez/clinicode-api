import { ActualizarAsignacionMedicoConsultorio } from "../../../src/core/aplicacion/asignacionMedicoConsultorioCasoUso/ActualizarAsignacionMedicoConsultorio";
import { IAsignacionMedicoConsultorioRepositorio } from "../../../src/core/dominio/repository/IAsignacionMedicoConsultorioRepositorio";
import { IMedicosRepositorio } from "../../../src/core/dominio/repository/IMedicoRepositorio";
import { IConsultorioRepositorio } from "../../../src/core/dominio/repository/IConsultorioRepositorio";
import { IAsignacionMedicoConsultorio } from "../../../src/core/dominio/entidades/asignacionMedicoConsultorio/IAsignacionMedicoConsultorio";

describe("Pruebas unitarias ActualizarAsignacionMedicoConsultorio", () => {

    let asignacionesRepoMock: jest.Mocked<IAsignacionMedicoConsultorioRepositorio>;
    let medicosRepoMock: jest.Mocked<IMedicosRepositorio>;
    let consultorioRepoMock: jest.Mocked<IConsultorioRepositorio>;
    let casoUso: ActualizarAsignacionMedicoConsultorio;

    beforeEach(() => {
        asignacionesRepoMock = {
            crearAsignacionMedicoConsultorio: jest.fn(),
            listarAsignacionMedicoConsultorio: jest.fn(),
            obtenerAsignacionMedicoConsultorioPorId: jest.fn(),
            actualizarAsignacionMedicoConsultorio: jest.fn(),
            eliminarAsignacionMedicoConsultorio: jest.fn(),
            buscarAsignacionesPorConsultorio: jest.fn(),
            buscarAsignacionesPorMedico: jest.fn(),
            buscarAsignacionDuplicada: jest.fn()
        };

        medicosRepoMock = {
            crearMedico: jest.fn(),
            listarMedicos: jest.fn(),
            obtenerMedicoPorId: jest.fn(),
            actualizarMedico: jest.fn(),
            eliminarMedico: jest.fn()
        };

        consultorioRepoMock = {
            crear: jest.fn(),
            listar: jest.fn(),
            obtenerPorId: jest.fn(),
            actualizar: jest.fn(),
            eliminar: jest.fn(),
            actualizarDisponibilidad: jest.fn(),
            obtenerConsultorioPorID: jest.fn()
        };

        casoUso = new ActualizarAsignacionMedicoConsultorio(
            asignacionesRepoMock,
            medicosRepoMock,
            consultorioRepoMock
        );
    });

    test("Debe actualizar una asignación correctamente", async () => {
        const idAsignacion = "4240c8ff-d998-48c0-8868-f1a5a4dccfa3";

        const datosActualizados: IAsignacionMedicoConsultorio = {
            idMedico: "4240c8ff-d998-48c0-8868-f1a5a4dccfa1",
            idConsultorio: "4240c8ff-d998-48c0-8868-f1a5a4dccfa4",
            diasDisponibles: ["Lunes", "Miércoles"],
            horaInicio: "08:00",
            horaFin: "12:00"
        };

        asignacionesRepoMock.obtenerAsignacionMedicoConsultorioPorId.mockResolvedValue({
            idAsignacion,
            idMedico: "OLD-MED",
            idConsultorio: "OLD-CONS",
            diasDisponibles: ["Martes"],
            horaInicio: "10:00",
            horaFin: "12:00"
        });

        medicosRepoMock.obtenerMedicoPorId.mockResolvedValue({
            idMedico: datosActualizados.idMedico,
            nombres: "Juan",
            apellidos: "Lopez"
        } as any);

        consultorioRepoMock.obtenerPorId.mockResolvedValue({
            idConsultorio: datosActualizados.idConsultorio,
            nombre: "Consultorio 7"
        } as any);

        const asignacionActualizadaEsperada = {
            ...datosActualizados,
            idAsignacion
        };

        asignacionesRepoMock.actualizarAsignacionMedicoConsultorio
            .mockResolvedValue(asignacionActualizadaEsperada);

        const resultado = await casoUso.ejecutar(idAsignacion, datosActualizados);

        expect(resultado).toEqual(asignacionActualizadaEsperada);
        expect(asignacionesRepoMock.obtenerAsignacionMedicoConsultorioPorId)
            .toHaveBeenCalledWith(idAsignacion);
        expect(medicosRepoMock.obtenerMedicoPorId)
            .toHaveBeenCalledWith(datosActualizados.idMedico);
        expect(consultorioRepoMock.obtenerPorId)
            .toHaveBeenCalledWith(datosActualizados.idConsultorio);
        expect(asignacionesRepoMock.actualizarAsignacionMedicoConsultorio)
            .toHaveBeenCalledWith(idAsignacion, datosActualizados);
    });

    test("Debe lanzar error si la asignación no existe", async () => {
        asignacionesRepoMock.obtenerAsignacionMedicoConsultorioPorId
            .mockResolvedValue(null);

        const datos: IAsignacionMedicoConsultorio = {
            idMedico: "ID-MED",
            idConsultorio: "ID-CONS",
            diasDisponibles: ["Lunes"],
            horaInicio: "09:00",
            horaFin: "10:00"
        };

        await expect(
            casoUso.ejecutar("NO-EXISTE", datos)
        ).rejects.toThrow("La asignación especificada no existe");
    });

    test("Debe lanzar error si el médico no existe", async () => {
        asignacionesRepoMock.obtenerAsignacionMedicoConsultorioPorId
            .mockResolvedValue({} as any);

        medicosRepoMock.obtenerMedicoPorId
            .mockResolvedValue(null);

        const datos: IAsignacionMedicoConsultorio = {
            idMedico: "ID-MED-NO-EXISTE",
            idConsultorio: "ID-CONS",
            diasDisponibles: ["Martes"],
            horaInicio: "09:00",
            horaFin: "11:00"
        };

        await expect(
            casoUso.ejecutar("ID-ASIGNACION", datos)
        ).rejects.toThrow("El médico especificado no existe");
    });

    test("Debe lanzar error si el consultorio no existe", async () => {
        asignacionesRepoMock.obtenerAsignacionMedicoConsultorioPorId.mockResolvedValue({
            idAsignacion: "4240c8ff-d998-48c0-8868-f1a5a4dccfa3",
            idMedico: "4240c8ff-d998-48c0-8868-f1a5a4dccfa7",
            idConsultorio: "4240c8ff-d998-48c0-8868-f1a5a4dccfb1",
            diasDisponibles: ["Lunes"],
            horaInicio: "08:00",
            horaFin: "10:00"
        } as any);

        medicosRepoMock.obtenerMedicoPorId.mockResolvedValue({
            idMedico: "4240c8ff-d998-48c0-8868-f1a5a4dccfa7",
            nombres: "Carlos",
            apellidos: "López"
        } as any);

        consultorioRepoMock.obtenerPorId.mockResolvedValue(null);

        const datos: IAsignacionMedicoConsultorio = {
            idMedico: "4240c8ff-d998-48c0-8868-f1a5a4dccfa7",
            idConsultorio: "4240c8ff-d998-48c0-8868-f1a5a4dccfb1",
            diasDisponibles: ["Viernes"],
            horaInicio: "07:00",
            horaFin: "09:00"
        };

        await expect(
            casoUso.ejecutar("4240c8ff-d998-48c0-8868-f1a5a4dccfa3", datos)
        ).rejects.toThrow("El consultorio especificado no existe");
    });

});