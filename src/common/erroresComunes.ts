export interface IErroresComunes<T = unknown> {
    mensaje: string;
    detalles: string | null;
}

// Errores comunes
export const noEncontrado = (detalle = "No encontrado"): IErroresComunes<null> => ({
    mensaje: "Recurso no encontrado.",
    detalles: detalle,
});

export const solicitudInvalida = (detalle = "Solicitud inválida"): IErroresComunes<null> => ({
    mensaje: "Solicitud inválida.",
    detalles: detalle,
});

export const conflicto = (detalle = "Conflicto de datos"): IErroresComunes<null> => ({
    mensaje: "Conflicto de datos.",
    detalles: detalle,
});

export const errorServidor = (detalle = "Error en el servidor."): IErroresComunes<null> => ({
    mensaje: "Error interno del servidor.",
    detalles: detalle,
});