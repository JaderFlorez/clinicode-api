import { ListarConsultorios } from "../../../src/core/aplicacion/casoUsoConsultorio/listarConsultorio";
import { IConsultorioRepositorio } from "../../../src/core/dominio/repository/IConsultorioRepositorio";
import { Consultorio } from "../../../src/core/dominio/entidades/consultorios/IConsultorio";

describe("Pruebas unitarias - ListarConsultorios", () => {
    let repoMock: jest.Mocked<IConsultorioRepositorio>;
    let listarConsultoriosCasoUso: ListarConsultorios;

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

        listarConsultoriosCasoUso = new ListarConsultorios(repoMock);
    });

    test("Debe listar todos los consultorios correctamente", async () => {

        const consultoriosEsperados: Consultorio[] = [
            {
                id: 1,
                nombre: "Consultorio 101",
                ubicacion: "Edificio A, Piso 1",
                disponible: true,
            },
            {
                id: 2,
                nombre: "Consultorio 102",
                ubicacion: "Edificio A, Piso 1",
                disponible: false,
            },
            {
                id: 3,
                nombre: "Consultorio 201",
                ubicacion: "Edificio B, Piso 2",
                disponible: true,
            },
        ];

        repoMock.listar.mockResolvedValue(consultoriosEsperados);

        
        const resultado = await listarConsultoriosCasoUso.ejecutar();

        
        expect(repoMock.listar).toHaveBeenCalledTimes(1);
        expect(resultado).toEqual(consultoriosEsperados);
        expect(resultado).toHaveLength(3);
    });

    test("Debe retornar un array vacío cuando no hay consultorios", async () => {
        
        repoMock.listar.mockResolvedValue([]);

        
        const resultado = await listarConsultoriosCasoUso.ejecutar();

        
        expect(repoMock.listar).toHaveBeenCalledTimes(1);
        expect(resultado).toEqual([]);
        expect(resultado).toHaveLength(0);
    });

    test("Debe retornar consultorios con diferentes estados de disponibilidad", async () => {
        
        const consultoriosEsperados: Consultorio[] = [
            {
                id: 1,
                nombre: "Consultorio Disponible",
                ubicacion: "Edificio A",
                disponible: true,
            },
            {
                id: 2,
                nombre: "Consultorio No Disponible",
                ubicacion: "Edificio B",
                disponible: false,
            },
        ];

        repoMock.listar.mockResolvedValue(consultoriosEsperados);

        
        const resultado = await listarConsultoriosCasoUso.ejecutar();

        
        expect(resultado.some((c) => c.disponible === true)).toBeTruthy();
        expect(resultado.some((c) => c.disponible === false)).toBeTruthy();
    });

    test("Debe propagar el error cuando el repositorio falla", async () => {
        
        const errorMessage = "Error al conectar con la base de datos";
        repoMock.listar.mockRejectedValue(new Error(errorMessage));

        
        await expect(listarConsultoriosCasoUso.ejecutar())
            .rejects
            .toThrow(errorMessage);

        expect(repoMock.listar).toHaveBeenCalledTimes(1);
    });

    test("Debe retornar un array con un solo consultorio", async () => {
        
        const consultoriosEsperados: Consultorio[] = [
            {
                id: 1,
                nombre: "Único Consultorio",
                ubicacion: "Edificio Único",
                disponible: true,
            },
        ];

        repoMock.listar.mockResolvedValue(consultoriosEsperados);

        
        const resultado = await listarConsultoriosCasoUso.ejecutar();

        
        expect(resultado).toHaveLength(1);
        expect(resultado[0].nombre).toBe("Único Consultorio");
    });
});
