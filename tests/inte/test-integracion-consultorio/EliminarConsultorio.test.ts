import Fastify, { FastifyInstance } from "fastify";
import { consultorioEnrutador } from "../../../src/presentacion/rutas/consultorioEnrutador";
import { supabase } from "../../../src/core/infraestructura/cliente-db/clienteSupabase";

describe("TEST INTEGRACIÓN - Eliminar Consultorio", () => {
    let app: FastifyInstance;
    let idConsultorioTest: string;

    beforeAll(async () => {
        app = Fastify();
        await app.register(consultorioEnrutador);
        await app.ready();
    });

    beforeEach(async () => {
        // Crear un consultorio de prueba antes de cada test
        const { data, error } = await supabase
            .from("consultorios")
            .insert([
                {
                    nombre: "Consultorio Para Eliminar",
                    ubicacion: "Ubicación Temporal",
                    disponible: true,
                },
            ])
            .select()
            .single();

        if (!error && data) {
            idConsultorioTest = data.id_consultorio;
        }
    });

    afterEach(async () => {
        // Limpiar consultorio de prueba después de cada test (por si no se eliminó)
        if (idConsultorioTest) {
            await supabase
                .from("consultorios")
                .delete()
                .eq("id_consultorio", idConsultorioTest);
        }
    });

    afterAll(async () => {
        await app.close();
    });

    test("Debe eliminar un consultorio correctamente", async () => {
        
        const respuesta = await app.inject({
            method: "DELETE",
            url: `/consultorios/${idConsultorioTest}`,
        });

        const body = JSON.parse(respuesta.body);

        
        expect(respuesta.statusCode).toBe(200);
        expect(body.mensaje).toBe("Consultorio eliminado correctamente");

        // Verificar que realmente se eliminó de la BD
        const { data: consultorioBD, error } = await supabase
            .from("consultorios")
            .select("*")
            .eq("id_consultorio", idConsultorioTest)
            .single();

        expect(consultorioBD).toBeNull();
        expect(error).not.toBeNull();
    });

    test("Debe manejar eliminación de consultorio inexistente", async () => {
        
        const idInexistente = "00000000-0000-0000-0000-000000000000";

        
        const respuesta = await app.inject({
            method: "DELETE",
            url: `/consultorios/${idInexistente}`,
        });

        
        expect([200, 400]).toContain(respuesta.statusCode);
    });

    test("Debe fallar al eliminar con ID vacío", async () => {
        
        const respuesta = await app.inject({
            method: "DELETE",
            url: `/consultorios/`,
        });

    
        expect(respuesta.statusCode).toBe(400);
    });

    test("Debe manejar múltiples eliminaciones consecutivas", async () => {
        // Crear múltiples consultorios
        const consultoriosIds: string[] = [];

        for (let i = 0; i < 3; i++) {
            const { data } = await supabase
                .from("consultorios")
                .insert([
                    {
                        nombre: `Consultorio Eliminar ${i}`,
                        ubicacion: `Ubicación ${i}`,
                        disponible: true,
                    },
                ])
                .select()
                .single();

            if (data) {
                consultoriosIds.push(data.id_consultorio);
            }
        }

        //  Eliminar todos
        for (const id of consultoriosIds) {
            const respuesta = await app.inject({
                method: "DELETE",
                url: `/consultorios/${id}`,
            });

            
            expect(respuesta.statusCode).toBe(200);
        }

        // Verificar que todos fueron eliminados
        for (const id of consultoriosIds) {
            const { data } = await supabase
                .from("consultorios")
                .select("*")
                .eq("id_consultorio", id)
                .single();

            expect(data).toBeNull();
        }
    });

    test("Debe validar el formato del ID antes de eliminar", async () => {
        
        const idInvalido = ""; // ID vacío

        
        const respuesta = await app.inject({
            method: "DELETE",
            url: `/consultorios/${idInvalido}`,
        });

        
        expect(respuesta.statusCode).toBe(400);
    });
});
