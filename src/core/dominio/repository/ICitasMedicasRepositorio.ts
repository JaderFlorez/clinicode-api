import { ActualizarCitaMedicaDTO } from "../../infraestructura/esquemas/CitaMedicaEsquemas/ActualizarCitaMedicaEsquema";
import { CrearCitaMedicaDTO } from "../../infraestructura/esquemas/CitaMedicaEsquemas/CrearCitaMedicaEsquema";
import { ICitasMedicas } from "../entidades/CitasMedicas/ICitasMedicas";

export interface ICitasMedicasRepositorio {
    crearCitaMedica(citaMedica: ICitasMedicas): Promise<ICitasMedicas>;
    obtenerCitasMedicas(): Promise<ICitasMedicas[]>;
    obtenerCitaMedicaPorID(idCita: string): Promise<ICitasMedicas | null>;
    actualizarCitaMedica(idCita: string, datosCita: ICitasMedicas): Promise<ICitasMedicas | null>;
    eliminarCitaMedica(idCita: string): Promise<boolean>;
    validarConflictosDeAgenda(cita: ICitasMedicas): Promise<string | null>;
}