import { Direccion } from "./direccion";
import { Proceso } from "./proceso";
import { Usuario } from "./usuario";

export interface Pat {
    nombre: string;
    fechaAnual: number;
    porcentajeReal: number;
    porcentajeEsperado: number;
    porcentajeCumplimiento: number;
    proceso: Proceso;
    direccion: Direccion;
    idUsuario: Usuario;
  }
  