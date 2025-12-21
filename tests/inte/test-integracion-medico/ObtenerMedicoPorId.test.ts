import Fastify from "fastify";
import { medicosEnrutador } from "../../../src/presentacion/rutas/medicoEnrutador";
import { supabase } from "../../../src/core/infraestructura/cliente-db/clienteSupabase";
import crypto from "crypto";

describe("TEST INTEGRACIÓN - Obtener Médico por ID", () => {
    let app: any;
    let idInsertado = "";

    const medicoPrueba = {
        nombres: "Laura",
        apellidos: "Martínez",
        numero_licencia: `${Date.now()}-${crypto.randomUUID()}`,
        id_especialidad: "0c1a79e3-2b07-4f52-a06e-c861ee4c4e97",
        telefono: "3119998877",
        correo: `laura-${Date.now()}@test.com`,
    };

    beforeAll(async () => {
        app = Fastify();
        await app.register(medicosEnrutador);
        await app.ready();

        const { data, error } = await supabase
            .from("medicos")
            .insert([{ id_medico: crypto.randomUUID(), ...medicoPrueba }])
            .select()
            .single();

        if (error) throw error;

        idInsertado = data.id_medico;
    });

    afterAll(async () => {
        await supabase.from("medicos").delete().eq("id_medico", idInsertado);
        await app.close();
    });

    test("Debe obtener un médico por su ID", async () => {
        const respuesta = await app.inject({
            method: "GET",
            url: `/medicos/${idInsertado}`,
        });

        const body = JSON.parse(respuesta.body);

        expect(respuesta.statusCode).toBe(200);
        expect(body.datos.id_medico).toBe(idInsertado);
        expect(body.datos.nombres).toBe(medicoPrueba.nombres);
        expect(body.datos.correo).toBe(medicoPrueba.correo);
    });
});
