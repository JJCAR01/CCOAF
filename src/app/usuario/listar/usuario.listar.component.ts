import { Component } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import swal from 'sweetalert';

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
          swal(error.error.mensajeTecnico);
        }
      );
    }

    eliminarUsuario(idUsuario: number) {
      const usuarioAEliminar = this.usuarios.find(usuario => usuario.idUsuario === idUsuario);
      this.usuarioService.eliminarUsuario(idUsuario, this.auth.obtenerHeader()).subscribe(
        (response) => {
          swal("Eliminado Satisfactoriamente", "El usuario con el nombre " + usuarioAEliminar.nombre + ", se ha eliminado!", "success").then(() => {
            window.location.reload();
          });
          console.log(response);      
        },
        (error) => {
          swal("Solicitud no válida",error.error.mensajeHumano,"error");
        }
      );
    }
}