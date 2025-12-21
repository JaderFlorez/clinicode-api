import { ActualizarConsultorio } from "../../../src/core/aplicacion/casoUsoConsultorio/actualizarConsultorio";
import { IConsultorioRepositorio } from "../../../src/core/dominio/repository/IConsultorioRepositorio";
import { ActualizarConsultorioDTO } from "../../../src/core/infraestructura/esquemas/ConsultorioEsquema";
import { Consultorio } from "../../../src/core/dominio/entidades/consultorios/IConsultorio";

describe("Pruebas unitarias - ActualizarConsultorio", () => {
    let repoMock: jest.Mocked<IConsultorioRepositorio>;
    let actualizarConsultorioCasoUso: ActualizarConsultorio;

    beforeEach(() => {
        // Mock del repositorio
        repoMock = {
            crear: jest.fn(),
            listar: jest.fn(),
            obtenerPorId: jest.fn(),
            actualizar: jest.fn(),
            eliminar: jest.fn(),
            actualizarDisponibilidad: jest.fn(),
            obtenerConsultorioPorID: jest.fn(),
        };

        actualizarConsultorioCasoUso = new ActualizarConsultorio(repoMock);
    });

    test("Debe actualizar un consultorio correctamente", async () => {
        
        const idConsultorio = "c1234567-89ab-cdef-0123-456789abcdef";
        const datosActualizacion: ActualizarConsultorioDTO = {
            nombre: "Consultorio 101 - Actualizado",
            ubicacion: "Edificio A, Piso 2",
        };

        const consultorioActualizado: Consultorio = {
            id: 1,
            nombre: "Consultorio 101 - Actualizado",
            ubicacion: "Edificio A, Piso 2",
            disponible: true,
        };

        repoMock.actualizar.mockResolvedValue(consultorioActualizado);

        
        const resultado = await actualizarConsultorioCasoUso.ejecutar(
            idConsultorio,
            datosActualizacion
        );

        
        expect(repoMock.actualizar).toHaveBeenCalledTimes(1);
        expect(repoMock.actualizar).toHaveBeenCalledWith(idConsultorio, datosActualizacion);
        expect(resultado).toEqual(consultorioActualizado);
    });

    test("Debe actualizar solo el nombre del consultorio", async () => {
        
        const idConsultorio = "c1234567-89ab-cdef-0123-456789abcdef";
        const datosActualizacion: ActualizarConsultorioDTO = {
            nombre: "Nuevo Nombre Consultorio",
        };

        const consultorioActualizado: Consultorio = {
            id: 1,
            nombre: "Nuevo Nombre Consultorio",
            ubicacion: "Edificio A, Piso 1",
            disponible: true,
        };

        repoMock.actualizar.mockResolvedValue(consultorioActualizado);

        
        const resultado = await actualizarConsultorioCasoUso.ejecutar(
            idConsultorio,
            datosActualizacion
        );

        
        expect(repoMock.actualizar).toHaveBeenCalledWith(idConsultorio, datosActualizacion);
        expect(resultado.nombre).toBe("Nuevo Nombre Consultorio");
    });

    test("Debe actualizar la disponibilidad del consultorio", async () => {
        
        const idConsultorio = "c1234567-89ab-cdef-0123-456789abcdef";
        const datosActualizacion: ActualizarConsultorioDTO = {
            disponible: false,
        };

        const consultorioActualizado: Consultorio = {
            id: 1,
            nombre: "Consultorio 101",
            ubicacion: "Edificio A, Piso 1",
            disponible: false,
        };

        repoMock.actualizar.mockResolvedValue(consultorioActualizado);

        
        const resultado = await actualizarConsultorioCasoUso.ejecutar(
            idConsultorio,
            datosActualizacion
        );

        
        expect(resultado.disponible).toBe(false);
    });

    test("Debe actualizar múltiples campos a la vez", async () => {
        
        const idConsultorio = "c1234567-89ab-cdef-0123-456789abcdef";
        const datosActualizacion: ActualizarConsultorioDTO = {
            nombre: "Consultorio Renovado",
            ubicacion: "Torre Nueva, Piso 3",
            disponible: false,
        };

        const consultorioActualizado: Consultorio = {
            id: 1,
            nombre: "Consultorio Renovado",
            ubicacion: "Torre Nueva, Piso 3",
            disponible: false,
        };

        repoMock.actualizar.mockResolvedValue(consultorioActualizado);

        
        const resultado = await actualizarConsultorioCasoUso.ejecutar(
            idConsultorio,
            datosActualizacion
        );

        
        expect(resultado).toEqual(consultorioActualizado);
    });

    test("Debe propagar el error cuando el repositorio falla", async () => {
        
        const idConsultorio = "c1234567-89ab-cdef-0123-456789abcdef";
        const datosActualizacion: ActualizarConsultorioDTO = {
            nombre: "Consultorio Error",
        };

        const errorMessage = "Error de base de datos";
        repoMock.actualizar.mockRejectedValue(new Error(errorMessage));

        
        await expect(
            actualizarConsultorioCasoUso.ejecutar(idConsultorio, datosActualizacion)
        ).rejects.toThrow(errorMessage);

        expect(repoMock.actualizar).toHaveBeenCalledTimes(1);
    });

    test("Debe manejar error cuando el consultorio no existe", async () => {
        
        const idConsultorio = "id-inexistente";
        const datosActualizacion: ActualizarConsultorioDTO = {
            nombre: "Consultorio Inexistente",
        };

        repoMock.actualizar.mockRejectedValue(new Error("Consultorio no encontrado"));

        
        await expect(
            actualizarConsultorioCasoUso.ejecutar(idConsultorio, datosActualizacion)
        ).rejects.toThrow("Consultorio no encontrado");
    });
});
