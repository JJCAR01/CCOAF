import { Component,OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './usuario.listar.component.html',
  styleUrls: ['./usuario.listar.component.scss']
})
export class UsuarioListarComponent implements OnInit{
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
          Swal.fire('Error',error.error.mensajeTecnico,'error');
        }
      );
    }

    eliminarUsuario(idUsuario: number) {
      const usuarioAEliminar = this.usuarios.find(usuario => usuario.idUsuario === idUsuario);

      Swal.fire({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar este elemento.",
        icon: "question",
        confirmButtonText: "Confirmar",
        confirmButtonColor: "#3085d6",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
      })
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
        this.usuarioService.eliminarUsuario(idUsuario, this.auth.obtenerHeader()).subscribe(
          (response) => {
            Swal.fire("Eliminado!!!", "El cargo se ha eliminado." , "success").then(() => {
              window.location.reload();
            });
          },
          (error) => {
            Swal.fire("Solicitud no válida", error.error.mensajeHumano, "error");
          }
        );
      }
    });
  }
}