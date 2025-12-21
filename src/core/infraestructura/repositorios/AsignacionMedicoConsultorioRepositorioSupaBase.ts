import { IAsignacionMedicoConsultorio } from "../../dominio/entidades/asignacionMedicoConsultorio/IAsignacionMedicoConsultorio";
import { IAsignacionMedicoConsultorioRepositorio } from "../../dominio/repository/IAsignacionMedicoConsultorioRepositorio";
import { supabase } from "../cliente-db/clienteSupabase";
import { AsignacionMedicoConsultorioDTO } from "../esquemas/AsignacionMedicoConsultorioEsquema";
import { v4 as uuidv4 } from "uuid";
export class AsignacionMedicoConsultorioRepositorioSupaBase implements IAsignacionMedicoConsultorioRepositorio {

async crearAsignacionMedicoConsultorio(datosAsignacion: AsignacionMedicoConsultorioDTO): Promise<IAsignacionMedicoConsultorio> {
    const { data, error } = await supabase
    .from("asignacion_medico_consultorio")
    .insert({
        id_asignacion: uuidv4(),
        id_medico: datosAsignacion.idMedico,
        id_consultorio: datosAsignacion.idConsultorio,
        dias_disponibles: datosAsignacion.diasDisponibles,
        hora_inicio: datosAsignacion.horaInicio,
        hora_fin: datosAsignacion.horaFin,
        creada_en: new Date().toISOString(),
    })
    .select("*")
    .single();

    if (error) {
        throw new Error(`Error al crear la asignación del médico al consultorio: ${error.message}`);
    }

    return data as IAsignacionMedicoConsultorio;
}

async listarAsignacionMedicoConsultorio(limite?: number): Promise<IAsignacionMedicoConsultorio[]> {
    let query = supabase.from("asignacion_medico_consultorio").select("*");
    
    if (limite) query = query.limit(limite);

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return data as IAsignacionMedicoConsultorio[];
}

async obtenerAsignacionMedicoConsultorioPorId(idAsignacion: string): Promise<IAsignacionMedicoConsultorio | null> {
    const { data, error } = await supabase
    .from("asignacion_medico_consultorio")
    .select("*")
    .eq("id_asignacion", idAsignacion)
    .single();

    if (error) return null;

    return data as IAsignacionMedicoConsultorio;
}

async actualizarAsignacionMedicoConsultorio(idAsignacion: string, datosAsignacion: IAsignacionMedicoConsultorio): 
Promise<IAsignacionMedicoConsultorio | null> {
    const { data, error } = await supabase
      .from("asignacion_medico_consultorio")
      .update({
        id_medico: datosAsignacion.idMedico,
        id_consultorio: datosAsignacion.idConsultorio,
        dias_disponibles: datosAsignacion.diasDisponibles,
        hora_inicio: datosAsignacion.horaInicio,
        hora_fin: datosAsignacion.horaFin,
        creada_en: new Date().toISOString(),
      })
      .eq("id_asignacion", idAsignacion)
      .select("*")
      .single();

    if (error) throw new Error("Error al actualizar la asignación: " + error.message);

    return data as IAsignacionMedicoConsultorio
}

  async eliminarAsignacionMedicoConsultorio(idAsignacion: string): Promise<void> {
    const { error } = await supabase
    .from("asignacion_medico_consultorio")
    .delete()
    .eq("id_asignacion", idAsignacion);

    if (error) {
      throw new Error( "Error al eliminar la asignación del médico al consultorio: " + error.message);
    }
  }

  async obtenerMedicoPorId(idMedico: string): Promise<{ id_medico: string } | null> {
    const { data, error } = await supabase
    .from("medicos")
    .select("id_medico")
    .eq("id_medico", idMedico)
    .single();

    if (error || !data) return null;

    return data;
  }

  async obtenerConsultorioPorId(idConsultorio: string): Promise<{ id_consultorio: string } | null> {
    const { data, error } = await supabase
    .from("consultorios")
    .select("id_consultorio")
    .eq("id_consultorio", idConsultorio)
    .single();
    
    if (error || !data) return null;
    
    return data;
  }

  async buscarAsignacionesPorConsultorio(idConsultorio: string): Promise<IAsignacionMedicoConsultorio[]> {
    const { data, error } = await supabase
    .from("asignacion_medico_consultorio")
    .select("*")
    .eq("id_consultorio", idConsultorio);
    
    if (error) throw new Error("Error al obtener asignaciones por consultorio");

    return data;
  }

  async buscarAsignacionesPorMedico(idMedico: string): Promise<IAsignacionMedicoConsultorio[]> {
    const { data, error } = await supabase
    .from("asignacion_medico_consultorio")
    .select("*")
    .eq("id_medico", idMedico);

    if (error) throw new Error("Error al obtener asignaciones por médico");
    
    return data;
  }

  async buscarAsignacionDuplicada(datos: IAsignacionMedicoConsultorio): Promise<IAsignacionMedicoConsultorio | null> {
    const { data, error } = await supabase
    .from("asignacion_medico_consultorio")
    .select("*")
    .eq("id_medico", datos.idMedico)
    .eq("id_consultorio", datos.idConsultorio)
    .eq("hora_inicio", datos.horaInicio)
    .eq("hora_fin", datos.horaFin)
    .maybeSingle();

    if (error) throw new Error("Error al buscar asignación duplicada");

    return data 
  }
};
