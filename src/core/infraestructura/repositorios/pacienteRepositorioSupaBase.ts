import { IPacienteRepositorio } from "../../dominio/repository/IPacienteRepositorio";
import { IPaciente } from "../../dominio/entidades/pacientes/Ipaciente";
import { supabase } from "../cliente-db/clienteSupabase";
import { randomUUID } from "node:crypto";;



export class PacienteRepositorioSupaBase implements IPacienteRepositorio {


    async crearPaciente(datosPaciente: IPaciente): Promise<string> {
        const { data, error } = await supabase
            .from('pacientes')
            .insert([{
                id_paciente: randomUUID(),
                tipo_documento: datosPaciente.tipoDocumento,
                numero_documento: datosPaciente.numeroDocumento,
                nombres: datosPaciente.nombres,
                apellidos: datosPaciente.apellidos,
                fecha_nacimiento: datosPaciente.fechaNacimiento,
                telefono: datosPaciente.telefono,
                correo: datosPaciente.correo,
                direccion: datosPaciente.direccion
            }])
            .select("id_paciente")
            .single();

        if (error) {
            throw new Error("Error al crear paciente: " + error.message);
        }
        return data.id_paciente;
    }

    async listarPacientes(limite?: number): Promise<IPaciente[]> {
        let query = supabase.from('pacientes').select('*');

        if (limite) {
            query = query.limit(limite);
        }

        const { data, error } = await query;

        if (error) throw new Error(error.message);

        return data as IPaciente[];
    }

    async obtenerPacientePorId(idPaciente: string): Promise<IPaciente | null> {
        const { data, error } = await supabase
            .from('pacientes').select('*').eq('id_paciente', idPaciente).single();
        if (error) {
            throw new Error("Error al obtener Paciente" + error.message)
        }
        return data;
    }

    async actualizarPaciente(idPaciente: string, datosPaciente: IPaciente): Promise<IPaciente | null> {
        const { data, error } = await supabase
            .from("pacientes")
            .update({
                tipo_documento: datosPaciente.tipoDocumento,
                numero_documento: datosPaciente.numeroDocumento,
                nombres: datosPaciente.nombres,
                apellidos: datosPaciente.apellidos,
                fecha_nacimiento: datosPaciente.fechaNacimiento,
                telefono: datosPaciente.telefono,
                correo: datosPaciente.correo,
                direccion: datosPaciente.direccion,
            })
            .eq("id_paciente", idPaciente)
            .select("*")
            .single();

        if (error) {
            throw new Error("Error al actualizar paciente: " + error.message);
        }

        return data as IPaciente;
    }

    async eliminarPaciente(idPaciente: string): Promise<void> {
        const { error } = await supabase
            .from("pacientes")
            .delete()
            .eq("id_paciente", idPaciente);

        if (error) {
            throw new Error("Error al eliminar paciente: " + error.message);
        }
    }

};