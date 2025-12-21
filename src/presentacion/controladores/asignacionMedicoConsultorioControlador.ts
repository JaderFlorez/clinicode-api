import { FastifyRequest, FastifyReply } from "fastify";
import { CrearAsignacionMedicoConsultorio } from "../../core/aplicacion/asignacionMedicoConsultorioCasoUso/CrearAsignacionMedicoConsultorio";
import { ListarAsignacionMedicoConsultorio } from "../../core/aplicacion/asignacionMedicoConsultorioCasoUso/ListarAsignacionMedicoConsultorio";
import { ObtenerAsignacionMedicoConsultorioID } from "../../core/aplicacion/asignacionMedicoConsultorioCasoUso/ObtenerAsignacionMedicoConsultorioID";
import { ActualizarAsignacionMedicoConsultorio } from "../../core/aplicacion/asignacionMedicoConsultorioCasoUso/ActualizarAsignacionMedicoConsultorio";
import { EliminarAsignacionMedicoConsultorio } from "../../core/aplicacion/asignacionMedicoConsultorioCasoUso/EliminarAsignacionMedicoConsultorio";
import { AsignacionMedicoConsultorioDTO,CrearAsignacionMedicoConsultorioEsquema } from "../../core/infraestructura/esquemas/AsignacionMedicoConsultorioEsquema";
import { AsignacionMedicoConsultorioRepositorioSupaBase } from "../../core/infraestructura/repositorios/AsignacionMedicoConsultorioRepositorioSupaBase";
import { MedicoRepositorioSupabase } from "../../core/infraestructura/repositorios/medicoRepositorioSupabase";
import { ConsultorioRepositorioSupabase } from "../../core/infraestructura/repositorios/consultorioRepositorioSupabase";
import { ZodError } from "zod";
import { StatusCode } from "../../common/statusCode";
import { respuestaExitosa} from "../../common/respuestaHttp";
import { errorServidor, noEncontrado, solicitudInvalida } from "../../common/erroresComunes";



const repoAsignaciones = new AsignacionMedicoConsultorioRepositorioSupaBase();
const repoConsultorio = new ConsultorioRepositorioSupabase();
const repoMedico = new MedicoRepositorioSupabase();

const crearAsignacionMedicoConsultorioCaso = new CrearAsignacionMedicoConsultorio(repoAsignaciones,repoMedico,repoConsultorio);
const listarAsignacionMedicoConsultorioCaso = new ListarAsignacionMedicoConsultorio(repoAsignaciones);
const ObtenerAsignacionMedicoConsultorioIDCaso = new ObtenerAsignacionMedicoConsultorioID(repoAsignaciones);
const actualizarAsignacionMedicoConsultorioCaso = new ActualizarAsignacionMedicoConsultorio(repoAsignaciones,repoMedico,repoConsultorio);
const eliminarAsignacionMedicoConsultorioCaso = new EliminarAsignacionMedicoConsultorio(repoAsignaciones);

export async function crearAsignacionMedicoConsultorioControlador (
    req: FastifyRequest<{Body:AsignacionMedicoConsultorioDTO}>,
    reply: FastifyReply) {
        try{
            const datosAsignacion = CrearAsignacionMedicoConsultorioEsquema.parse(req.body);
            const nuevaAsignacion = await crearAsignacionMedicoConsultorioCaso.ejecutar(datosAsignacion);

            return reply
            .code(StatusCode.EXITO)
            .send(respuestaExitosa(nuevaAsignacion,"Asignación del médico al consultorio creada correctamente"));
        } catch (err) {
            if (err instanceof ZodError) {
                return reply
                .code(StatusCode.SOLICITUD_INCORRECTA)
                .send(solicitudInvalida(err.issues[0]?.message || "Error desconocido"));
            }
            return reply
            .code(StatusCode.ERROR_SERVIDOR)
            .send(errorServidor(`Error al crear la asignación del médico al consultorio: ${err instanceof Error ? err.message : String(err)}`));
        }
    };

export async function listarAsignacionMedicoConsultorioControlador (
    req: FastifyRequest<{Querystring: {limite?: number}}>,
    reply: FastifyReply) {
        try{
            const {limite} = req.query;
            const asignacionEncontrada = await listarAsignacionMedicoConsultorioCaso.ejecutar(limite);

            return reply
            .code(StatusCode.EXITO)
            .send(respuestaExitosa({Asignación: asignacionEncontrada,
                TotalAsignaciones: asignacionEncontrada.length},
                "Asignaciones del médico al consultorio encontradas correctamente"));
        } catch(err){
            return reply
            .code(StatusCode.ERROR_SERVIDOR)
            .send(errorServidor(`Error al listar la asignación del médico al consultorio: ${err instanceof Error ? err.message : String(err)}`));
        }
    };

export async function obtenerAsignacionMedicoConsultorioControlador (
    req: FastifyRequest<{ Params: { idAsignacion:string } }>, 
    reply: FastifyReply) {
        try {
            const { idAsignacion} = req.params;
            const asignacionEncontrada = await ObtenerAsignacionMedicoConsultorioIDCaso.ejecutar(idAsignacion);
            
            if (!asignacionEncontrada) {
                return reply
                .code(StatusCode.NO_ENCONTRADO)
                .send(noEncontrado(idAsignacion));
            }
            
            return reply
            .code(StatusCode.EXITO)
            .send(respuestaExitosa(asignacionEncontrada,
                "Asignación del médico al consultorio encontrada correctamente"));
        } catch(err) {
            return reply
            .code(StatusCode.ERROR_SERVIDOR)
            .send(errorServidor(`Error al obtener la asignación del médico al consultorio: ${err instanceof Error ? err.message : String(err)}`));
        }
    };

export async function actualizarAsignacionMedicoConsultorioControlador(
    req: FastifyRequest<{ Params: { idAsignacion: string }; Body: AsignacionMedicoConsultorioDTO }>, 
    reply: FastifyReply){
        try{
            const { idAsignacion} = req.params;
            const nuevaAsignacion = CrearAsignacionMedicoConsultorioEsquema.parse(req.body);
            const asignacionActualizada = await actualizarAsignacionMedicoConsultorioCaso.ejecutar(
        idAsignacion,
        nuevaAsignacion);

        if (!asignacionActualizada) {
            reply
            .code(StatusCode.NO_ENCONTRADO)
            .send(noEncontrado(idAsignacion));
        }
        
        return reply
        .code(StatusCode.EXITO)
        .send(respuestaExitosa(asignacionActualizada,
            "Asignación del médico al consultorio actualizada correctamente"));
    } catch(err) {
        return reply
        .code(StatusCode.ERROR_SERVIDOR)
        .send(errorServidor(`Error al actualizar la asignación del médico al consultorio: ${err instanceof Error ? err.message : String(err)}`));
    }
};

export async function eliminarAsignacionMedicoConsultorioControlador (
    req: FastifyRequest<{Params: {idAsignacion: string}}>,
    reply: FastifyReply) {
        try {
            const {idAsignacion} = req.params;
            await eliminarAsignacionMedicoConsultorioCaso.ejecutar(idAsignacion);
            
            return reply
            .code(StatusCode.EXITO)
            .send(respuestaExitosa(idAsignacion,"Asignación del médico al consultorio eliminada correctamente"));
        } catch (err){
            return reply
            .code(StatusCode.ERROR_SERVIDOR)
            .send(errorServidor(`Error al eliminar la asignación del médico al consultorio: ${err instanceof Error ? err.message : String(err)}`));
        }
    };