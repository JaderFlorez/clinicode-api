import { FastifyInstance } from "fastify";
import {
    actualizarCitaMedicaControlador, cancelarOReprogramarCitaControlador,
    crearCitaMedicaControlador, eliminarCitaMedicaControlador, listarCitasMedicasControlador,
    obtenerCitaMedicaPorIdControlador
} from "../controladores/CitasMedicasControlador";

export async function citasMedicasEnrutador(app: FastifyInstance) {

    app.post("/citas-medicas", crearCitaMedicaControlador);
    app.get("/citas-medicas", listarCitasMedicasControlador);
    app.get("/citas-medicas/:id_cita", obtenerCitaMedicaPorIdControlador);
    app.put("/citas-medicas/:id_cita", actualizarCitaMedicaControlador);
    app.delete("/citas-medicas/:id_cita", eliminarCitaMedicaControlador);
    app.put("/citas-medicas/:id_cita/accion", cancelarOReprogramarCitaControlador);
}
