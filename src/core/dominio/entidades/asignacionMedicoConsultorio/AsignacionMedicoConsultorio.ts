import { IAsignacionMedicoConsultorio } from "./IAsignacionMedicoConsultorio";

export class AsignacionMedicoConsultorio implements IAsignacionMedicoConsultorio{
    idMedico: string;
    idConsultorio: string;
    diasDisponibles: string[];
    horaInicio: string;
    horaFin: string;
    constructor(datosAsignacion: IAsignacionMedicoConsultorio){
        this.idMedico = datosAsignacion.idMedico;
        this.idConsultorio = datosAsignacion.idConsultorio;
        this.diasDisponibles = datosAsignacion.diasDisponibles;
        this.horaInicio = datosAsignacion.horaInicio;
        this.horaFin = datosAsignacion.horaFin;
    }
};