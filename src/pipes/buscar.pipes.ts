import { Injectable, Pipe, PipeTransform } from "@angular/core";
@Pipe({
    name: "buscar"
})
@Injectable()
export class BuscarPipe implements PipeTransform {
    transform(items: any, term: any): any {
        if (term === undefined) {
            return items;
        }
        return items.filter(function (item: any) {
            return item.nombre.toLowerCase().includes(term.toLowerCase());
        })
    }
}