import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/login/auth/auth.service';
import swal from 'sweetalert';
import { TipoGEService } from '../services/tipoGE.service';
import { PatService } from 'src/app/pat/services/pat.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root:not(p)',
  templateUrl: './tipoGE.listar.component.html',
  styleUrls: ['./tipoGE.listar.component.scss']
})
export class TipogeListarComponent implements OnInit {
  title = 'listarTipoGE';
  gestiones: any[] = [];
  epicas:any[] = [];
  pats:any[]=[];
  idPat:any;
  busqueda: any;

  constructor(
    private gestionService: TipoGEService,
    private auth: AuthService,private patService:PatService, private route:ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.cargarGestiones();
      this.cargarPats();
      this.cargarEpicas();
      this.route.params.subscribe(params => {
        this.idPat = params['idPat'];
  
        // Obtener las gestiones relacionadas con el idPat
        this.gestionService.listarGestionPorId(this.idPat,this.auth.obtenerHeader()).toPromise().then(
          (data: any) => {
            this.gestiones = data;
          });
  
        // Obtener las épicas relacionadas con el idPat
        this.gestionService.listarEpicaPorId(this.idPat,this.auth.obtenerHeader()).toPromise().then(
          (data: any) => {
            this.epicas = data;
          });
      });
    }
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

  cargarGestiones() {
    this.gestionService
      .listarGestion(this.auth.obtenerHeader()) // Pasa las cabeceras con el token JWT en la solicitud
      .toPromise()
      .then(
        (data: any) => {
          this.gestiones = data; 
        },
        (error) => {
          swal(error.error.mensajeTecnico)
        }
      );
  }
  cargarEpicas() {
    this.gestionService
      .listarEpica(this.auth.obtenerHeader()) // Pasa las cabeceras con el token JWT en la solicitud
      .toPromise()
      .then(
        (data: any) => {
          this.epicas = data; 
        },
        (error) => {
          swal(error.error.mensajeTecnico)
        }
      );
  }
  
  eliminarGestion(idGestion: number) {
    const gestionEliminar = this.gestiones.find(gestion => gestion.idGestion === idGestion);
    this.gestionService.eliminarGestion(idGestion,this.auth.obtenerHeader()).subscribe(
      (response) => {
        swal("Eliminado Satisfactoriamente", "La gestión con el nombre " + gestionEliminar.nombre + ", se ha eliminado!", "success").then(() => {
          window.location.reload();
        });
        console.log(response);
      },
      (error) => {
        swal(error.error.mensajeTecnico,"error");
      }
    );
  }


}
