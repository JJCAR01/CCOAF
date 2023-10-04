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
  epicas: any[] = [];
  pats: any[] = [];
  patNombre:any;
  busqueda: any;

  constructor(
    private gestionService: TipoGEService,
    private auth: AuthService,
    private patService: PatService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Obtén el valor de idPat de la URL
    this.route.params.subscribe(params => {
      const idPat = params['idPat'];
      this.patService.listarPatPorId(idPat,this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.patNombre = data.nombre; // Asignar el nombre del Pat a patNombre
        },
        (error) => {
          // Manejo de errores
        }
      );

      this.cargarGestiones(idPat);
      this.cargarEpicas(idPat);
    });
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

  cargarGestiones(idPat: number) {
    // Utiliza idPat en tu solicitud para cargar las gestiones relacionadas
    this.gestionService
      .listarGestionPorIdPat(idPat, this.auth.obtenerHeader()) // Debes tener un método en tu servicio para listar gestiones por idPat
      .toPromise()
      .then(
        (data: any) => {
          this.gestiones = data;
        },
        (error) => {
          swal(error.error.mensajeTecnico);
        }
      );
  }

  cargarEpicas(idPat: number) {
    // Utiliza idPat en tu solicitud para cargar las epicas relacionadas
    this.gestionService
      .listarEpicaPorIdPat(idPat, this.auth.obtenerHeader()) // Debes tener un método en tu servicio para listar epicas por idPat
      .toPromise()
      .then(
        (data: any) => {
          this.epicas = data;
        },
        (error) => {
          swal(error.error.mensajeTecnico);
        }
      );
  }

  eliminarGestion(idGestion: number) {
    const gestionEliminar = this.gestiones.find(
      (gestion) => gestion.idGestion === idGestion
    );
    this.gestionService.eliminarGestion(idGestion, this.auth.obtenerHeader()).subscribe(
      (response) => {
        swal(
          "Eliminado Satisfactoriamente",
          "La gestión con el nombre " + gestionEliminar.nombre + ", se ha eliminado!",
          "success"
        ).then(() => {
          window.location.reload();
        });
        console.log(response);
      },
      (error) => {
        swal(error.error.mensajeTecnico, "error");
      }
    );
  }
}
