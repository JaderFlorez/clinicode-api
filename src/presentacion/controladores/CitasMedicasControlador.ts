import { CancelarOReprogramarCitaCasoUso } from "../../core/aplicacion/CasosUsoCitasMedicas/CancelarOReprogramarCitaCasoUso";
import { ObtenerCitaMedicaPorIdCasoUso } from "../../core/aplicacion/CasosUsoCitasMedicas/ObtenerCitaMedicaPorIdCasoUso";
import { ConsultorioRepositorioSupabase } from "../../core/infraestructura/repositorios/consultorioRepositorioSupabase";
import { CitasMedicasRepositorioSupabase } from "../../core/infraestructura/repositorios/CitaMedicaRepositorioSupabase";
import { ActualizarCitaMedicaCasoUso } from "../../core/aplicacion/CasosUsoCitasMedicas/ActualizarCitaMedicaCasoUso";
import { ObtenerCitasMedicasCasoUso } from "../../core/aplicacion/CasosUsoCitasMedicas/ObtenerCitasMedicasCasoUso";
import { EliminarCitaMedicaCasoUso } from "../../core/aplicacion/CasosUsoCitasMedicas/EliminarCitaMedicaCasoUso";
import { StatusCode } from "../../common/statusCode";
import {
    respuestaExitosa,
    respuestaCreacion,
    respuestaError,
} from "../../common/respuestaHttp";
import { errorServidor, noEncontrado, solicitudInvalida } from "../../common/erroresComunes";
import { CrearCitaMedicaCasoUso } from "../../core/aplicacion/CasosUsoCitasMedicas/CrearCitaMedicaCasoUso";
import { DatosReprogramacion, ICitasMedicas } from "../../core/dominio/entidades/CitasMedicas/ICitasMedicas";
import { FastifyRequest, FastifyReply } from "fastify";
import { MedicoRepositorioSupabase } from "../../core/infraestructura/repositorios/medicoRepositorioSupabase";
import { PacienteRepositorioSupaBase } from "../../core/infraestructura/repositorios/pacienteRepositorioSupaBase";
import { CrearCitaMedicaEsquema } from "../../core/infraestructura/esquemas/CitaMedicaEsquemas/CrearCitaMedicaEsquema";
import { ActualizarCitaMedicaEsquema } from "../../core/infraestructura/esquemas/CitaMedicaEsquemas/ActualizarCitaMedicaEsquema";
import { EstadosCita } from "../../common/estadoCita";



const repoCitas = new CitasMedicasRepositorioSupabase();
const repoPacientes = new PacienteRepositorioSupaBase();
const repoMedicos = new MedicoRepositorioSupabase();
const repoConsultorios = new ConsultorioRepositorioSupabase();


const cancelarOReprogramarCitaCaso = new CancelarOReprogramarCitaCasoUso(repoCitas, repoConsultorios);
const obtenerCitaPorIdCaso = new ObtenerCitaMedicaPorIdCasoUso(repoCitas);
const actualizarCitaCaso = new ActualizarCitaMedicaCasoUso(repoCitas);
const listarCitasCaso = new ObtenerCitasMedicasCasoUso(repoCitas);
const eliminarCitaCaso = new EliminarCitaMedicaCasoUso(repoCitas);
const crearCitaCaso = new CrearCitaMedicaCasoUso(repoCitas, repoPacientes, repoMedicos, repoConsultorios);


export async function crearCitaMedicaControlador(req: FastifyRequest, reply: FastifyReply) {
    try {
        const body = req.body as any;

        const datosDTO = {
            id_paciente: body.idPaciente,
            id_medico: body.idMedico,
            id_consultorio: body.idConsultorio,
            fecha_cita: body.fechaCita,
            motivoCita: body.motivoCita,
        };

        const datosValidados = CrearCitaMedicaEsquema.parse(datosDTO);

        const datosICita: ICitasMedicas = {
            id_cita: "",
            ...datosValidados,
            estado: EstadosCita.PROGRAMADA,
            creadaEn: "",
            actualizadaEn: null
        };

        const cita = await crearCitaCaso.ejecutar(datosICita);

        return reply
            .code(StatusCode.CREADO)
            .send(respuestaCreacion(cita, "Cita médica creada correctamente."));

    } catch (error: any) {

        if (error.name === "ZodError") {
            return reply
                .code(StatusCode.SOLICITUD_INCORRECTA)
                .send(solicitudInvalida(error.issues));
        }

        return reply
            .code(StatusCode.ERROR_SERVIDOR)
            .send(errorServidor(`Error al crear la cita médica: ${error.message}`));
    }
}


export async function listarCitasMedicasControlador(req: FastifyRequest, reply: FastifyReply) {
    try {
        const citas = await listarCitasCaso.ejecutar();
        if (!citas || citas.length === 0) {
            return reply
                .code(StatusCode.SIN_CONTENIDO)
                .send(respuestaExitosa([], "No hay citas médicas registradas actualmente."));
        }
        return reply
            .code(StatusCode.EXITO)
            .send(respuestaExitosa(citas, "Citas médicas obtenidas correctamentee."));
    } catch (error: any) {
        reply
            .code(StatusCode.ERROR_SERVIDOR)
            .send(respuestaError(`Error al obtener citas: ${error.message}`));
    }
}

