import Fastify, { FastifyInstance } from "fastify";
import { consultorioEnrutador } from "../../../src/presentacion/rutas/consultorioEnrutador";
import { supabase } from "../../../src/core/infraestructura/cliente-db/clienteSupabase";

describe("TEST INTEGRACIÓN - Listar Consultorios", () => {
    let app: FastifyInstance;
    const idsConsultoriosCreados: string[] = [];

    beforeAll(async () => {
        app = Fastify();
        await app.register(consultorioEnrutador);
        await app.ready();

        // Crear consultorios de prueba
        const consultoriosTest = [
            {
                nombre: "Test Consultorio 1",
                ubicacion: "Test Ubicación 1",
                disponible: true,
            },
            {
                nombre: "Test Consultorio 2",
                ubicacion: "Test Ubicación 2",
                disponible: false,
            },
            {
                nombre: "Test Consultorio 3",
                ubicacion: "Test Ubicación 3",
                disponible: true,
            },
        ];

        for (const consultorio of consultoriosTest) {
            const { data, error } = await supabase
                .from("consultorios")
                .insert([consultorio])
                .select()
                .single();

            if (!error && data) {
                idsConsultoriosCreados.push(data.id_consultorio);
            }
        }
    });

    afterAll(async () => {
        // Limpiar consultorios de prueba
        for (const id of idsConsultoriosCreados) {
            await supabase.from("consultorios").delete().eq("id_consultorio", id);
        }
        await app.close();
    });

    test("Debe listar todos los consultorios correctamente", async () => {
        
        const respuesta = await app.inject({
            method: "GET",
            url: "/consultorios",
        });

        const body = JSON.parse(respuesta.body);

        
        expect(respuesta.statusCode).toBe(200);
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThanOrEqual(3); // Al menos los 3 que creamos

        // Verificar estructura de cada consultorio
        body.forEach((consultorio: any) => {
            expect(consultorio).toHaveProperty("id_consultorio");
            expect(consultorio).toHaveProperty("nombre");
            expect(consultorio).toHaveProperty("ubicacion");
            expect(consultorio).toHaveProperty("disponible");
        });
    });

    test("Debe incluir los consultorios de prueba creados", async () => {
        
        const respuesta = await app.inject({
            method: "GET",
            url: "/consultorios",
        });

        const body = JSON.parse(respuesta.body);

        
        const nombresConsultorios = body.map((c: any) => c.nombre);
        expect(nombresConsultorios).toContain("Test Consultorio 1");
        expect(nombresConsultorios).toContain("Test Consultorio 2");
        expect(nombresConsultorios).toContain("Test Consultorio 3");
    });

    test("Debe retornar consultorios con diferentes estados de disponibilidad", async () => {
        
        const respuesta = await app.inject({
            method: "GET",
            url: "/consultorios",
        });

        const body = JSON.parse(respuesta.body);

        
        const hayDisponibles = body.some((c: any) => c.disponible === true);
        const hayNoDisponibles = body.some((c: any) => c.disponible === false);

        expect(hayDisponibles).toBe(true);
        expect(hayNoDisponibles).toBe(true);
    });
});
