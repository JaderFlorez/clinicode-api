import { FastifyInstance } from "fastify";
import { obtenerCitasPorPaciente } from "../controladores/servicioConsultarCitasPacienteControlador";

export async function servicioConsultarCitasPacienteEnrutador(app: FastifyInstance) {
  app.get("/paciente/:numeroDocumento/citas", obtenerCitasPorPaciente);
}
