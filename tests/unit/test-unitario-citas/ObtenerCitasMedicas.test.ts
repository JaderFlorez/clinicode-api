import { ObtenerCitasMedicasCasoUso } from "../../../src/core/aplicacion/CasosUsoCitasMedicas/ObtenerCitasMedicasCasoUso";

const mockCitaRepo = {
    obtenerCitasMedicas: jest.fn(),
};

describe("ObtenerCitasMedicasCasoUso", () => {
    let casoUso: ObtenerCitasMedicasCasoUso;

    beforeEach(() => {
        jest.clearAllMocks();
        casoUso = new ObtenerCitasMedicasCasoUso(mockCitaRepo as any);
    });

    it("Debe retornar todas las citas médicas", async () => {
        const citasMock = [
            {
                id_cita: "1",
                id_paciente: "P1",
                fecha_cita: "2025-01-20",
            },
            {
                id_cita: "2",
                id_paciente: "P2",
                fecha_cita: "2025-01-21",
            },
        ];

        mockCitaRepo.obtenerCitasMedicas.mockResolvedValue(citasMock);

        const resultado = await casoUso.ejecutar();

        expect(resultado).toEqual(citasMock);
        expect(mockCitaRepo.obtenerCitasMedicas).toHaveBeenCalled();
    });

    it("Debe retornar lista vacía si no existen citas", async () => {
        mockCitaRepo.obtenerCitasMedicas.mockResolvedValue([]);

        const resultado = await casoUso.ejecutar();

        expect(resultado).toEqual([]);
        expect(mockCitaRepo.obtenerCitasMedicas).toHaveBeenCalled();
    });
});
