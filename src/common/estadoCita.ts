export const EstadosCita = {
    ATENDIDA: "Atendida",
    PROGRAMADA: "Programada",
    CANCELADA: "Cancelada",
    REPROGRAMADA: "Reprogramada",
} as const;

export type EstadoCita = typeof EstadosCita[keyof typeof EstadosCita];
