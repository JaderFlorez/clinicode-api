import { EliminarCitaMedicaCasoUso } from "../../../src/core/aplicacion/CasosUsoCitasMedicas/EliminarCitaMedicaCasoUso";

const mockCitaRepo = {
    eliminarCitaMedica: jest.fn(),
};

describe("EliminarCitaMedicaCasoUso", () => {
    let casoUso: EliminarCitaMedicaCasoUso;

    beforeEach(() => {
        jest.clearAllMocks();
        casoUso = new EliminarCitaMedicaCasoUso(mockCitaRepo as any);
    });

    it("Debe retornar true cuando la cita se elimina correctamente", async () => {
        mockCitaRepo.eliminarCitaMedica.mockResolvedValue(true);

        const resultado = await casoUso.ejecutar("ABC123");

        expect(resultado).toBe(true);
        expect(mockCitaRepo.eliminarCitaMedica).toHaveBeenCalledWith("ABC123");
    });

    it("Debe retornar false cuando la cita no existe o no se elimina", async () => {
        mockCitaRepo.eliminarCitaMedica.mockResolvedValue(false);

        const resultado = await casoUso.ejecutar("NO_EXISTE");

        expect(resultado).toBe(false);
        expect(mockCitaRepo.eliminarCitaMedica).toHaveBeenCalledWith("NO_EXISTE");
    });
});
