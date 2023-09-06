import { Component } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: './usuario.listar.component.html',
  styleUrls: ['./usuario.listar.component.scss']
})
export class UsuarioListarComponent {
  title = 'listarUsuario';
  usuarios: any[] = [];
  busqueda: any;
  
    constructor(private usuarioService: UsuarioService) { }  

    ngOnInit() {
      this.cargarUsuarios();
    }

    cargarUsuarios() {
      this.usuarioService.listarUsuario().toPromise().then(
        (data: any) => {
          this.usuarios = data; // Asigna la respuesta del servicio al arreglo de áreas
          console.log('Usuarios cargados:', this.usuarios);
        },
        (error) => {
          console.error(error);
        }
      );
    }
}