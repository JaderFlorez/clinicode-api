import { supabase } from "../../../src/core/infraestructura/cliente-db/clienteSupabase";
import { ServicioConsultarCitasPacienteRepositorioSupabase } from "../../../src/core/infraestructura/repositorios/servicioConsultarCitasPacienteRepositorioSupabase";
import { ServicioConsultarCitasPacienteCasoUso } from "../../../src/core/aplicacion/casoUsoServicioConsultarCitasPaciente/servicioConsultarCitasPaciente";
import crypto from "crypto";

describe("TEST INTEGRACIÓN - Consultar Citas Paciente", () => {
  const repo = new ServicioConsultarCitasPacienteRepositorioSupabase();
  const casoUso = new ServicioConsultarCitasPacienteCasoUso(repo);

  const timestamp = Date.now();
  const numeroDocumento = `${timestamp}`;

  let idPaciente: string;
  let idMedico: string;
  let idConsultorio: string;
  let idEspecialidad: string;
  let idCita: string;

  beforeAll(async () => {

    idEspecialidad = crypto.randomUUID();

    const { error: errorEsp } = await supabase
      .from("especialidades")
      .insert([
        { 
          id_especialidad: idEspecialidad,
          nombre: `Especialidad Test ${timestamp}` 
        }
      ]);

    if (errorEsp) throw errorEsp;

    idMedico = crypto.randomUUID();

    const { error: errorMed } = await supabase
      .from("medicos")
      .insert([
        {
          id_medico: idMedico,
          nombres: "Carlos",
          apellidos: "López",
          id_especialidad: idEspecialidad,
          numero_licencia: `LIC-${timestamp}`,
          telefono: "3001234567",
          correo: `carlos${timestamp}@test.com`
        }
      ]);

    if (errorMed) throw errorMed;

    const { data: consultorio, error: errorCons } = await supabase
      .from("consultorios")
      .insert([
        {
          nombre: `Consultorio ${timestamp}`,
          ubicacion: "Piso 3"
        }
      ])
      .select()
      .single();

    if (errorCons) throw errorCons;

    idConsultorio = consultorio.id_consultorio;

    const { data: paciente, error: errorPac } = await supabase
      .from("pacientes")
      .insert([
        {
          nombres: "Juan",
          apellidos: "Díaz",
          numero_documento: numeroDocumento,
          telefono: "123456",
          correo: `juan${timestamp}@test.com`,
          fecha_nacimiento: "1990-01-01"
        }
      ])
      .select()
      .single();

    if (errorPac) throw errorPac;

    idPaciente = paciente.id_paciente;

    const { data: cita, error: errorCita } = await supabase
      .from("citas_medicas")
      .insert([
        {
          fecha_cita: "2025-10-15",
          estado: "Programada",
          id_medico: idMedico,
          id_paciente: idPaciente,
          id_consultorio: idConsultorio
        }
      ])
      .select()
      .single();

    if (errorCita) throw errorCita;

    idCita = cita.id_cita;
  });

  test("Debe consultar las citas del paciente correctamente", async () => {
    const resultado = await casoUso.consultarCitasMedicas(numeroDocumento);

    expect(resultado.length).toBe(1);
    expect(resultado[0].id_cita).toBe(idCita);
    expect(resultado[0].medico.nombres).toBe("Carlos");
    expect(resultado[0].consultorio.nombre).toContain("Consultorio");
  });

  afterAll(async () => {
    await supabase.from("citas_medicas").delete().eq("id_cita", idCita);
    await supabase.from("pacientes").delete().eq("id_paciente", idPaciente);
    await supabase.from("medicos").delete().eq("id_medico", idMedico);
    await supabase.from("consultorios").delete().eq("id_consultorio", idConsultorio);
    await supabase.from("especialidades").delete().eq("id_especialidad", idEspecialidad);
  });
});
