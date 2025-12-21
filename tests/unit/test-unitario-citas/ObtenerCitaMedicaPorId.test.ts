import { ObtenerCitaMedicaPorIdCasoUso } from "../../../src/core/aplicacion/CasosUsoCitasMedicas/ObtenerCitaMedicaPorIdCasoUso";

const mockCitaRepo = {
    obtenerCitaMedicaPorID: jest.fn(),
};

describe("ObtenerCitaMedicaPorIdCasoUso", () => {
    let casoUso: ObtenerCitaMedicaPorIdCasoUso;

    beforeEach(() => {
        jest.clearAllMocks();
        casoUso = new ObtenerCitaMedicaPorIdCasoUso(mockCitaRepo as any);
    });

    it("Debe retornar la cita cuando existe", async () => {
        const citaMock = {
            id_cita: "123",
            id_paciente: "P1",
            fecha_cita: "2025-01-20",
            estado: "Programada",
        };

        mockCitaRepo.obtenerCitaMedicaPorID.mockResolvedValue(citaMock);

        const resultado = await casoUso.ejecutar("123");

        expect(resultado).toEqual(citaMock);
        expect(mockCitaRepo.obtenerCitaMedicaPorID).toHaveBeenCalledWith("123");
    });

    it("Debe retornar null si la cita no existe", async () => {
        mockCitaRepo.obtenerCitaMedicaPorID.mockResolvedValue(null);

        const resultado = await casoUso.ejecutar("NO_EXISTE");

        expect(resultado).toBeNull();
        expect(mockCitaRepo.obtenerCitaMedicaPorID).toHaveBeenCalledWith("NO_EXISTE");
    });
});
