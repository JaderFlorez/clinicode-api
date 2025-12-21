import { CrearCitaMedicaCasoUso } from "../../../src/core/aplicacion/CasosUsoCitasMedicas/CrearCitaMedicaCasoUso";
import { EstadosCita } from "../../../src/common/estadoCita";

const mockCitaRepo = {
    validarConflictosDeAgenda: jest.fn(),
    crearCitaMedica: jest.fn(),
};

const mockPacienteRepo = {
    obtenerPacientePorId: jest.fn(),
};

const mockMedicoRepo = {
    obtenerMedicoPorId: jest.fn(),
};

const mockConsultorioRepo = {
    obtenerConsultorioPorID: jest.fn(),
};

describe("CrearCitaMedicaCasoUso", () => {

    let casoUso: CrearCitaMedicaCasoUso;

    beforeEach(() => {
        jest.clearAllMocks();
        casoUso = new CrearCitaMedicaCasoUso(
            mockCitaRepo as any,
            mockPacienteRepo as any,
            mockMedicoRepo as any,
            mockConsultorioRepo as any
        );
    });

    it("Debe lanzar error si el paciente no existe", async () => {
        mockPacienteRepo.obtenerPacientePorId.mockResolvedValue(null);

        await expect(
            casoUso.ejecutar({
                id_paciente: "1",
                id_medico: "2",
                fecha: "2025-02-01",
                hora: "10:00",
            } as any)
        ).rejects.toThrow("El paciente no existe.");
    });

    it("Debe lanzar error si el médico no existe", async () => {
        mockPacienteRepo.obtenerPacientePorId.mockResolvedValue({ id_paciente: "1" });
        mockMedicoRepo.obtenerMedicoPorId.mockResolvedValue(null);

        await expect(
            casoUso.ejecutar({
                id_paciente: "1",
                id_medico: "2",
                fecha: "2025-02-01",
                hora: "10:00",
            } as any)
        ).rejects.toThrow("El médico no existe.");
    });

    it("Debe lanzar error si el consultorio no existe", async () => {
        mockPacienteRepo.obtenerPacientePorId.mockResolvedValue({ id_paciente: "1" });
        mockMedicoRepo.obtenerMedicoPorId.mockResolvedValue({ id_medico: "2" });
        mockConsultorioRepo.obtenerConsultorioPorID.mockResolvedValue(null);

        await expect(
            casoUso.ejecutar({
                id_paciente: "1",
                id_medico: "2",
                id_consultorio: "ABC",
                fecha: "2025-02-01",
                hora: "10:00",
            } as any)
        ).rejects.toThrow("El consultorio no existe.");
    });


    it("Debe lanzar error si existe un conflicto de agenda", async () => {
        mockPacienteRepo.obtenerPacientePorId.mockResolvedValue({ id_paciente: "1" });
        mockMedicoRepo.obtenerMedicoPorId.mockResolvedValue({ id_medico: "2" });
        mockConsultorioRepo.obtenerConsultorioPorID.mockResolvedValue({ id_consultorio: "XYZ" });
        mockCitaRepo.validarConflictosDeAgenda.mockResolvedValue("Conflicto de cita");

        await expect(
            casoUso.ejecutar({
                id_paciente: "1",
                id_medico: "2",
                id_consultorio: "XYZ",
                fecha: "2025-02-01",
                hora: "10:00",
            } as any)
        ).rejects.toThrow("Conflicto de cita");
    });

    it("Debe crear una cita correctamente si todo es válido", async () => {
        mockPacienteRepo.obtenerPacientePorId.mockResolvedValue({ id_paciente: "1" });
        mockMedicoRepo.obtenerMedicoPorId.mockResolvedValue({ id_medico: "2" });
        mockConsultorioRepo.obtenerConsultorioPorID.mockResolvedValue({ id_consultorio: "XYZ" });
        mockCitaRepo.validarConflictosDeAgenda.mockResolvedValue(null);

        const citaMock = {
            id_cita: "UUID",
            id_paciente: "1",
            id_medico: "2",
            id_consultorio: "XYZ",
            fecha: "2025-02-01",
            hora: "10:00",
            estado: EstadosCita.PROGRAMADA,
        };

        mockCitaRepo.crearCitaMedica.mockResolvedValue(citaMock);

        const resultado = await casoUso.ejecutar({
            id_paciente: "1",
            id_medico: "2",
            id_consultorio: "XYZ",
            fecha: "2025-02-01",
            hora: "10:00",
        } as any);

        expect(resultado).toEqual(citaMock);
        expect(mockCitaRepo.crearCitaMedica).toHaveBeenCalled();
    });

});
