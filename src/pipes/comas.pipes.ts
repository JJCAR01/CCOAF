// join-with-commas.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ComasPipe',
})
export class ComasPipe implements PipeTransform {
    transform(value: string[]): string {
      return value.join(', ');
    }
  }
