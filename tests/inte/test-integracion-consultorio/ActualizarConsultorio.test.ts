import Fastify, { FastifyInstance } from "fastify";
import { consultorioEnrutador } from "../../../src/presentacion/rutas/consultorioEnrutador";
import { supabase } from "../../../src/core/infraestructura/cliente-db/clienteSupabase";

describe("TEST INTEGRACIÓN - Actualizar Consultorio", () => {
    let app: FastifyInstance;
    let idConsultorioTest: string;

    beforeAll(async () => {
        app = Fastify();
        await app.register(consultorioEnrutador);
        await app.ready();

        // Crear un consultorio de prueba
        const { data, error } = await supabase
            .from("consultorios")
            .insert([
                {
                    nombre: "Consultorio Original",
                    ubicacion: "Ubicación Original",
                    disponible: true,
                },
            ])
            .select()
            .single();

        if (!error && data) {
            idConsultorioTest = data.id_consultorio;
        }
    });

    afterAll(async () => {
        // Limpiar consultorio de prueba
        if (idConsultorioTest) {
            await supabase
                .from("consultorios")
                .delete()
                .eq("id_consultorio", idConsultorioTest);
        }
        await app.close();
    });

    test("Debe actualizar el nombre del consultorio correctamente", async () => {
        
        const datosActualizacion = {
            nombre: "Consultorio Actualizado",
        };

        
        const respuesta = await app.inject({
            method: "PUT",
            url: `/consultorios/${idConsultorioTest}`,
            payload: datosActualizacion,
        });

        const body = JSON.parse(respuesta.body);

        
        expect(respuesta.statusCode).toBe(200);
        expect(body.mensaje).toBe("Consultorio actualizado correctamente");
        expect(body.data.nombre).toBe("Consultorio Actualizado");

        // Verificar en la BD
        const { data: consultorioBD } = await supabase
            .from("consultorios")
            .select("*")
            .eq("id_consultorio", idConsultorioTest)
            .single();

        expect(consultorioBD.nombre).toBe("Consultorio Actualizado");
        expect(consultorioBD.ubicacion).toBe("Ubicación Original"); 
    });

    test("Debe actualizar la ubicación del consultorio", async () => {
        const datosActualizacion = {
            ubicacion: "Nueva Ubicación Actualizada",
        };

        const respuesta = await app.inject({
            method: "PUT",
            url: `/consultorios/${idConsultorioTest}`,
            payload: datosActualizacion,
        });

        const body = JSON.parse(respuesta.body);

        expect(respuesta.statusCode).toBe(200);
        expect(body.data.ubicacion).toBe("Nueva Ubicación Actualizada");

        // Verificar en la BD
        const { data: consultorioBD } = await supabase
            .from("consultorios")
            .select("*")
            .eq("id_consultorio", idConsultorioTest)
            .single();

        expect(consultorioBD.ubicacion).toBe("Nueva Ubicación Actualizada");
    });

    test("Debe actualizar la disponibilidad del consultorio", async () => {
        const datosActualizacion = {
            disponible: false,
        };

        const respuesta = await app.inject({
            method: "PUT",
            url: `/consultorios/${idConsultorioTest}`,
            payload: datosActualizacion,
        });

        const body = JSON.parse(respuesta.body);

        expect(respuesta.statusCode).toBe(200);
        expect(body.data.disponible).toBe(false);
        const { data: consultorioBD } = await supabase
            .from("consultorios")
            .select("*")
            .eq("id_consultorio", idConsultorioTest)
            .single();

        expect(consultorioBD.disponible).toBe(false);
    });

    test("Debe actualizar múltiples campos a la vez", async () => {
        const datosActualizacion = {
            nombre: "Consultorio Multi-Update",
            ubicacion: "Ubicación Multi-Update",
            disponible: true,
        };

        const respuesta = await app.inject({
            method: "PUT",
            url: `/consultorios/${idConsultorioTest}`,
            payload: datosActualizacion,
        });

        const body = JSON.parse(respuesta.body);

        expect(respuesta.statusCode).toBe(200);
        expect(body.data.nombre).toBe("Consultorio Multi-Update");
        expect(body.data.ubicacion).toBe("Ubicación Multi-Update");
        expect(body.data.disponible).toBe(true);

        // Verificar en la BD
        const { data: consultorioBD } = await supabase
            .from("consultorios")
            .select("*")
            .eq("id_consultorio", idConsultorioTest)
            .single();

        expect(consultorioBD.nombre).toBe("Consultorio Multi-Update");
        expect(consultorioBD.ubicacion).toBe("Ubicación Multi-Update");
        expect(consultorioBD.disponible).toBe(true);
    });

    test("Debe fallar al actualizar sin proporcionar datos", async () => {
        const datosVacios = {};

        const respuesta = await app.inject({
            method: "PUT",
            url: `/consultorios/${idConsultorioTest}`,
            payload: datosVacios,
        });

        const body = JSON.parse(respuesta.body);

        expect(respuesta.statusCode).toBe(400);
        expect(body.error).toBe("Datos de entrada inválidos");
    });

    test("Debe fallar al actualizar con nombre muy corto", async () => {
        const datosInvalidos = {
            nombre: "AB", // Menos de 3 caracteres
        };

        const respuesta = await app.inject({
            method: "PUT",
            url: `/consultorios/${idConsultorioTest}`,
            payload: datosInvalidos,
        });

        const body = JSON.parse(respuesta.body);

        expect(respuesta.statusCode).toBe(400);
        expect(body.error).toBe("Datos de entrada inválidos");
        expect(body.detalles[0].campo).toBe("nombre");
    });

    test("Debe fallar al actualizar consultorio inexistente", async () => {
        
        const idInexistente = "00000000-0000-0000-0000-000000000000";
        const datosActualizacion = {
            nombre: "Consultorio Inexistente",
        };

        
        const respuesta = await app.inject({
            method: "PUT",
            url: `/consultorios/${idInexistente}`,
            payload: datosActualizacion,
        });

        
        expect(respuesta.statusCode).toBe(400);
    });

    test("Debe fallar al actualizar sin proporcionar ID", async () => {
        
        const datosActualizacion = {
            nombre: "Test Nombre",
        };

        
        const respuesta = await app.inject({
            method: "PUT",
            url: `/consultorios/`,
            payload: datosActualizacion,
        });

        expect(respuesta.statusCode).toBe(400);
    });
});
