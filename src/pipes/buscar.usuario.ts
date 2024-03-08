import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscarUsuario'
})
export class BuscarUsuarioPipe implements PipeTransform {
  transform(items: any[], term: string, usuarios: any[]): any[] {
    if (!term || !usuarios) {
      return items;
    }

    return items.filter(item => {
      const usuario = usuarios.find(u => u.idUsuario === item.idUsuario);
      return usuario && usuario.nombre.toLowerCase().includes(term.toLowerCase());
    });
  }
}
