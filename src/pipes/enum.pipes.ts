import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatEnum',
})
export class EnumPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace('_', ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
