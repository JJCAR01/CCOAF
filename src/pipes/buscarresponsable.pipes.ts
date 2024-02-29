import { Injectable, Pipe, PipeTransform } from "@angular/core";
@Pipe({
    name: "buscarResponsable"
})
@Injectable()
export class BuscarResponsablePipe implements PipeTransform {
    transform(items: any, term: any): any {
        if (term === undefined) {
            return items;
        }
        return items.filter(function (item: any) {
            return item.idUsuario.toLowerCase().includes(term.toLowerCase());
        })
    }
}
