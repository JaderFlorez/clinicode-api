export interface IRespuestaHttp<T = unknown> {
    mensaje: string;
    datos: T | null;
}


// Respuesta exitosa (200)
export const respuestaExitosa = <T>(
    datos: T | null,
    mensaje = "Operación exitosa",
): IRespuestaHttp<T> => ({
    mensaje,
    datos,
});

// Respuesta de creación (201)
export const respuestaCreacion = <T>(
    datos: T | null,
    mensaje = "Recurso creado correctamente"
): IRespuestaHttp<T> => ({
    mensaje,
    datos,
});

// Respuesta para errores controlados o no controlados
export const respuestaError = (mensaje: string): IRespuestaHttp<null> => ({
    mensaje,
    datos: null,
});
