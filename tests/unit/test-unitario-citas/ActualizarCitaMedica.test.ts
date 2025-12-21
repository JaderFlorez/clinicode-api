import { ActualizarCitaMedicaCasoUso } from "../../../src/core/aplicacion/CasosUsoCitasMedicas/ActualizarCitaMedicaCasoUso";

const mockCitaRepo = {
    obtenerCitaMedicaPorID: jest.fn(),
    actualizarCitaMedica: jest.fn(),
};

describe("ActualizarCitaMedicaCasoUso", () => {
    let casoUso: ActualizarCitaMedicaCasoUso;

    beforeEach(() => {
        jest.clearAllMocks();
        casoUso = new ActualizarCitaMedicaCasoUso(mockCitaRepo as any);
    });

    it("Debe lanzar error si la cita no existe", async () => {
        mockCitaRepo.obtenerCitaMedicaPorID.mockResolvedValue(null);

        await expect(
            casoUso.ejecutar("ID123", {})
        ).rejects.toThrow("La cita médica no existe.");
    });

    it("Debe aplicar los cambios enviados y actualizar la cita", async () => {
        const citaExistente = {
            id_cita: "ID123",
            id_paciente: "P1",
            id_medico: "M1",
            id_consultorio: "C1",
            fecha_cita: "2025-01-20",
            estado: "PROGRAMADA",
            motivoCita: "Dolor",
            creadaEn: "2025-01-01",
            actualizadaEn: null,
        };

        const cambios = {
            id_medico: "M2",
            motivoCita: "Revisión general",
        };

        mockCitaRepo.obtenerCitaMedicaPorID.mockResolvedValue(citaExistente);

        const citaEsperada = {
            ...citaExistente,
            ...cambios,
            actualizadaEn: expect.any(String),
        };

        mockCitaRepo.actualizarCitaMedica.mockResolvedValue(citaEsperada);

        const resultado = await casoUso.ejecutar("ID123", cambios);

        expect(resultado).toEqual(citaEsperada);
        expect(mockCitaRepo.obtenerCitaMedicaPorID).toHaveBeenCalledWith("ID123");
        expect(mockCitaRepo.actualizarCitaMedica).toHaveBeenCalledWith(
            "ID123",
            expect.objectContaining(cambios)
        );
    });


    it("Debe actualizar solo la fecha de actualización si no se envían campos nuevos", async () => {
        const citaExistente = {
            id_cita: "ID123",
            id_paciente: "P1",
            id_medico: "M1",
            id_consultorio: "C1",
            fecha_cita: "2025-01-20",
            estado: "PROGRAMADA",
            motivoCita: "Dolor",
            creadaEn: "2025-01-01",
            actualizadaEn: null,
        };

        mockCitaRepo.obtenerCitaMedicaPorID.mockResolvedValue(citaExistente);

        const citaActualizada = {
            ...citaExistente,
            actualizadaEn: "2025-02-10"
        };

        mockCitaRepo.actualizarCitaMedica.mockResolvedValue(citaActualizada);

        const resultado = await casoUso.ejecutar("ID123", {});

        expect(resultado).toEqual(citaActualizada);
        expect(mockCitaRepo.actualizarCitaMedica).toHaveBeenCalled();
    });
});
