import { Component } from '@angular/core';
import { ProyectoService } from '../../services/proyecto.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { TipoGEService } from 'src/app/gestion/services/tipoGE.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert';

@Component({
  selector: 'app-proyecto.listar',
  templateUrl: './proyecto.listar.component.html',
  styleUrls: ['./proyecto.listar.component.scss']
})
export class ProyectoListarComponent {
  title = 'listarProyecto';
  tipos: any[] = [];
  proyectos: any[] = [];
  usuarios:any[] =[];
  actividadNombre:any;
  idActividad:any;
  busqueda: any;

  constructor(
    private proyectoService: ProyectoService,
    private auth: AuthService,
    private tipoService: TipoGEService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // Obtén el valor de idPat de la URL
    this.route.params.subscribe(params => {
      const idEpica = params['idActividadEstrategica'];
      this.tipoService.listarGestionPorId(idEpica,this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.actividadNombre = data.nombre;
          this.idActividad = data.idActividadEstrategica // Asignar el nombre del Pat a patNombre
        },
        (error) => {
          // Manejo de errores
        }
      );

      this.cargarProyectos(idEpica);
    });
  }

  cargarActividades() {
    this.tipoService.listarEpica(this.auth.obtenerHeader()).toPromise().then(
      (data: any) => {
        this.tipos = data;
      },
      (error) => {
        swal(error.error.mensajeTecnico);
      }
    );
  }

  cargarProyectos(idActividadEstrategica: number) {
    // Utiliza idPat en tu solicitud para cargar las gestiones relacionadas
    this.proyectoService
      .listarProyectoPorIdActividadEstrategica(idActividadEstrategica, this.auth.obtenerHeader()) // Debes tener un método en tu servicio para listar gestiones por idPat
      .toPromise()
      .then(
        (data: any) => {
          this.proyectos = data;
        },
        (error) => {
          swal(error.error.mensajeTecnico);
        }
      );
  }


  eliminarProyecto(idProyecto: number) {
    const proyectoAEliminar = this.proyectos.find(p => p.idProyecto === idProyecto);

      swal({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar este elemento.",
        icon: "warning",
        buttons: ["Cancelar", "Eliminar"],
        dangerMode: true,
      })
      .then((confirmacion) => {
      if (confirmacion) {
        this.proyectoService.eliminarProyecto(idProyecto, this.auth.obtenerHeader()).subscribe(
          (response) => {
            swal("Eliminado Satisfactoriamente", "El proyecto " + proyectoAEliminar.nombre + " se ha eliminado.", "success").then(() => {
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
