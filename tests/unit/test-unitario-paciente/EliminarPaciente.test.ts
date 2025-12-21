import {EliminarPaciente} from "../../../src/core/aplicacion/pacienteCasoUso/EliminarPaciente";
import { IPacienteRepositorio } from "../../../src/core/dominio/repository/IPacienteRepositorio";


describe("Pruebas unitarias EliminarPaciente", () =>{

    let repoMock: jest.Mocked<IPacienteRepositorio>;
    let eliminarPacienteCasoUso: EliminarPaciente;

    beforeEach(() =>{
        repoMock = {
            crearPaciente: jest.fn(),
            obtenerPacientePorId: jest.fn(),
            listarPacientes: jest.fn(),
            actualizarPaciente: jest.fn(),
            eliminarPaciente: jest.fn(),
        };

        eliminarPacienteCasoUso = new EliminarPaciente(repoMock);
    });
    
    test("Elimina un paciente correctamente", async () =>{
        const idPaciente = "7e757e3e-ab7c-4e98-880a-9d6733f6742a";

        repoMock.eliminarPaciente.mockResolvedValue(undefined);

        await eliminarPacienteCasoUso.ejecutar(idPaciente);

        expect(repoMock.eliminarPaciente).toHaveBeenCalled();
        expect(repoMock.eliminarPaciente).toHaveBeenCalledWith(idPaciente);

    });

    test("Lanza un error si el repositorio falla al eliminar", async () => {
        const idPaciente = "7e757e3e-ab7c-4e98-880a-9d6733f6742b";

        repoMock.eliminarPaciente.mockRejectedValue(
            new Error("No se logró eliminar al paciente")
        );

        await expect(eliminarPacienteCasoUso.ejecutar(idPaciente))
        .rejects
        .toThrow("No se logró eliminar al paciente");

        expect(repoMock.eliminarPaciente).toHaveBeenCalled();
    });

}); 