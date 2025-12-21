import { FastifyInstance } from "fastify";
import { MedicoControlador } from "../controladores/medicoControlador";
import { IMedicosRepositorio } from "../../core/dominio/repository/IMedicoRepositorio";
import { MedicoRepositorioSupabase } from "../../core/infraestructura/repositorios/medicoRepositorioSupabase";
import { CrearMedico } from "../../core/aplicacion/casoUsoMedico/crearMedico";
import { ListarMedicos } from "../../core/aplicacion/casoUsoMedico/listarMedico";
import { ObtenerMedicoPorId } from "../../core/aplicacion/casoUsoMedico/obtenerMedicoPorId";
import { ActualizarMedico } from "../../core/aplicacion/casoUsoMedico/actualizaMedico";
import { EliminarMedico } from "../../core/aplicacion/casoUsoMedico/eliminarMedico";


function medicoEnrutador(
    app: FastifyInstance,
    medicoControlador: MedicoControlador
) {
    app.get("/medicos", medicoControlador.listarMedicos);
    app.get("/medicos/:id_medico", medicoControlador.obtenerMedicoPorId);
    app.post("/medicos", medicoControlador.crearMedico);
    app.put("/medicos/:id_medico", medicoControlador.actualizarMedico);
    app.delete("/medicos/:id_medico", medicoControlador.eliminarMedico);
}

export async function medicosEnrutador(app: FastifyInstance) {
    const medicosRepositorio: IMedicosRepositorio = new MedicoRepositorioSupabase();

    const crearMedico = new CrearMedico(medicosRepositorio);
    const listarMedicos = new ListarMedicos(medicosRepositorio);
    const obtenerMedicoPorId = new ObtenerMedicoPorId(medicosRepositorio);
    const actualizarMedico = new ActualizarMedico(medicosRepositorio);
    const eliminarMedico = new EliminarMedico(medicosRepositorio);

    const casosDeUso = {
        crearMedico: (datos: any) => crearMedico.crearMedico(datos),
        listarMedicos: (limite?: number) => listarMedicos.obtenerMedicos(limite),
        obtenerMedicoPorId: (id: string) =>
            obtenerMedicoPorId.obtenerMedicoPorId(id),
        actualizarMedico: (id: string, datos: any) =>
            actualizarMedico.actualizarMedico(id, datos),
        eliminarMedico: (id: string) => eliminarMedico.eliminarMedico(id),
    };

    const medicoControlador = new MedicoControlador(casosDeUso);

    medicoEnrutador(app, medicoControlador);
}
