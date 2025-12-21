import { IServicioConsultarCitasPacientesRepositorio } from "../../dominio/repository/IServicioConsultarCitasPacientesRepositorio";
import { IConsultarCitasPaciente } from "../../dominio/entidades/servicioConsultarCitasPaciente/IConsultarCitasPaciente";
import { StatusCode } from "../../../common/statusCode";
import { supabase } from "../cliente-db/clienteSupabase";

export class ServicioConsultarCitasPacienteRepositorioSupabase implements IServicioConsultarCitasPacientesRepositorio{

  async obtenerCitasPorPaciente(
    numeroDocumento: string
  ): Promise<{ mensaje: string; citas: IConsultarCitasPaciente[] }> {

    const { data: paciente, error: errorPaciente } = await supabase
      .from("pacientes")
      .select("id_paciente")
      .eq("numero_documento", numeroDocumento)
      .single();

    if (errorPaciente || !paciente) {
      throw new Error("Paciente no encontrado" + StatusCode.NO_ENCONTRADO);
    }

    const { data: citas, error: errorCitas } = await supabase
      .from("citas_medicas")
      .select(`
        id_cita,
        fecha_cita,
        estado,
        medicos (
          nombres,
          apellidos,
          especialidades (nombre)
        ),
        consultorios (
          nombre,
          ubicacion
        )
      `)
      .eq("id_paciente", paciente.id_paciente)
      .order("fecha_cita", { ascending: true });

     if (errorCitas) {
      throw new Error ("Error al obtener las citas" + StatusCode.ERROR_SERVIDOR);
    }

    if (!citas || citas.length === 0) {
      return {
        mensaje: "El paciente no tiene citas registradas",
        citas: [],
      };
    }

    const citasDTO: IConsultarCitasPaciente[] = citas.map((cita: any) => ({
      id_cita: cita.id_cita,
      fecha_cita: cita.fecha_cita,
      estado: cita.estado,
      medico: {
        nombres: cita.medicos?.nombres,
        apellidos: cita.medicos?.apellidos,
        especialidad: cita.medicos?.especialidades?.nombre ?? null,
      },
      consultorio: {
        nombre: cita.consultorios?.nombre,
        ubicacion: cita.consultorios?.ubicacion,
      },
    }));

    return {
      mensaje: "Citas obtenidas correctamente",
      citas: citasDTO,
    };
  }
}
