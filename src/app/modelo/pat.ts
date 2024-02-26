import { Direccion } from "./direccion";

export interface Pat {
    idPat: number;
    nombre: string;
    fechaAnual: number;
    porcentajeReal: number;
    porcentajeEsperado: number;
    porcentajeCumplimiento: number;
    direccion: Direccion;
    idUsuario: number;
  }
  