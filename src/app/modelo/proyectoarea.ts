import { EModalidad } from "src/enums/emodalidad";
import { EPlaneacion } from "src/enums/eplaneacion";

export interface ProyectoArea {
    idProyectoArea : number;
    nombre : string;
    presupuesto: number;
    modalidad: EModalidad;
    valorEjecutado: number;
    fechaInicial : Date;
    fechaFinal : Date;
    fechaRegistro: Date;
    duracion : number;
    porcentajeReal : number;
    porcentajeEsperado :number;
    porcentajeCumplimiento: number;
    totalSprint: number;
    planeacionSprint: EPlaneacion;
    idUsuario: number;
    idPat: number;
}
