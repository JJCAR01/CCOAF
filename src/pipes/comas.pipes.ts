import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'comasPipe'
})
export class ComasPipe implements PipeTransform {
  transform(value: number): string {
    // Verificamos si el valor es un número
    if (isNaN(value)) {
      return '';
    }

    // Formateamos el número con coma como separador decimal
    return value.toFixed(2).replace('.', ',');
  }
}