import { CrearPaciente } from "../../../src/core/aplicacion/pacienteCasoUso/CrearPaciente";
import { IPacienteRepositorio } from "../../../src/core/dominio/repository/IPacienteRepositorio";
import { IPaciente } from "../../../src/core/dominio/entidades/pacientes/Ipaciente";

describe("Pruebas unitarias CrearPaciente", () => {

let repoMock: jest.Mocked<IPacienteRepositorio>;
let crearPacienteCasoUso: CrearPaciente;

beforeEach(() => {
    repoMock = {
    crearPaciente: jest.fn(),
    obtenerPacientePorId: jest.fn(),
    listarPacientes: jest.fn(),
    actualizarPaciente: jest.fn(),
    eliminarPaciente: jest.fn(),
    };

    crearPacienteCasoUso = new CrearPaciente(repoMock);
});

test("Crear un paciente y retornar el ID", async () => {
    const datosPaciente: IPaciente = {
        tipoDocumento: "CC",
        numeroDocumento: "123456789",
        nombres: "Juan",
        apellidos: "Pérez",
        fechaNacimiento: new Date("1995-05-05"),
        telefono: "3100000000",
        correo: "juanperez@example.com",
        direccion: "Calle 123",
    };

    const idGenerado = "7e757e3e-ab7c-4e98-880a-9d6733f6742a";

    repoMock.crearPaciente.mockResolvedValue(idGenerado);

    const result = await crearPacienteCasoUso.ejecutar(datosPaciente);

    expect(repoMock.crearPaciente).toHaveBeenCalled();
    expect(repoMock.crearPaciente).toHaveBeenCalledWith(datosPaciente);
    expect(result).toBe(idGenerado);
});

test("Lanzar un error cuando el repositorio falle", async () => {
    const datosPaciente: IPaciente = {
        tipoDocumento: "CC",
        numeroDocumento: "987654321",
        nombres: "Ana",
        apellidos: "Gómez",
        fechaNacimiento: new Date("1990-02-02"),
        telefono: "3001234567",
        correo: null,
        direccion: "Carrera 45 #12-34",
    };

    repoMock.crearPaciente.mockRejectedValue(
        new Error("Error al crear paciente")
    );

    await expect(crearPacienteCasoUso.ejecutar(datosPaciente))
    .rejects
    .toThrow("Error al crear paciente");

    expect(repoMock.crearPaciente).toHaveBeenCalled();
});

});