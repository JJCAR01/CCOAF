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
    meta: number;
    resultado: string;
    idUsuario: number;
    idPat: number;
}