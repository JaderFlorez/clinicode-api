import { crearAsignacionMedicoConsultorioControlador, listarAsignacionMedicoConsultorioControlador } from "../controladores/asignacionMedicoConsultorioControlador";
import { obtenerAsignacionMedicoConsultorioControlador, actualizarAsignacionMedicoConsultorioControlador } from "../controladores/asignacionMedicoConsultorioControlador";
import { eliminarAsignacionMedicoConsultorioControlador } from "../controladores/asignacionMedicoConsultorioControlador";
import { FastifyInstance } from "fastify";

export async function asignacionMedicoConsultorioEnrutador (app: FastifyInstance){
    app.get('/asignacion-medico-consultorio',listarAsignacionMedicoConsultorioControlador);
    app.get('/asignacion-medico-consultorio/:idAsignacion',obtenerAsignacionMedicoConsultorioControlador);
    app.post('/asignacion-medico-consultorio', crearAsignacionMedicoConsultorioControlador);
    app.put('/asignacion-medico-consultorio/:idAsignacion',actualizarAsignacionMedicoConsultorioControlador);
    app.delete('/asignacion-medico-consultorio/:idAsignacion',eliminarAsignacionMedicoConsultorioControlador);
};

