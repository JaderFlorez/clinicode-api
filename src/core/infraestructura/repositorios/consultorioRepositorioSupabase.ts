import { IConsultorioRepositorio } from "../../dominio/repository/IConsultorioRepositorio";
import { Consultorio } from "../../dominio/entidades/consultorios/IConsultorio";
import { supabase } from "../cliente-db/clienteSupabase";

export class ConsultorioRepositorioSupabase implements IConsultorioRepositorio {
    async crear(consultorio: Consultorio): Promise<void> {
        const { error } = await supabase.from('consultorios').insert([consultorio]);
        if (error) throw new Error(error.message);
    }

    async listar(): Promise<Consultorio[]> {
        const { data, error } = await supabase.from('consultorios').select('*');
        if (error) throw new Error(error.message);
        return data as Consultorio[];
    }

    async actualizar(id_consultorio: string, datos: Partial<Consultorio>): Promise<Consultorio> {
        const { data, error } = await supabase
            .from("consultorios")
            .update(datos)
            .eq("id_consultorio", id_consultorio)
            .select();

        if (error) {
            throw new Error(error.message);
        }

        if (!data || data.length === 0) {
            throw new Error("Consultorio no encontrado");
        }

        return data[0] as Consultorio;
    }

    async eliminar(id_consultorio: string): Promise<boolean> {
        const { error } = await supabase
            .from('consultorios')
            .delete()
            .eq('id_consultorio', id_consultorio);

        if (error) {
            console.error(error);
            throw new Error("Error al eliminar el consultorio.");
        }

        return true;
    }

    async obtenerPorId(id_consultorio: string): Promise<Consultorio | null> {
        const { data, error } = await supabase
            .from("consultorios")
            .select("*")
            .eq("id_consultorio", id_consultorio)
            .single();
            
            if (error) return null;
            return data as Consultorio;
        }
    async actualizarDisponibilidad(id_consultorio: string, disponible: boolean): Promise<void> {
        const { error } = await supabase
            .from("consultorios")
            .update({ disponible })
            .eq("id_consultorio", id_consultorio);

        if (error) {
            throw new Error(`Error al actualizar disponibilidad del consultorio: ${error.message}`);
        }
    }

    async obtenerConsultorioPorID(id: string): Promise<Consultorio | null> {
        const { data, error } = await supabase
            .from("consultorios")
            .select("*")
            .eq("id_consultorio", id)
            .single();

        if (error) return null;
        return data || null;
    }

}
