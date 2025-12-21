import {
    actualizarConsultorioControlador, 
    crearConsultorioControlador,
    eliminarConsultorioControlador,
    listarConsultoriosControlador
} from '../controladores/consultorioControlador';
import { FastifyInstance } from 'fastify';


export async function consultorioEnrutador(app: FastifyInstance) {
    app.post('/consultorios', crearConsultorioControlador);
    app.get('/consultorios', listarConsultoriosControlador);
    app.put("/consultorios/:id_consultorio", actualizarConsultorioControlador);
    app.delete('/consultorios/:id_consultorio', eliminarConsultorioControlador);
}
