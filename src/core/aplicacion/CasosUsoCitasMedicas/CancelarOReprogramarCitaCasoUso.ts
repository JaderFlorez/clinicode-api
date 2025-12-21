import { ICitasMedicasRepositorio } from "../../dominio/repository/ICitasMedicasRepositorio";
import { IConsultorioRepositorio } from "../../dominio/repository/IConsultorioRepositorio";
import { DatosReprogramacion } from "../../dominio/entidades/CitasMedicas/ICitasMedicas";

export class CancelarOReprogramarCitaCasoUso {
    constructor(
        private citasRepositorio: ICitasMedicasRepositorio,
        private consultorioRepositorio: IConsultorioRepositorio
    ) { }

    async ejecutar(
        id_cita: string,
        accion: "cancelar" | "reprogramar",
        datosReprogramacion?: DatosReprogramacion
    ) {
        // Verificar que la cita exista
        const citaExistente = await this.citasRepositorio.obtenerCitaMedicaPorID(id_cita);
        if (!citaExistente) {
            throw new Error("La cita indicada no existe.");
        }

        if (accion === "cancelar") {
            citaExistente.estado = "Cancelada";
            citaExistente.actualizadaEn = new Date().toISOString();

            await this.citasRepositorio.actualizarCitaMedica(id_cita, {
                ...citaExistente,
                fecha_cita: citaExistente.fecha_cita,
                actualizadaEn: new Date().toISOString(),
            });

            await this.consultorioRepositorio.actualizar(citaExistente.id_consultorio, {
                disponible: true,
            });

            return {
                mensaje: "Cita cancelada exitosamente.",
                citaActualizada: citaExistente,
            };
        }

        if (accion === "reprogramar") {
            if (!datosReprogramacion?.fecha_cita) {
                throw new Error("Debes indicar la nueva fecha y hora para reprogramar.");
            }

            //Validar que la nueva fecha sea futura
            const nuevaFechaISO = datosReprogramacion.fecha_cita;
            const nuevaFecha = new Date(nuevaFechaISO);

            if (isNaN(nuevaFecha.getTime())) {
                throw new Error("Fecha inválida.");
            }

            if (nuevaFecha <= new Date()) {
                throw new Error("No se puede reprogramar a una fecha pasada o actual.");
            }

            //VALIDAR que el nuevo consultorio existe (si se proporciona)
            const nuevoConsultorioId = datosReprogramacion.id_consultorio ?? citaExistente.id_consultorio;
            if (datosReprogramacion.id_consultorio) {
                const consultorioValido = await this.consultorioRepositorio.obtenerConsultorioPorID(nuevoConsultorioId);
                if (!consultorioValido) {
                    throw new Error(`El consultorio con ID ${nuevoConsultorioId} no existe.`);
                }
            }

            //Obtener todas las citas existentes
            const todasCitas = await this.citasRepositorio.obtenerCitasMedicas();

            // normalizar nueva fecha
            let fechaEntrada = datosReprogramacion!.fecha_cita!;

            const nuevaMs = nuevaFecha.getTime();

            const conflicto = todasCitas.find((c) => {
                if (c.id_cita === id_cita) return false;

                if (c.estado !== "Programada") return false;

                const existenteMs = new Date(c.fecha_cita).getTime();
                if (isNaN(existenteMs)) return false;

                return (
                    existenteMs === nuevaMs &&
                    c.id_consultorio === nuevoConsultorioId
                );
            });

            if (conflicto) {
                throw new Error(`Conflicto detectado: el horario ya está ocupado por otra cita (${conflicto.id_cita}).`);
            }

            // Liberar consultorio anterior
            await this.consultorioRepositorio.actualizar(
                citaExistente.id_consultorio,
                { disponible: true }
            );

            // Marcar nuevo consultorio como ocupado
            await this.consultorioRepositorio.actualizar(
                nuevoConsultorioId,
                { disponible: false }
            );

            // Actualizar los datos de la cita
            citaExistente.fecha_cita = nuevaFecha.toISOString();
            citaExistente.id_consultorio = nuevoConsultorioId;
            citaExistente.estado = "Programada";
            citaExistente.actualizadaEn = new Date().toISOString();

            const citaActualizada = await this.citasRepositorio.actualizarCitaMedica(id_cita, citaExistente);

            return {
                mensaje: "Cita reprogramada exitosamente.",
                citaActualizada,
            };
        }


        throw new Error("Acción no válida. Solo se permite 'cancelar' o 'reprogramar'.");
    }
}
