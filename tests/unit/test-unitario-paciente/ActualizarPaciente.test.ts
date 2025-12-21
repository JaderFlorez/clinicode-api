import { ActualizarPaciente } from "../../../src/core/aplicacion/pacienteCasoUso/ActualizarPaciente";
import { IPacienteRepositorio } from "../../../src/core/dominio/repository/IPacienteRepositorio";
import { IPaciente } from "../../../src/core/dominio/entidades/pacientes/Ipaciente";

describe("Pruebas unitarias ActualizarPaciente",() =>{
    let repoMock: jest.Mocked<IPacienteRepositorio>;
    let actualizarPacienteCasoUso: ActualizarPaciente;

    beforeEach(() => {
        repoMock = {
            crearPaciente: jest.fn(),
            obtenerPacientePorId: jest.fn(),
            listarPacientes: jest.fn(),
            actualizarPaciente: jest.fn(),
            eliminarPaciente: jest.fn(),
        };

        actualizarPacienteCasoUso = new ActualizarPaciente(repoMock);

    });

    test("Actualizar paciente correctamente y retornar IPaciciente", async () => {
        
        const idPaciente = "7e757e3e-ab7c-4e98-880a-9d6733f6754a";

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

        const pacienteActualizado: IPaciente = {
            ...datosPaciente,
            nombres: "Carlos Alberto"
        };


        repoMock.actualizarPaciente.mockResolvedValue(pacienteActualizado);

        const result = await actualizarPacienteCasoUso.ejecutar(idPaciente,datosPaciente);

        expect(repoMock.actualizarPaciente).toHaveBeenCalled();
        expect(repoMock.actualizarPaciente).toHaveBeenCalledWith(idPaciente,datosPaciente);
        expect(result).toEqual(pacienteActualizado);
    });

    test("Retorna null si el repositorio no encuentra el paciente para actualizar", async () => {

        const idPaciente = "7e757e3e-ab7c-4e98-880a-9d6733f6754a";

        const datosPaciente: IPaciente = {
            tipoDocumento: "TI",
            numeroDocumento: "987654321",
            nombres: "Ana",
            apellidos: "Martínez",
            fechaNacimiento: new Date("2000-01-01"),
            telefono: "3012223344",
            correo: "ana@example.com",
            direccion: "Carrera 12 #4-56",
        };

        repoMock.actualizarPaciente.mockResolvedValue(null);

        const result = await actualizarPacienteCasoUso.ejecutar(idPaciente, datosPaciente);

        expect(repoMock.actualizarPaciente).toHaveBeenCalled();
        expect(repoMock.actualizarPaciente).toHaveBeenCalledWith(idPaciente, datosPaciente);
        expect(result).toBeNull();
    });

    test("Lanza un error si el repositorio falla al actualizar", async () => {

        const idPaciente = "7e757e3e-ab7c-4e98-880a-9d6733f6754a";

        const datosPaciente: IPaciente = {
            tipoDocumento: "CC",
            numeroDocumento: "111222333",
            nombres: "Luis",
            apellidos: "Ramírez",
            fechaNacimiento: new Date("1985-11-11"),
            telefono: "3059998877",
            correo: "luis@example.com",
            direccion: "Av Siempre Viva 123",
        };

        repoMock.actualizarPaciente.mockRejectedValue(
            new Error("No se logró actualizar al paciente")
        );

        await expect(
            actualizarPacienteCasoUso.ejecutar(idPaciente, datosPaciente)
        )
        .rejects
        .toThrow("No se logró actualizar al paciente");

        expect(repoMock.actualizarPaciente).toHaveBeenCalled();
    });
});