export async function obtenerCitaMedicaPorIdControlador(req: FastifyRequest, reply: FastifyReply) {
    try {

        const { id_cita } = req.params as { id_cita: string };
        if (!id_cita) {
            return reply.code(400).send({ mensaje: "Debe proporcionar un id_cita válido." });
        }

        const cita = await obtenerCitaPorIdCaso.ejecutar(id_cita);
        if (!cita) {
            return reply
                .code(StatusCode.NO_ENCONTRADO)
                .send(noEncontrado("Cita médica no encontrada."));
        }

        return reply
            .code(StatusCode.EXITO)
            .send(respuestaExitosa(cita, "Cita médica obtenida correctamente."));
    } catch (error: any) {
        return reply
            .code(StatusCode.ERROR_SERVIDOR)
            .send(errorServidor(`Error al obtener cita medica: ${error.message}`));
    }
}

export async function actualizarCitaMedicaControlador(req: FastifyRequest, reply: FastifyReply) {
    try {
        const { id_cita } = req.params as { id_cita: string };

        if (!id_cita) {
            return reply
                .code(StatusCode.SOLICITUD_INCORRECTA)
                .send(solicitudInvalida("Debe proporcionar un id_cita válido."));
        }

        const body = req.body as any;

        if (!body || Object.keys(body).length === 0) {
            return reply
                .code(StatusCode.SOLICITUD_INCORRECTA)
                .send(solicitudInvalida("No se recibieron datos para actualizar."));
        }

        const dto = {
            id_paciente: body.idPaciente,
            id_medico: body.idMedico,
            id_consultorio: body.idConsultorio,
            fecha_cita: body.fechaCita,
            motivoCita: body.motivoCita,
            estado: body.estadoCita
        };

        const datosValidados = ActualizarCitaMedicaEsquema.parse(dto);

        const citaExistente = await obtenerCitaPorIdCaso.ejecutar(id_cita);

        if (!citaExistente) {
            return reply
                .code(StatusCode.NO_ENCONTRADO)
                .send(noEncontrado("La cita médica no existe."));
        }

        const datosCompletos: ICitasMedicas = {
            id_cita: citaExistente.id_cita,
            id_paciente: datosValidados.id_paciente ?? citaExistente.id_paciente,
            id_medico: datosValidados.id_medico ?? citaExistente.id_medico,
            id_consultorio: datosValidados.id_consultorio ?? citaExistente.id_consultorio,
            fecha_cita: datosValidados.fecha_cita ?? citaExistente.fecha_cita,
            motivoCita: datosValidados.motivoCita ?? citaExistente.motivoCita,
            estado: datosValidados.estado ?? citaExistente.estado,
            creadaEn: citaExistente.creadaEn,
            actualizadaEn: new Date().toISOString()
        };

        const citaActualizada = await actualizarCitaCaso.ejecutar(id_cita, datosCompletos);

        return reply
            .code(StatusCode.EXITO)
            .send(respuestaExitosa(citaActualizada, "Cita médica actualizada correctamente."));

    } catch (error: any) {

        if (error.name === "ZodError") {
            return reply
                .code(StatusCode.SOLICITUD_INCORRECTA)
                .send(solicitudInvalida(error.errors));
        }

        return reply
            .code(StatusCode.ERROR_SERVIDOR)
            .send(errorServidor(`Error al actualizar cita médica: ${error.message}`));
    }
}


export async function eliminarCitaMedicaControlador(req: FastifyRequest, reply: FastifyReply) {
    try {
        const { id_cita } = req.params as { id_cita: string };
        if (!id_cita) {
            return reply.code(400).send({ mensaje: "Debe proporcionar un id_cita válido." });
        }
        const eliminada = await eliminarCitaCaso.ejecutar(id_cita);
        if (!eliminada) {
            return reply
                .code(StatusCode.NO_ENCONTRADO)
                .send(noEncontrado("No se encontró la cita médica para eliminar."));
        }

        return reply.code(200).send({
            mensaje: "Cita médica eliminada correctamente.",
            data: { id_cita },
        });
    } catch (error: any) {
        return reply
            .code(StatusCode.ERROR_SERVIDOR)
            .send(errorServidor(`Error al eliminar la cita médica: ${error.message}`));
    }
}

export async function cancelarOReprogramarCitaControlador(req: FastifyRequest, reply: FastifyReply) {
    try {
        const { id_cita } = req.params as { id_cita: string };
        const { accion, fecha_cita, id_consultorio } = req.body as {
            accion: "cancelar" | "reprogramar";
            fecha_cita?: string;
            id_consultorio?: string;
        };

        if (!id_cita) {
            return reply.code(400).send({ mensaje: "Debe proporcionar un id_cita válido." });
        }

        if (!accion || (accion !== "cancelar" && accion !== "reprogramar")) {
            return reply.code(400).send({
                mensaje: "Debe especificar una acción válida: 'cancelar' o 'reprogramar'.",
            });
        }

        const datosReprogramacion: DatosReprogramacion = {};

        if (fecha_cita) datosReprogramacion.fecha_cita = fecha_cita;
        if (id_consultorio) datosReprogramacion.id_consultorio = id_consultorio;

        const resultado = await cancelarOReprogramarCitaCaso.ejecutar(
            id_cita,
            accion,
            datosReprogramacion
        );

        return reply.code(200).send({
            mensaje:
                accion === "cancelar"
                    ? "Cita médica cancelada correctamente."
                    : "Cita médica reprogramada correctamente.",
            data: resultado,
        });
    } catch (error: any) {
        return reply.code(400).send({
            mensaje: "Error al procesar la acción sobre la cita médica.",
            error: error.message,
        });
    }
}
