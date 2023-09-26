import { Component } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from 'src/app/login/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './usuario.listar.component.html',
  styleUrls: ['./usuario.listar.component.scss']
})
export class UsuarioListarComponent {
  title = 'listarUsuario';
  usuarios: any[] = [];
  busqueda: any;
  
    constructor(private usuarioService: UsuarioService, private auth:AuthService) { }  

    ngOnInit() {
      this.cargarUsuarios();
    }

    cargarUsuarios() {
      this.usuarioService.listarUsuario(this.auth.obtenerHeader()).toPromise().then(
        (data: any) => {
          this.usuarios = data; // Asigna la respuesta del servicio al arreglo de áreas
        },
        (error) => {
          console.error(error);
        }
      );
    }

    eliminarUsuario(idUsuario: number) {
      this.usuarioService.eliminarUsuario(idUsuario, this.auth.obtenerHeader()).subscribe(
        (response) => {
          // Realizar acciones después de eliminar el usuario, si es necesario
          console.log('Usuario eliminado con éxito', response);
        },
        (error) => {
          // Manejar errores, si es necesario
          console.error('Error al eliminar el usuario', error);
        }
      );
    }
}