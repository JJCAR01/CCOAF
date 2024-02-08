export interface ActividadGestion {
    idActividadGestion : number;
    nombre : string;
    fechaInicial : Date;
    fechaFinal : Date;
    fechaRegistro: Date;
    duracion : number;
    diasRestantes :number;
    porcentajeReal : number;
    porcentajeEsperado :number;
    porcentajeCumplimiento: number;
    idUsuario: number;
    idPat: number;
}