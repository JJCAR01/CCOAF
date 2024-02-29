import { Injectable, Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "buscarFechaAnual"
})
@Injectable()
export class BuscarFechaAnualPipe implements PipeTransform {
    transform(items: any, term: any): any {
        if (term === undefined || term === null || term === "") {
            return items;
        }
        return items.filter(function (item: any) {
            // Convierte el número a una cadena y luego busca el término en esa cadena
            return item.fechaAnual.toString().includes(term.toString());
        });
    }
}
