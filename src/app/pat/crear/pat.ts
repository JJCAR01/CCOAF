import { EDireccion } from "src/app/area/edireccion";
import { EProceso } from "../listar/eproceso";

export class Pat {
    nombre!:string;
    fechaAnual!:number;
    direccion!:EDireccion;
    proceso!:EProceso;
    idUsuario!:number;
}