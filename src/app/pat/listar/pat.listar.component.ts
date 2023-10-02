import { Component } from '@angular/core';
import { PatService } from '../services/pat.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import swal from 'sweetalert';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: './pat.listar.component.html',
  styleUrls: ['./pat.listar.component.scss']
})
export class PatListarComponent {
  title = 'listarPat';
  pats: any[] = [];
  usuarios:any[] =[];
  busqueda: any;
  mostrarDetalle: { [idPat: number]: boolean } = {};
  
    constructor(private patService: PatService,private auth:AuthService,private usuarioService:UsuarioService) { }  

    ngOnInit() {
      this.cargarPats();
      this.cargarUsuario();
    }

    cargarUsuario() {
      this.usuarioService.listarUsuario(this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.usuarios = data;
      },
        (error) => {
          console.log(error);
        }
      );
    }


    cargarPats() {
      this.patService.listarPat(this.auth.obtenerHeader()).toPromise().then(
        (data: any) => {
          this.pats = data;
        },
        (error) => {
          swal(error.error.mensajeTecnico);
        }
      );
    }
    eliminarPat(idPat: number) {
      const patAEliminar = this.pats.find(pat => pat.idPat === idPat);
      this.patService.eliminarPat(idPat,this.auth.obtenerHeader()).subscribe(
        (response) => {
          swal("Eliminado Satisfactoriamente", "El usuario con el nombre " + patAEliminar.nombre + ", se ha eliminado!", "success").then(() => {
            window.location.reload();
          });
          console.log(response); 
        },
        (error) => {
          swal("Solicitud no válida",error.error.mensajeHumano,"error");
        }
      );
    }

    verDetalle(idPat: number) {
      this.mostrarDetalle[idPat] = !this.mostrarDetalle[idPat];
    }

    obtenerNombreUsuario(idUsuario: number) {
      const usuario = this.usuarios.find((u) => u.idUsuario === idUsuario);
      return usuario ? usuario.nombre + " " + usuario.apellidos : '';
    }
    
}