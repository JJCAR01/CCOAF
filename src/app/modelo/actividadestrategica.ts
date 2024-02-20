import { EPeriodicidadMeta } from "src/enums/eperiodicidadmeta";
import { EUnidad } from "src/enums/eunidad";


export interface ActividadEstrategica {
    idActividadEstrategica : number;
    nombre : string;
    fechaInicial : Date;
    fechaFinal : Date;
    fechaRegistro: Date;
    duracion : number;
    diasRestantes :number;
    porcentajeReal : number;
    porcentajeEsperado :number;
    porcentajeCumplimiento: number;
    porcentajePat: number;
    unidad: EUnidad;
    meta: number;
    periodicidadMeta: EPeriodicidadMeta;
    resultadoMeta: number;
    promedioMeta: number;
    entregable: string;
    idUsuario: number;
    idPat: number;
}