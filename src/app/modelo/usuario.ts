import { Direccion } from "./direccion";
import { Proceso } from "./proceso";
import { UsuarioRol } from "./usuarioRol";

export interface Usuario {
    idUsuario: number;
    nombre: string;
    apellidos: string;
    correo: string;
    password: string;
    idCargo:number;
    direcciones:Direccion;
    procesos:Proceso;
    roles: UsuarioRol;
}
  