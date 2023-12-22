import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatEnum',
})
export class EnumPipe implements PipeTransform {
  transform(value: string | string[]): string | string[] {
    if (!value) {
      return value;
    }

    if (typeof value === 'string') {
      return this.formatSingleEnum(value);
    } else if (Array.isArray(value)) {
      return value.map(item => this.formatSingleEnum(item));
    }

    return value;
  }

  private formatSingleEnum(value: string): string {
    // Normalizar para manejar tildes
    const normalizedValue = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Reemplazar guiones bajos con espacios y convertir a formato título
    const formattedValue = normalizedValue.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

    // Mantener la primera letra en minúscula si originalmente era minúscula
    return value.charAt(0).toUpperCase() + formattedValue.slice(1).toLowerCase();
  }
}
