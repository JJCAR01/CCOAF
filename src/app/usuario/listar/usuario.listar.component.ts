import { Component,OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { CargoService } from 'src/app/cargo/services/cargo.service';

@Component({
  selector: 'app-root',
  templateUrl: './usuario.listar.component.html',
  styleUrls: ['./usuario.listar.component.scss']
})
export class UsuarioListarComponent implements OnInit{
  title = 'listarUsuario';
  usuarios: any[] = [];
  cargos: any[] = [];
  busqueda: any;
  
    constructor(private usuarioService: UsuarioService, 
      private auth:AuthService,
      private cargoService:CargoService

      ) { }  

    ngOnInit() {
      this.cargarCargos();
      this.cargarUsuarios();
    }

    cargarCargos() {
      this.cargoService.listar(this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.cargos = data;
          console.log(this.usuarios)
      },
        (error) => {
          console.log(error);
        }
      );
    }
  

    cargarUsuarios() {
      this.usuarioService.listarUsuario(this.auth.obtenerHeader()).toPromise().then(
        (data: any) => {
          this.usuarios = data;
        },
        (error) => {
          Swal.fire('Error', error.error.mensajeTecnico, 'error');
        }
      );
    }

    eliminarUsuario(idUsuario: number) {
      const usuarioAEliminar = this.usuarios.find(usuario => usuario.idUsuario === idUsuario);

      Swal.fire(
        {
          icon:"question",
          title: "¿Estás seguro?",
          text: "Una vez eliminado el usuario, no podrás recuperar este elemento.",
          showCancelButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Confirmar",
          confirmButtonColor: '#0E823F',
          reverseButtons: true, 
        }
      )
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
        this.usuarioService.eliminarUsuario(idUsuario, this.auth.obtenerHeader()).subscribe(
          (response) => {
            Swal.fire({
              title:'Eliminado!',
              text: "El usuario se ha eliminado.",
              icon: "success",
              confirmButtonColor: '#0E823F'
            }).then(() => {
            });
          },
          (error) => {
            Swal.fire({
              title:'Solicitud no válida!',
              text: error.error.mensajeHumano,
              icon: "error",
            });
          }
        );
      }
    });
  }

  obtenerNombreCargo(idCargo: number) {
    const ncargo = this.cargos.find((u) => u.idCargo === idCargo);
    return ncargo ? ncargo.nombre : '';
  }
}