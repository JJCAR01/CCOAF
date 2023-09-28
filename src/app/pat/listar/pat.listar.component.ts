import { Component } from '@angular/core';
import { PatService } from '../services/pat.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-root',
  templateUrl: './pat.listar.component.html',
  styleUrls: ['./pat.listar.component.scss']
})
export class PatListarComponent {
  title = 'listarPat';
  pats: any[] = [];
  busqueda: any;
  
    constructor(private patService: PatService,private auth:AuthService) { }  

    ngOnInit() {
      this.cargarPats();
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
}