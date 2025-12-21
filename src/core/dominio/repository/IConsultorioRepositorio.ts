import { Consultorio } from "../entidades/consultorios/IConsultorio";
import { ActualizarConsultorioDTO } from "../../infraestructura/esquemas/ConsultorioEsquema";


export interface IConsultorioRepositorio {
    crear(consultorio: Consultorio): Promise<void>;
    listar(): Promise<Consultorio[]>;
    obtenerPorId(idConsultorio: string): Promise<Consultorio | null>;
    actualizar(id_consultorio: string, datos: ActualizarConsultorioDTO): Promise<Consultorio>;
    eliminar(id_consultorio: string): Promise<boolean>;
    actualizarDisponibilidad(id_onsultorio: string, disponible: boolean): Promise<void>;
    obtenerConsultorioPorID(id: string): Promise<Consultorio | null>;
}
