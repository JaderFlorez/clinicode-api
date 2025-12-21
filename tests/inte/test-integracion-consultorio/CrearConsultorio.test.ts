import Fastify, { FastifyInstance } from "fastify";
import { consultorioEnrutador } from "../../../src/presentacion/rutas/consultorioEnrutador";
import { supabase } from "../../../src/core/infraestructura/cliente-db/clienteSupabase";

describe("TEST INTEGRACIÓN - Crear Consultorio", () => {
    let app: FastifyInstance;
    let idConsultorioCreado: string;

    const datosConsultorio = {
        nombre: "Consultorio Test 101",
        ubicacion: "Edificio de Pruebas, Piso 1",
        disponible: true,
    };

    beforeAll(async () => {
        app = Fastify();
        await app.register(consultorioEnrutador);
        await app.ready();
    });

    afterAll(async () => {
        // Limpiar datos de prueba
        if (idConsultorioCreado) {
            await supabase
                .from("consultorios")
                .delete()
                .eq("id_consultorio", idConsultorioCreado);
        }
        await app.close();
    });

    test("Debe crear un consultorio correctamente y guardarlo en la BD", async () => {
        
        const respuesta = await app.inject({
            method: "POST",
            url: "/consultorios",
            payload: datosConsultorio,
        });

        const body = JSON.parse(respuesta.body);

        
        expect(respuesta.statusCode).toBe(201);
        expect(body.mensaje).toBe("Consultorio creado correctamente");

        // Verificar en la BD que realmente se creó
        const { data: consultorioBD, error } = await supabase
            .from("consultorios")
            .select("*")
            .eq("nombre", datosConsultorio.nombre)
            .single();

        expect(error).toBeNull();
        expect(consultorioBD).not.toBeNull();
        expect(consultorioBD.nombre).toBe(datosConsultorio.nombre);
        expect(consultorioBD.ubicacion).toBe(datosConsultorio.ubicacion);
        expect(consultorioBD.disponible).toBe(datosConsultorio.disponible);

        // Guardar ID para limpieza
        idConsultorioCreado = consultorioBD.id_consultorio;
    });

    test("Debe fallar al crear consultorio sin nombre", async () => {
        
        const datosInvalidos = {
            ubicacion: "Sin nombre",
            disponible: true,
        };

        const respuesta = await app.inject({
            method: "POST",
            url: "/consultorios",
            payload: datosInvalidos,
        });

        const body = JSON.parse(respuesta.body);

        
        expect(respuesta.statusCode).toBe(400);
        expect(body.error).toBe("Datos de entrada inválidos");
        expect(body.detalles).toBeDefined();
    });

    test("Debe fallar al crear consultorio con nombre muy corto", async () => {
        
        const datosInvalidos = {
            nombre: "AB", // Menos de 3 caracteres
            ubicacion: "Ubicación válida",
            disponible: true,
        };

        
        const respuesta = await app.inject({
            method: "POST",
            url: "/consultorios",
            payload: datosInvalidos,
        });

        const body = JSON.parse(respuesta.body);

        
        expect(respuesta.statusCode).toBe(400);
        expect(body.error).toBe("Datos de entrada inválidos");
        expect(body.detalles).toBeDefined();
        expect(body.detalles[0].campo).toBe("nombre");
    });

    test("Debe fallar al crear consultorio sin ubicación", async () => {
        
        const datosInvalidos = {
            nombre: "Consultorio Sin Ubicación",
            disponible: true,
        };

        
        const respuesta = await app.inject({
            method: "POST",
            url: "/consultorios",
            payload: datosInvalidos,
        });

        const body = JSON.parse(respuesta.body);

        
        expect(respuesta.statusCode).toBe(400);
        expect(body.error).toBe("Datos de entrada inválidos");
    });

    test("Debe crear consultorio con disponible=true por defecto", async () => {
        
        const datosConsultorioSinDisponible = {
            nombre: "Consultorio Default Test",
            ubicacion: "Ubicación Default Test",
        };

        
        const respuesta = await app.inject({
            method: "POST",
            url: "/consultorios",
            payload: datosConsultorioSinDisponible,
        });

        
        expect(respuesta.statusCode).toBe(201);

        // Verificar en la BD
        const { data: consultorioBD } = await supabase
            .from("consultorios")
            .select("*")
            .eq("nombre", datosConsultorioSinDisponible.nombre)
            .single();

        expect(consultorioBD.disponible).toBe(true);

        // Limpiar
        await supabase
            .from("consultorios")
            .delete()
            .eq("id_consultorio", consultorioBD.id_consultorio);
    });
});
