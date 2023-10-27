import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colorPorcentaje',
})
export class ColorPorcentajePipe implements PipeTransform {
  transform(value: number): string {
    if (value < 30) {
      return 'red-text'; // Clase CSS para color rojo
    } else if (value >= 30 && value < 100) {
      return 'orange-text'; // Clase CSS para color naranja
    } else if (value === 100) {
      return 'green-text'; // Clase CSS para color verde
    } else {
      return ''; // Clase vacía si no se cumple ninguna condición
    }
  }
}
