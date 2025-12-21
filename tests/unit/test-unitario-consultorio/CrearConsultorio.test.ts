import { CrearConsultorio } from "../../../src/core/aplicacion/casoUsoConsultorio/crearConsultorio";
import { IConsultorioRepositorio } from "../../../src/core/dominio/repository/IConsultorioRepositorio";
import { CrearConsultorioDTO } from "../../../src/core/infraestructura/esquemas/ConsultorioEsquema";

describe("Pruebas unitarias - CrearConsultorio", () => {
    let repoMock: jest.Mocked<IConsultorioRepositorio>;
    let crearConsultorioCasoUso: CrearConsultorio;

    beforeEach(() => {
        // Mock del repositorio con todos sus métodos
        repoMock = {
            crear: jest.fn(),
            listar: jest.fn(),
            obtenerPorId: jest.fn(),
            actualizar: jest.fn(),
            eliminar: jest.fn(),
            actualizarDisponibilidad: jest.fn(),
            obtenerConsultorioPorID: jest.fn(),
        };

        crearConsultorioCasoUso = new CrearConsultorio(repoMock);
    });

    test("Debe crear un consultorio correctamente", async () => {
        
        const datosConsultorio: CrearConsultorioDTO = {
            nombre: "Consultorio 101",
            ubicacion: "Edificio A, Piso 1",
            disponible: true,
        };

        repoMock.crear.mockResolvedValue(undefined);

        
        await crearConsultorioCasoUso.ejecutar(datosConsultorio);

        
        expect(repoMock.crear).toHaveBeenCalledTimes(1);
        expect(repoMock.crear).toHaveBeenCalledWith(datosConsultorio);
    });

    test("Debe usar disponible=true por defecto si no se proporciona", async () => {
        
        const datosConsultorio: CrearConsultorioDTO = {
            nombre: "Consultorio 202",
            ubicacion: "Edificio B, Piso 2",
            disponible: true, // Zod aplica el default
        };

        repoMock.crear.mockResolvedValue(undefined);

        
        await crearConsultorioCasoUso.ejecutar(datosConsultorio);

        
        expect(repoMock.crear).toHaveBeenCalledWith(
            expect.objectContaining({
                disponible: true,
            })
        );
    });

    test("Debe propagar el error cuando el repositorio falla", async () => {
        
        const datosConsultorio: CrearConsultorioDTO = {
            nombre: "Consultorio 303",
            ubicacion: "Edificio C, Piso 3",
            disponible: false,
        };

        const errorMessage = "Error de base de datos al crear consultorio";
        repoMock.crear.mockRejectedValue(new Error(errorMessage));

        
        await expect(crearConsultorioCasoUso.ejecutar(datosConsultorio))
            .rejects
            .toThrow(errorMessage);

        expect(repoMock.crear).toHaveBeenCalledTimes(1);
    });

    test("Debe manejar consultorios con nombres largos", async () => {
        const datosConsultorio: CrearConsultorioDTO = {
            nombre: "Consultorio de Cardiología Avanzada y Diagnóstico",
            ubicacion: "Torre Médica Norte, Piso 5, Ala Izquierda",
            disponible: true,
        };

        repoMock.crear.mockResolvedValue(undefined);

        
        await crearConsultorioCasoUso.ejecutar(datosConsultorio);

        
        expect(repoMock.crear).toHaveBeenCalledWith(datosConsultorio);
    });
});
