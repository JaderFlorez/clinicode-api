import { ObtenerPacientePorId } from "../../../src/core/aplicacion/pacienteCasoUso/ObtenerPacientePorId";
import { IPacienteRepositorio } from "../../../src/core/dominio/repository/IPacienteRepositorio";
import { IPaciente } from "../../../src/core/dominio/entidades/pacientes/Ipaciente";

describe("Pruebas unitarias ObtenerPacientePorId", () => {

    let repoMock: jest.Mocked<IPacienteRepositorio>;
    let obtenerPacienteCasoUso: ObtenerPacientePorId;

    beforeEach(() => {
        repoMock = {
            crearPaciente: jest.fn(),
            obtenerPacientePorId: jest.fn(),
            listarPacientes: jest.fn(),
            actualizarPaciente: jest.fn(),
            eliminarPaciente: jest.fn(),
        };

        obtenerPacienteCasoUso = new ObtenerPacientePorId(repoMock);
    });

    test("Obtiene un paciente correctamente por ID", async () => {
        
        const idPaciente = "7e757e3e-ab7c-4e98-880a-9d6733f6756a";

        const paciente: IPaciente = {
            tipoDocumento: "CC",
            numeroDocumento: "123456789",
            nombres: "Sofía",
            apellidos: "Martínez",
            fechaNacimiento: new Date("1998-07-10"),
            telefono: "3009876543",
            correo: "sofia@example.com",
            direccion: "Calle 45 #23-10",
        };

        repoMock.obtenerPacientePorId.mockResolvedValue(paciente);

        const result = await obtenerPacienteCasoUso.ejecutar(idPaciente);

        expect(repoMock.obtenerPacientePorId).toHaveBeenCalled();
        expect(repoMock.obtenerPacientePorId).toHaveBeenCalledWith(idPaciente);
        expect(result).toEqual(paciente);
    });

    test("Retorna null si no se encuentra el paciente", async () => {
        
        const idPaciente = "7e757e3e-ab7c-4e98-880a-9d6733f6756a";

        repoMock.obtenerPacientePorId.mockResolvedValue(null);

        const result = await obtenerPacienteCasoUso.ejecutar(idPaciente);

        expect(repoMock.obtenerPacientePorId).toHaveBeenCalled();
        expect(repoMock.obtenerPacientePorId).toHaveBeenCalledWith(idPaciente);
        expect(result).toBeNull();
    });

    test("Lanza un error si el repositorio falla al obtener el paciente", async () => {
        
        const idPaciente = "7e757e3e-ab7c-4e98-880a-9d6733f6756a";

        repoMock.obtenerPacientePorId.mockRejectedValue(
            new Error("Error al obtener paciente")
        );

        await expect(
            obtenerPacienteCasoUso.ejecutar(idPaciente)
        )
        .rejects
        .toThrow("Error al obtener paciente");

        expect(repoMock.obtenerPacientePorId).toHaveBeenCalled();
    });

});
