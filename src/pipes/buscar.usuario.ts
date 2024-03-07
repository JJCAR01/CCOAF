import { Injectable, Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "buscarUsuario"
})
@Injectable()
export class BuscarUsuarioPipe implements PipeTransform {
    transform(items: any, term: any, usuarios: any): any {
        if (term === undefined) {
            return items;
        }
        return items.filter(function (item: any) {
            // Buscar el nombre correspondiente al idUsuario en la tabla de usuarios
            const usuario = usuarios.find((usuario: any) => usuario.id === item.idUsuario);
            return usuario && usuario.nombre.toLowerCase().includes(term.toLowerCase());
        })
    }
}
