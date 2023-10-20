import { Component,OnInit } from '@angular/core';
import { ActividadService } from '../services/actividad.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { TipoGEService } from 'src/app/gestion/services/tipoGE.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-listar',
  templateUrl: './actividad.listar.component.html',
  styleUrls: ['./actividad.listar.component.scss']
})
export class ActividadListarComponent implements OnInit{
  title = 'listarActividad';
  gestiones: any[] = [];
  proyectos: any[] = [];
  actividades: any[] = [];
  usuarios:any[] =[];
  actividadNombre:any;
  idActividadEstrategica:any;
  busqueda: any;

  constructor(
    private actividadService: ActividadService,
    private auth: AuthService,
    private tipoService: TipoGEService,
    private route: ActivatedRoute,
    private usuarioService :UsuarioService,
  ) {}

  ngOnInit() {
    // Obtén el valor de idPat de la URL
    this.route.params.subscribe(params => {
      const idActividadEstrategica = params['idActividadEstrategica'];
      this.tipoService.listarActividadEstrategicaPorId(idActividadEstrategica,this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.actividadNombre = data.nombre;
          this.idActividadEstrategica = data.idActividadEstrategica 
        },
      );

      this.cargarGestiones(idActividadEstrategica);
      this.cargarProyectos(idActividadEstrategica);
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

  cargarGestiones(idActividadEstrategica: number) {
    // Utiliza idPat en tu solicitud para cargar las gestiones relacionadas
    this.actividadService
      .listarActividadGestionActividadEstrategicaPorIdActividadEstrategica(idActividadEstrategica, this.auth.obtenerHeader()) // Debes tener un método en tu servicio para listar gestiones por idPat
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

  cargarProyectos(idActividadEstrategica: number) {
    // Utiliza idPat en tu solicitud para cargar las epicas relacionadas
    this.actividadService
      .listarProyectoPorIdActividadEstrategica(idActividadEstrategica, this.auth.obtenerHeader()) // Debes tener un método en tu servicio para listar epicas por idPat
      .toPromise()
      .then(
        (data: any) => {
          this.proyectos = data;
          console.log(this.proyectos)
        },
        (error) => {
          swal(error.error.mensajeTecnico);
        }
      );
  }

  eliminarGestion(idActividadGestionActividadEstrategica: number) {
    const gestionAEliminar = this.gestiones.find(gest => gest.idActividadGestionActividadEstrategica === idActividadGestionActividadEstrategica);

      swal({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar este elemento.",
        icon: "warning",
        buttons: ["Cancelar", "Eliminar"],
        dangerMode: true,
      })
      .then((confirmacion) => {
      if (confirmacion) {
        this.actividadService.eliminarActividadGestionActividadEstrategica(idActividadGestionActividadEstrategica, this.auth.obtenerHeader()).subscribe(
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
  eliminarProyecto(idProyecto: number) {
    const proyectoAEliminar = this.proyectos.find(ep => ep.idProyecto === idProyecto);

      swal({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar este elemento.",
        icon: "warning",
        buttons: ["Cancelar", "Eliminar"],
        dangerMode: true,
      })
      .then((confirmacion) => {
      if (confirmacion) {
        this.actividadService.eliminarProyecto(idProyecto, this.auth.obtenerHeader()).subscribe(
          (response) => {
            swal("Eliminado Satisfactoriamente", "El proyecto con el nombre " + proyectoAEliminar.nombre + " se ha eliminado.", "success").then(() => {
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
