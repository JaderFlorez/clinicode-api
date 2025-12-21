import { FastifyRequest, FastifyReply } from "fastify";
import { CrearPaciente } from "../../core/aplicacion/pacienteCasoUso/CrearPaciente";
import { ListarPacientes } from "../../core/aplicacion/pacienteCasoUso/ListarPacientes";
import { ObtenerPacientePorId } from "../../core/aplicacion/pacienteCasoUso/ObtenerPacientePorId";
import { ActualizarPaciente } from "../../core/aplicacion/pacienteCasoUso/ActualizarPaciente";
import { EliminarPaciente } from "../../core/aplicacion/pacienteCasoUso/EliminarPaciente";
import { PacienteDTO, CrearPacienteEsquema } from "../../core/infraestructura/esquemas/PacienteEsquema";
import { PacienteRepositorioSupaBase } from "../../core/infraestructura/repositorios/pacienteRepositorioSupaBase";
import { ZodError } from "zod";
import { StatusCode } from "../../common/statusCode";
import { respuestaError, respuestaExitosa} from "../../common/respuestaHttp";
import { errorServidor, noEncontrado, solicitudInvalida } from "../../common/erroresComunes";


const repo = new PacienteRepositorioSupaBase();

const crearPacienteCaso = new CrearPaciente(repo);
const listarPacientesCaso = new ListarPacientes(repo);
const obtenerPacientePorIdCaso = new ObtenerPacientePorId(repo);
const actualizarPacienteCaso = new ActualizarPaciente(repo);
const eliminarPacienteCaso = new EliminarPaciente(repo);


export async function crearPacienteControlador(
  req: FastifyRequest<{Body: PacienteDTO}>,
  reply: FastifyReply) {
  try {
    const datosPaciente = CrearPacienteEsquema.parse(req.body);
    const idNuevoPaciente = await crearPacienteCaso.ejecutar(datosPaciente);
    
    return reply
    .code(StatusCode.CREADO)
    .send(respuestaExitosa(idNuevoPaciente,"Paciente creado correctamente"));
  } catch (err) {
    if (err instanceof ZodError) {
      return reply
      .code(StatusCode.SOLICITUD_INCORRECTA)
      .send(respuestaError("Datos inválidos"))
    }

    return reply
    .code(StatusCode.ERROR_SERVIDOR)
    .send(errorServidor(`Error al crear el paciente: ${err instanceof Error ? err.message : String(err)}`));
  }
};

export async function listarPacienesControlador (
  req: FastifyRequest<{ Querystring: { limite?: number } }>, 
  reply: FastifyReply) {
  try {
    const { limite } = req.query;
    const pacientesEncontrados = await listarPacientesCaso.ejecutar(limite);

    return reply
    .code(StatusCode.EXITO)
    .send(respuestaExitosa({pacientes: pacientesEncontrados,
      pacientesEncontrados: pacientesEncontrados.length},"Pacientes encontrados correctamente"));
  } catch (err) {
    return reply
    .code(StatusCode.ERROR_SERVIDOR)
    .send(errorServidor(`Error al listar el paciente: ${err instanceof Error ? err.message : String(err)}`));
  }
};

export async function obtenerPacientePorIdControlador (
  req: FastifyRequest<{ Params: { idPaciente: string } }>, 
  reply: FastifyReply) {
    try {
      const { idPaciente } = req.params;
      const pacienteEncontrado = await obtenerPacientePorIdCaso.ejecutar(idPaciente);

      if (!pacienteEncontrado) {
        return reply
        .code(StatusCode.NO_ENCONTRADO)
        .send(noEncontrado(idPaciente));
      }

      return reply
      .code(StatusCode.EXITO)
      .send(respuestaExitosa(pacienteEncontrado,"Paciente encontrado correctamente"));
    } catch(err) {
      return reply
      .code(StatusCode.ERROR_SERVIDOR)
      .send(errorServidor(`Error al listar el paciente: ${err instanceof Error ? err.message : String(err)}`));
    }
};

export async function actualizarPacienteControlador(
  req: FastifyRequest<{ Params: { idPaciente: string }; Body: PacienteDTO }>, 
  reply: FastifyReply){
    try{
      const { idPaciente} = req.params;
      const nuevoPaciente = CrearPacienteEsquema.parse(req.body);
      const pacienteActualizado = await actualizarPacienteCaso.ejecutar(
        idPaciente,
        nuevoPaciente);

        if (!pacienteActualizado) {
          reply
          .code(StatusCode.NO_ENCONTRADO)
          .send(noEncontrado(idPaciente));
        }

        return reply
        .code(StatusCode.EXITO)
        .send(respuestaExitosa(pacienteActualizado,"Paciente actualizado correctamente"));

    } catch(err) {
      return reply
      .code(StatusCode.ERROR_SERVIDOR)
      .send(errorServidor(`Error al actualizar el paciente: ${err instanceof Error ? err.message : String(err)}`));
    }
  };

  export async function eliminarPacienteControlador (
    req: FastifyRequest<{Params: {idPaciente: string}}>,
    reply: FastifyReply) {
      try {
        const {idPaciente} = req.params;
        await eliminarPacienteCaso.ejecutar(idPaciente);

        return reply
        .code(StatusCode.EXITO)
        .send(respuestaExitosa(idPaciente,"Paciente eliminado correctamente"));
      } catch (err){
        return reply
        .code(StatusCode.ERROR_SERVIDOR)
        .send(errorServidor(`Error al eliminar el paciente: ${err instanceof Error ? err.message : String(err)}`));
      }
    };
