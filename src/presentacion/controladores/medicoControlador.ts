import { FastifyRequest, FastifyReply } from "fastify";
import { IMedico } from "../../core/dominio/entidades/medicos/IMedico";
import { IMedicoCasosUso } from "../../core/aplicacion/casoUsoMedico/IMedicoCasosUso";
import { MedicoDTO, CrearMedicoEsquema } from "../../core/infraestructura/esquemas/MedicoEsquema";
import { ZodError } from "zod";
import { StatusCode } from "../../common/statusCode";
import { respuestaExitosa, respuestaCreacion, respuestaError } from "../../common/respuestaHttp";
import { solicitudInvalida, noEncontrado, errorServidor } from "../../common/erroresComunes";

export class MedicoControlador {
  constructor(private medicosCasosUso: IMedicoCasosUso) {}

  listarMedicos = async (
    request: FastifyRequest<{ Querystring: { limite?: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { limite } = request.query;
      const medicosEncontrados = await this.medicosCasosUso.listarMedicos(limite);

      return reply
        .status(StatusCode.EXITO)
        .send(respuestaExitosa(medicosEncontrados, "Médicos encontrados correctamente"));
    } catch (error: any) {
      console.error("Error al listar médicos:", error);
      return reply
        .status(StatusCode.ERROR_SERVIDOR)
        .send(respuestaError(errorServidor(error.message).mensaje));
    }
  };

  obtenerMedicoPorId = async (
    request: FastifyRequest<{ Params: { id_medico: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_medico } = request.params;
      const medicoEncontrado = await this.medicosCasosUso.obtenerMedicoPorId(id_medico);

      if (!medicoEncontrado) {
        return reply
          .status(StatusCode.NO_ENCONTRADO)
          .send(respuestaError(noEncontrado("No se encontró el médico solicitado").mensaje));
      }

      return reply
        .status(StatusCode.EXITO)
        .send(respuestaExitosa(medicoEncontrado, "Médico encontrado correctamente"));
    } catch (error: any) {
      console.error("Error al obtener médico:", error);
      return reply
        .status(StatusCode.ERROR_SERVIDOR)
        .send(respuestaError(errorServidor(error.message).mensaje));
    }
  };

  crearMedico = async (
    request: FastifyRequest<{ Body: MedicoDTO }>,
    reply: FastifyReply
  ) => {
    try {
      const nuevoMedico = CrearMedicoEsquema.parse(request.body);
      const idNuevoMedico = await this.medicosCasosUso.crearMedico(nuevoMedico);

      return reply
        .status(StatusCode.CREADO)
        .send(respuestaCreacion(idNuevoMedico, "Médico creado correctamente"));
    } catch (error: any) {
      if (error instanceof ZodError) {
        const detalle = error.issues.map((e) => e.message).join(", ");
        return reply
          .status(StatusCode.SOLICITUD_INCORRECTA)
          .send(respuestaError(solicitudInvalida(detalle).mensaje));
      }

      console.error("Error al crear médico:", error);
      return reply
        .status(StatusCode.ERROR_SERVIDOR)
        .send(respuestaError(errorServidor(error.message).mensaje));
    }
  };

  actualizarMedico = async (
    request: FastifyRequest<{ Params: { id_medico: string }; Body: IMedico }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_medico } = request.params;
      const datosMedico = request.body;
      const medicoActualizado = await this.medicosCasosUso.actualizarMedico(
        id_medico,
        datosMedico
      );

      if (!medicoActualizado) {
        return reply
          .status(StatusCode.NO_ENCONTRADO)
          .send(respuestaError(noEncontrado("No se encontró el médico para actualizar").mensaje));
      }

      return reply
        .status(StatusCode.EXITO)
        .send(respuestaExitosa(medicoActualizado, "Médico actualizado correctamente"));
    } catch (error: any) {
      console.error("Error al actualizar médico:", error);
      return reply
        .status(StatusCode.ERROR_SERVIDOR)
        .send(respuestaError(errorServidor(error.message).mensaje));
    }
  };

  eliminarMedico = async (
    request: FastifyRequest<{ Params: { id_medico: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_medico } = request.params;
      await this.medicosCasosUso.eliminarMedico(id_medico);

      return reply
        .status(StatusCode.EXITO)
        .send(respuestaExitosa({ id_medico }, "Médico eliminado correctamente"));
    } catch (error: any) {
      console.error("Error al eliminar médico:", error);
      return reply
        .status(StatusCode.ERROR_SERVIDOR)
        .send(respuestaError(errorServidor(error.message).mensaje));
    }
  };
}
