import { CancelarOReprogramarCitaCasoUso } from "../../../src/core/aplicacion/CasosUsoCitasMedicas/CancelarOReprogramarCitaCasoUso";

const mockCitasRepo = {
    obtenerCitaMedicaPorID: jest.fn(),
    obtenerCitasMedicas: jest.fn(),
    actualizarCitaMedica: jest.fn(),
};

const mockConsultorioRepo = {
    actualizar: jest.fn(),
    obtenerConsultorioPorID: jest.fn(),
};

describe("CancelarOReprogramarCitaCasoUso", () => {
    let casoUso: CancelarOReprogramarCitaCasoUso;

    beforeEach(() => {
        jest.clearAllMocks();
        casoUso = new CancelarOReprogramarCitaCasoUso(
            mockCitasRepo as any,
            mockConsultorioRepo as any
        );

        jest.useFakeTimers().setSystemTime(new Date("2025-01-01T10:00:00Z"));
    });

    it("Debe lanzar error si la cita no existe", async () => {
        mockCitasRepo.obtenerCitaMedicaPorID.mockResolvedValue(null);

        await expect(
            casoUso.ejecutar("ID_NO_EXISTE", "cancelar")
        ).rejects.toThrow("La cita indicada no existe.");
    });

    it("Debe cancelar una cita correctamente", async () => {
        const citaExistente = {
            id_cita: "C1",
            id_consultorio: "CONS1",
            fecha_cita: "2025-02-10T12:00:00Z",
            estado: "Programada",
        };

        mockCitasRepo.obtenerCitaMedicaPorID.mockResolvedValue(citaExistente);
        mockCitasRepo.actualizarCitaMedica.mockResolvedValue(citaExistente);
        mockConsultorioRepo.actualizar.mockResolvedValue(true);

        const resultado = await casoUso.ejecutar("C1", "cancelar");

        expect(resultado.mensaje).toBe("Cita cancelada exitosamente.");
        expect(mockConsultorioRepo.actualizar).toHaveBeenCalledWith("CONS1", {
            disponible: true,
        });
        expect(mockCitasRepo.actualizarCitaMedica).toHaveBeenCalled();
    });


    it("Debe lanzar error si no se envía nueva fecha en reprogramación", async () => {
        mockCitasRepo.obtenerCitaMedicaPorID.mockResolvedValue({ id_cita: "C1" });

        await expect(
            casoUso.ejecutar("C1", "reprogramar", {})
        ).rejects.toThrow("Debes indicar la nueva fecha y hora para reprogramar.");
    });


    it("Debe lanzar error si la nueva fecha es inválida", async () => {
        mockCitasRepo.obtenerCitaMedicaPorID.mockResolvedValue({ id_cita: "C1" });

        await expect(
            casoUso.ejecutar("C1", "reprogramar", {
                fecha_cita: "FECHA_MALA",
            })
        ).rejects.toThrow("Fecha inválida.");
    });


    it("Debe lanzar error si la nueva fecha es pasada o actual", async () => {
        mockCitasRepo.obtenerCitaMedicaPorID.mockResolvedValue({ id_cita: "C1" });

        await expect(
            casoUso.ejecutar("C1", "reprogramar", {
                fecha_cita: "2025-01-01T10:00:00Z",
            })
        ).rejects.toThrow("No se puede reprogramar a una fecha pasada o actual.");
    });


    it("Debe lanzar error si el nuevo consultorio no existe", async () => {
        const citaExistente = {
            id_cita: "C1",
            id_consultorio: "C_OLD",
            estado: "Programada",
        };

        mockCitasRepo.obtenerCitaMedicaPorID.mockResolvedValue(citaExistente);
        mockConsultorioRepo.obtenerConsultorioPorID.mockResolvedValue(null);

        await expect(
            casoUso.ejecutar("C1", "reprogramar", {
                fecha_cita: "2025-02-10T12:00:00Z",
                id_consultorio: "C_NEW",
            })
        ).rejects.toThrow("El consultorio con ID C_NEW no existe.");
    });

    it("Debe lanzar error si hay conflicto con otra cita", async () => {
        const citaExistente = {
            id_cita: "C1",
            id_consultorio: "CONS1",
            estado: "Programada",
        };

        mockCitasRepo.obtenerCitaMedicaPorID.mockResolvedValue(citaExistente);
        mockConsultorioRepo.obtenerConsultorioPorID.mockResolvedValue({ id: "CONS1" });

        mockCitasRepo.obtenerCitasMedicas.mockResolvedValue([
            {
                id_cita: "C2",
                id_consultorio: "CONS1",
                fecha_cita: "2025-02-10T12:00:00Z",
                estado: "Programada",
            },
        ]);

        await expect(
            casoUso.ejecutar("C1", "reprogramar", {
                fecha_cita: "2025-02-10T12:00:00Z",
            })
        ).rejects.toThrow("Conflicto detectado: el horario ya está ocupado por otra cita (C2).");
    });

    it("Debe reprogramar la cita exitosamente", async () => {
        const citaExistente = {
            id_cita: "C1",
            id_consultorio: "CONS1",
            estado: "Programada",
            fecha_cita: "2025-02-15T12:00:00Z",
        };

        mockCitasRepo.obtenerCitaMedicaPorID.mockResolvedValue(citaExistente);
        mockConsultorioRepo.obtenerConsultorioPorID.mockResolvedValue({ id: "CONS1" });

        mockCitasRepo.obtenerCitasMedicas.mockResolvedValue([]);

        mockConsultorioRepo.actualizar.mockResolvedValue(true);

        const citaActualizada = {
            ...citaExistente,
            id_consultorio: "CONS1",
            fecha_cita: "2025-02-20T12:00:00Z",
            estado: "Programada",
        };

        mockCitasRepo.actualizarCitaMedica.mockResolvedValue(citaActualizada);

        const resultado = await casoUso.ejecutar("C1", "reprogramar", {
            fecha_cita: "2025-02-20T12:00:00Z",
        });

        expect(resultado.mensaje).toBe("Cita reprogramada exitosamente.");
        expect(mockConsultorioRepo.actualizar).toHaveBeenCalledTimes(2);
        expect(mockCitasRepo.actualizarCitaMedica).toHaveBeenCalled();
    });
});
