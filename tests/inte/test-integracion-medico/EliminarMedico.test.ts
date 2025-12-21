import Fastify from "fastify";
import { medicosEnrutador } from "../../../src/presentacion/rutas/medicoEnrutador";
import { supabase } from "../../../src/core/infraestructura/cliente-db/clienteSupabase";
import crypto from "crypto";

describe("TEST INTEGRACIÓN - Eliminar Médico", () => {
    let app: any;
    let idInsertado = "";

    const medicoTest = {
        nombres: "Juliana",
        apellidos: "Ortiz",
        numero_licencia: `${Date.now()}-${crypto.randomUUID()}`,
        id_especialidad: "0c1a79e3-2b07-4f52-a06e-c861ee4c4e97",
        telefono: "3002223333",
        correo: `juliOrtiz-${Date.now()}@test.com`,
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
        await app.close();
    });

    test("Debe eliminar el médico correctamente", async () => {
        const respuesta = await app.inject({
            method: "DELETE",
            url: `/medicos/${idInsertado}`,
        });

        expect(respuesta.statusCode).toBe(200);

        const { data } = await supabase
            .from("medicos")
            .select("*")
            .eq("id_medico", idInsertado)
            .single();

        expect(data).toBeNull();
    });
});
