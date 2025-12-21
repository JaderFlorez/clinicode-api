import { IMedicosRepositorio } from "../../dominio/repository/IMedicoRepositorio";
import { IMedico } from "../../dominio/entidades/medicos/IMedico";
import { MedicoDTO } from "../esquemas/MedicoEsquema";
import { supabase } from "../cliente-db/clienteSupabase";
import { randomUUID } from "node:crypto";

export class MedicoRepositorioSupabase implements IMedicosRepositorio {
    

    async crearMedico(datosMedico: MedicoDTO): Promise<string> {
        const id_medico = randomUUID();
        const { data, error } = await supabase
            .from("medicos")
            .insert([
                {
                    id_medico,
                    nombres: datosMedico.nombres,
                    apellidos: datosMedico.apellidos,
                    numero_licencia: datosMedico.numero_licencia,
                    id_especialidad: datosMedico.id_especialidad,
                    telefono: datosMedico.telefono ?? null,
                    correo: datosMedico.correo ?? null,
                },
            ])
            .select("id_medico")
            .single();

        if (error) throw new Error(`Error al crear médico: ${error.message}`);

        return data.id_medico;
    }

    async listarMedicos(limite?: number): Promise<IMedico[]> {
        let query = supabase.from("medicos").select("*");

        if (limite) query = query.limit(limite);

        const { data, error } = await query;

        if (error) throw new Error(`Error al listar médicos: ${error.message}`);

        return data as IMedico[];
    }

    async obtenerMedicoPorId(id_medico: string): Promise<IMedico | null> {
        const { data, error } = await supabase
            .from("medicos")
            .select("*")
            .eq("id_medico", id_medico)
            .single();

        if (error) {
            if (error.code === "PGRST116") return null;
            throw new Error(`Error al obtener médico: ${error.message}`);
        }

        return data as IMedico;
    }

    async actualizarMedico(id_medico: string, datosMedico: IMedico): Promise<IMedico> {
        const { data, error } = await supabase
            .from("medicos")
            .update({
                id_medico,
                nombres: datosMedico.nombres,
                apellidos: datosMedico.apellidos,
                numero_licencia: datosMedico.numero_licencia,
                id_especialidad: datosMedico.id_especialidad,
                telefono: datosMedico.telefono ?? null,
                correo: datosMedico.correo ?? null,
            })
            .eq("id_medico", id_medico)
            .select("*")
            .single();

        if (error) throw new Error(`Error al actualizar médico: ${error.message}`);

        return data as IMedico;
    }

    async eliminarMedico(id_medico: string): Promise<void> {
        const { data: citas, error: errorCitas } = await supabase
            .from("citas_medicas")
            .select("id_cita")
            .eq("id_medico", id_medico);

        if (errorCitas)
            throw new Error(`Error al validar citas del médico: ${errorCitas.message}`);

        if (citas && citas.length > 0)
            throw new Error("No se puede eliminar el médico porque tiene citas asociadas.");

        const { error } = await supabase
            .from("medicos")
            .delete()
            .eq("id_medico", id_medico);

        if (error) throw new Error(`Error al eliminar médico: ${error.message}`);
    }
}
