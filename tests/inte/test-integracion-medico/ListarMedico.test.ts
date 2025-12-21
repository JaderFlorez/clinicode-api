import Fastify from "fastify";
import { medicosEnrutador } from "../../../src/presentacion/rutas/medicoEnrutador";
import { supabase } from "../../../src/core/infraestructura/cliente-db/clienteSupabase";
import crypto from "crypto";

describe("TEST INTEGRACIÓN - Listar Médicos", () => {
  let app: any;
  let idInsertado = "";

  const medicoTest = {
    nombres: "Thomas",
    apellidos: "Higuita",
    numero_licencia: `${Date.now()}-${crypto.randomUUID()}`,
    id_especialidad: "0c1a79e3-2b07-4f52-a06e-c861ee4c4e97",
    telefono: "3002126321",
    correo: `thomas-${Date.now()}@test.com`,
  };

  beforeAll(async () => {
    app = Fastify();
    await app.register(medicosEnrutador);
    await app.ready();

    const { data, error } = await supabase
      .from("medicos")
      .insert([{ id_medico: crypto.randomUUID(), ...medicoTest }])
      .select()
      .single();

    if (error) throw error;

    idInsertado = data.id_medico;
  });

  afterAll(async () => {
    await supabase.from("medicos").delete().eq("id_medico", idInsertado);
    await app.close();
  });

  test("Debe listar los médicos correctamente", async () => {
    const respuesta = await app.inject({
      method: "GET",
      url: "/medicos",
    });

    const body = JSON.parse(respuesta.body);

    expect(respuesta.statusCode).toBe(200);
    expect(Array.isArray(body.datos)).toBe(true);

    const existe = body.datos.some((m: any) => m.id_medico === idInsertado);
    expect(existe).toBe(true);
  });
});
