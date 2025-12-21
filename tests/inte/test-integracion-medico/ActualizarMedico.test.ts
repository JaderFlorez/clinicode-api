import Fastify from "fastify";
import { medicosEnrutador } from "../../../src/presentacion/rutas/medicoEnrutador";
import { supabase } from "../../../src/core/infraestructura/cliente-db/clienteSupabase";
import crypto from "crypto";

describe("TEST INTEGRACIÓN - Actualizar Médico", () => {
    let app: any;
    let idInsertado = "";

    const medicoOriginal = {
        nombres: "Carlos",
        apellidos: "Romero",
        numero_licencia: `${Date.now()}-${crypto.randomUUID()}`,
        id_especialidad: "0c1a79e3-2b07-4f52-a06e-c861ee4c4e97",
        telefono: "3101112233",
        correo: `carlos-${Date.now()}@test.com`,
    };

    const medicoActualizado = {
        nombres: "Carlos",
        apellidos: "Romero",
        numero_licencia: `${Date.now()}-${crypto.randomUUID()}`,
        id_especialidad: "0c1a79e3-2b07-4f52-a06e-c861ee4c4e97",
        telefono: "3205558899",
        correo: `carlos-update-${Date.now()}@test.com`,
    };

    beforeAll(async () => {
        app = Fastify();
        await app.register(medicosEnrutador);
        await app.ready();

        const { data, error } = await supabase
            .from("medicos")
            .insert([{ id_medico: crypto.randomUUID(), ...medicoOriginal }])
            .select()
            .single();

        if (error) throw error;
        idInsertado = data.id_medico;
    });

    afterAll(async () => {
        await supabase.from("medicos").delete().eq("id_medico", idInsertado);
        await app.close();
    });

    test("Debe actualizar un médico correctamente", async () => {
        const respuesta = await app.inject({
            method: "PUT",
            url: `/medicos/${idInsertado}`,
            payload: medicoActualizado,
        });

        const body = JSON.parse(respuesta.body);

        expect(respuesta.statusCode).toBe(200);
        expect(body.datos.nombres).toBe(medicoActualizado.nombres);

        const { data: medicoBD } = await supabase
            .from("medicos")
            .select("*")
            .eq("id_medico", idInsertado)
            .single();

        expect(medicoBD.nombres).toBe(medicoActualizado.nombres);
        expect(medicoBD.telefono).toBe(medicoActualizado.telefono);
    });
});
