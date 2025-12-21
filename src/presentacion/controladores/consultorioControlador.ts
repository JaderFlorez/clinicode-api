import { ConsultorioRepositorioSupabase } from "../../core/infraestructura/repositorios/consultorioRepositorioSupabase";
import { ActualizarConsultorio } from "../../core/aplicacion/casoUsoConsultorio/actualizarConsultorio";
import { EliminarConsultorio } from "../../core/aplicacion/casoUsoConsultorio/eliminarConsultorio";
import { ListarConsultorios } from "../../core/aplicacion/casoUsoConsultorio/listarConsultorio";
import { CrearConsultorio } from "../../core/aplicacion/casoUsoConsultorio/crearConsultorio";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCode } from "../../common/statusCode";
import {
    CrearConsultorioEsquema,
    ActualizarConsultorioEsquema,
    ConsultorioIdEsquema,
    CrearConsultorioDTO,
    ActualizarConsultorioDTO
} from "../../core/infraestructura/esquemas/ConsultorioEsquema";
import { ZodError } from "zod";


const repo = new ConsultorioRepositorioSupabase();
const crearConsultorioCaso = new CrearConsultorio(repo);
const listarConsultoriosCaso = new ListarConsultorios(repo);
const actualizarConsultorioCaso = new ActualizarConsultorio(repo);
const eliminarConsultorioCaso = new EliminarConsultorio(repo);


export async function crearConsultorioControlador(req: FastifyRequest, reply: FastifyReply) {
    try {
        // Validación con Zod en la capa de presentación
        const consultorioValidado: CrearConsultorioDTO = CrearConsultorioEsquema.parse(req.body);
        
        await crearConsultorioCaso.ejecutar(consultorioValidado);
        reply.status(StatusCode.CREADO).send({ mensaje: 'Consultorio creado correctamente' });
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return reply.status(StatusCode.SOLICITUD_INCORRECTA).send({
                error: "Datos de entrada inválidos",
                detalles: error.issues.map((err) => ({
                    campo: err.path.join('.'),
                    mensaje: err.message
                }))
            });
        }
        const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
        reply.status(StatusCode.SOLICITUD_INCORRECTA).send({ error: errorMsg });
    }
}

export async function listarConsultoriosControlador(req: FastifyRequest, reply: FastifyReply) {
    try {
        const consultorios = await listarConsultoriosCaso.ejecutar();
        reply.send(consultorios);
    } catch (error: any) {
        reply.status(StatusCode.ERROR_SERVIDOR).send({ error: error.message });
    }
}

export async function actualizarConsultorioControlador(req: FastifyRequest, reply: FastifyReply) {
    try {
        // Validación con Zod en la capa de presentación
        const { id_consultorio } = ConsultorioIdEsquema.parse(req.params);
        const datosValidados: ActualizarConsultorioDTO = ActualizarConsultorioEsquema.parse(req.body);

        const consultorioActualizado = await actualizarConsultorioCaso.ejecutar(id_consultorio, datosValidados);

        reply.status(StatusCode.EXITO).send({
            mensaje: "Consultorio actualizado correctamente",
            data: consultorioActualizado,
        });
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return reply.status(StatusCode.SOLICITUD_INCORRECTA).send({
                error: "Datos de entrada inválidos",
                detalles: error.issues.map((err) => ({
                    campo: err.path.join('.'),
                    mensaje: err.message
                }))
            });
        }
        const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
        reply.status(StatusCode.SOLICITUD_INCORRECTA).send({ error: errorMsg });
    }
}


export async function eliminarConsultorioControlador(req: FastifyRequest, reply: FastifyReply) {
    try {
        
        const { id_consultorio } = ConsultorioIdEsquema.parse(req.params);

        await eliminarConsultorioCaso.ejecutar(id_consultorio);
        reply.status(StatusCode.EXITO).send({ mensaje: "Consultorio eliminado correctamente" });
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return reply.status(StatusCode.SOLICITUD_INCORRECTA).send({
                error: "Datos de entrada inválidos",
                detalles: error.issues.map((err) => ({
                    campo: err.path.join('.'),
                    mensaje: err.message
                }))
            });
        }
        const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
        reply.status(StatusCode.SOLICITUD_INCORRECTA).send({ error: errorMsg });
    }
}
