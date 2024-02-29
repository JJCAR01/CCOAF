import { Injectable, Pipe, PipeTransform } from "@angular/core";
@Pipe({
    name: "buscarDireccion"
})
@Injectable()
export class BuscarDireccionPipe implements PipeTransform {
    transform(items: any, term: any): any {
        if (term === undefined) {
            return items;
        }
        return items.filter(function (item: any) {
            return item.direccion.nombre.toLowerCase().includes(term.toLowerCase());
        })
    }
}