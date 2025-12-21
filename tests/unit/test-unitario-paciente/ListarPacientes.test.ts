import { ListarPacientes } from "../../../src/core/aplicacion/pacienteCasoUso/ListarPacientes";
import { IPacienteRepositorio } from "../../../src/core/dominio/repository/IPacienteRepositorio";
import { IPaciente } from "../../../src/core/dominio/entidades/pacientes/Ipaciente";


describe("Pruebas unitarias ListarPacientes", () => {

    const mockRepositorio: IPacienteRepositorio = {
        crearPaciente: jest.fn(),
        listarPacientes: jest.fn(),
        obtenerPacientePorId: jest.fn(),
        actualizarPaciente: jest.fn(),
        eliminarPaciente: jest.fn()
    };

    const casoUso = new ListarPacientes(mockRepositorio);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Listar pacientes correctamente", async () => {
        const pacientesMock: IPaciente[] = [
        {
            idPaciente: "1",
            tipoDocumento: "CC",
            numeroDocumento: "1234567890",
            nombres: "Juan",
            apellidos: "Pérez",
            fechaNacimiento: new Date("1990-05-10"),
            telefono: "3001234567",
            correo: "juan@example.com",
            direccion: "Calle 123"
        },
        {
            idPaciente: "2",
            tipoDocumento: "TI",
            numeroDocumento: "987654321",
            nombres: "Ana",
            apellidos: "Gómez",
            fechaNacimiento: new Date("1995-08-20"),
            telefono: "3109876543",
            correo: null,
            direccion: "Carrera 45"
        }
    ];;

        (mockRepositorio.listarPacientes as jest.Mock).mockResolvedValue(pacientesMock);

        const resultado = await casoUso.ejecutar();

        expect(mockRepositorio.listarPacientes).toHaveBeenCalled();
        expect(resultado).toEqual(pacientesMock);
    });

    test("Listar pacientes con límite", async () => {
        const pacientesMock: IPaciente[] = [
            {
            idPaciente: "1",
            tipoDocumento: "CC",
            numeroDocumento: "1234567890",
            nombres: "Juan",
            apellidos: "Pérez",
            fechaNacimiento: new Date("1990-05-10"),
            telefono: "3001234567",
            correo: "juan@example.com",
            direccion: "Calle 123"
        }
        ];

        (mockRepositorio.listarPacientes as jest.Mock).mockResolvedValue(pacientesMock);

        const resultado = await casoUso.ejecutar(1);

        expect(mockRepositorio.listarPacientes).toHaveBeenCalledWith(1);
        expect(resultado).toEqual(pacientesMock);
    });
});
