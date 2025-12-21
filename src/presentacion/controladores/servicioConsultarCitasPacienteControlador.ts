import { FastifyRequest, FastifyReply } from "fastify";
import { ServicioConsultarCitasPacienteRepositorioSupabase } from "../../core/infraestructura/repositorios/servicioConsultarCitasPacienteRepositorioSupabase";
import { ServicioConsultarCitasPacienteCasoUso } from "../../core/aplicacion/casoUsoServicioConsultarCitasPaciente/servicioConsultarCitasPaciente";
import { ServicioConsultarCitasPacienteEsquema } from "../../core/infraestructura/esquemas/ServicioConsultarCitasPacienteEsquema";
import {respuestaExitosa,respuestaError} from "../../common/respuestaHttp";
import { StatusCode } from "../../common/statusCode";
import { solicitudInvalida } from "../../common/erroresComunes";


const repo = new ServicioConsultarCitasPacienteRepositorioSupabase();
const casoUso = new ServicioConsultarCitasPacienteCasoUso(repo);

export const obtenerCitasPorPaciente = async (
  req: FastifyRequest<{ Params: { numeroDocumento: string } }>,
  res: FastifyReply
) => {
  try {
    const { numeroDocumento } = req.params;
    const validacion = ServicioConsultarCitasPacienteEsquema.safeParse({
      numero_documento: numeroDocumento,
    });

    if (!validacion.success) {
      const errores = validacion.error.issues.map((e) => e.message).join(", ");
      return res
        .status(StatusCode.SOLICITUD_INCORRECTA)
        .send(solicitudInvalida(errores));
    }

    const citas = await casoUso.consultarCitasMedicas(numeroDocumento);

    if (!citas || citas.length === 0) {
      return res.status(StatusCode.EXITO).send(
        respuestaExitosa([], "El paciente no tiene citas registradas")
      );
    }

    return res
      .status(StatusCode.EXITO)
      .send(respuestaExitosa(citas, "Citas médicas consultadas correctamente"));
  } catch (error: any) {
    console.error("Error al consultar citas médicas:", error);

    if (error.codigo && error.mensaje) {
      return res
        .status(error.codigo)
        .send(respuestaError(error));
    }

    return res
      .status(StatusCode.ERROR_SERVIDOR)
      .send(respuestaError("Paciente no encontrado"));
  }
};
