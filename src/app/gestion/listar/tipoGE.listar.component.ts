import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/login/auth/auth.service';
import swal from 'sweetalert';
import { TipoGEService } from '../services/tipoGE.service';
import { PatService } from 'src/app/pat/services/pat.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';


@Component({
  selector: 'app-root:not(p)',
  templateUrl: './tipoGE.listar.component.html',
  styleUrls: ['./tipoGE.listar.component.scss']
})
export class TipogeListarComponent implements OnInit {
  title = 'listarTipoGE';
  gestiones: any[] = [];
  actividades: any[] = [];
  pats: any[] = [];
  usuarios:any[] =[];
  patNombre:any;
  idPat:any;
  busqueda: any;

  constructor(
    private gestionService: TipoGEService,
    private auth: AuthService,
    private patService: PatService,
    private route: ActivatedRoute,
    private usuarioService :UsuarioService
  ) {}

  ngOnInit() {
    // Obtén el valor de idPat de la URL
    this.route.params.subscribe(params => {
      const idPat = params['idPat'];
      this.patService.listarPatPorId(idPat,this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.patNombre = data.nombre;
          this.idPat = data.idPat // Asignar el nombre del Pat a patNombre
        },
        (error) => {
          // Manejo de errores
        }
      );

      this.cargarGestiones(idPat);
      this.cargarActividadesEstrategicas(idPat);
    });
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

  cargarActividadesEstrategicas(idPat: number) {
    // Utiliza idPat en tu solicitud para cargar las epicas relacionadas
    this.gestionService
      .listarActividadEstrategicaPorIdPat(idPat, this.auth.obtenerHeader()) // Debes tener un método en tu servicio para listar epicas por idPat
      .toPromise()
      .then(
        (data: any) => {
          this.actividades = data;
        },
        (error) => {
          swal(error.error.mensajeTecnico);
        }
      );
  }

  eliminarGestion(idActividadGestion: number) {
    const gestionAEliminar = this.gestiones.find(gest => gest.idActividadGestion === idActividadGestion);

      swal({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar este elemento.",
        icon: "warning",
        buttons: ["Cancelar", "Eliminar"],
        dangerMode: true,
      })
      .then((confirmacion) => {
      if (confirmacion) {
        this.gestionService.eliminarGestion(idActividadGestion, this.auth.obtenerHeader()).subscribe(
          (response) => {
            swal("Eliminado Satisfactoriamente", "La gestión del área " + gestionAEliminar.nombre + " se ha eliminado.", "success").then(() => {
              window.location.reload();
            });
            console.log(response);
          },
          (error) => {
            swal("Solicitud no válida", error.error.mensajeHumano, "error");
          }
        );
      }
      });
  }
  eliminarActividadesEstrategica(idActividadEstrategica: number) {
    const actividadAEliminar = this.actividades.find(a => a.idActividadEstrategica === idActividadEstrategica);

      swal({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar este elemento.",
        icon: "warning",
        buttons: ["Cancelar", "Eliminar"],
        dangerMode: true,
      })
      .then((confirmacion) => {
      if (confirmacion) {
        this.gestionService.eliminarActividadEstrategica(idActividadEstrategica, this.auth.obtenerHeader()).subscribe(
          (response) => {
            swal("Eliminado Satisfactoriamente", "La epica con el nombre " + actividadAEliminar.nombre + " se ha eliminado.", "success").then(() => {
              window.location.reload();
            });
            console.log(response);
          },
          (error) => {
            swal("Solicitud no válida", error.error.mensajeHumano, "error");
          }
        );
      }
      });
  }

  obtenerNombreUsuario(idUsuario: number) {
    const usuario = this.usuarios.find((u) => u.idUsuario === idUsuario);
    return usuario ? usuario.nombre + " " + usuario.apellidos : '';
  }
  

}
