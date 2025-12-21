import Fastify from 'fastify';
import cors from '@fastify/cors';
import { pacienteEnrutador } from './rutas/pacienteEnrutador';
import { medicosEnrutador } from './rutas/medicoEnrutador';
import { consultorioEnrutador } from './rutas/consultorioEnrutador';
import { citasMedicasEnrutador } from './rutas/CitasMedicasEnrutador';
import { servicioConsultarCitasPacienteEnrutador } from './rutas/servicioConsultarCitasPacienteEnrutador';
import { asignacionMedicoConsultorioEnrutador } from './rutas/asignacionMedicoConsultorioEnrutador';


const app = Fastify({ logger: true });

app.register(cors);
app.register(pacienteEnrutador, { prefix: '/api' });
app.register(medicosEnrutador, { prefix: '/api' })
app.register(consultorioEnrutador, { prefix: '/api' });
app.register(citasMedicasEnrutador, { prefix: "/api" });
app.register(servicioConsultarCitasPacienteEnrutador, {prefix: '/api'})
app.register(asignacionMedicoConsultorioEnrutador, { prefix: '/api'});

app.get('/', async () => {
    return { mensaje: 'Servidor Fastify funcionando' };
});

export default app;
