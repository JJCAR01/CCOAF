import { Component,OnInit } from '@angular/core';
import { ActividadService } from '../services/actividad.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { TipoGEService } from 'src/app/gestion/services/tipoGE.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import swal from 'sweetalert';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  porcentajeEstrategica:any;
  usuarioEstrategica:any;
  patEstrategica:any;
  idActividadGestionSeleccionado:any;
  nombreActividadGestion:any;
  idProyectoSeleccionado:any;
  nombreProyecto:any;
  form:FormGroup;
  formProyecto:FormGroup;
  busqueda: any;

  constructor(
    private actividadService: ActividadService,
    private auth: AuthService,
    private tipoService: TipoGEService,
    private route: ActivatedRoute,
    private usuarioService :UsuarioService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
    fechaInicial: ['', Validators.required],
    fechaFinal: ['', Validators.required],
    });
    this.formProyecto = this.formBuilder.group({
      presupuesto: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
    });
}

  ngOnInit() {
    // Obtén el valor de idPat de la URL
    this.route.params.subscribe(params => {
      const idActividadEstrategica = params['idActividadEstrategica'];
      this.tipoService.listarActividadEstrategicaPorId(idActividadEstrategica,this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.actividadNombre = data.nombre;
          this.idActividadEstrategica = data.idActividadEstrategica
          this.porcentajeEstrategica = data.avance
          this.usuarioEstrategica = data.idUsuario
          this.patEstrategica = data.idPat
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
  modificarActividadGestion() {
    if (this.form.valid && this.idActividadGestionSeleccionado) {
      const fechaInicial = this.form.get('fechaInicial')?.value;
      const fechaFinal = this.form.get('fechaFinal')?.value;
      const actividadGestion = {
        fechaInicial: fechaInicial,
        fechaFinal: fechaFinal,
      };
      this.actividadService
        .modificarActividadGestionActividadEstrategica(actividadGestion, this.idActividadGestionSeleccionado, this.auth.obtenerHeader())
        .subscribe(
          (response) => {
            swal({
              title: "Modificado Satisfactoriamente",
              text: "La gestión del área se ha modificado",
              icon: "success",
            }).then((value) => {
              location.reload();
            });
          },
          (error) => {
            swal(error.error.mensajeTecnico, "warning");
          }
        );
    }
  }
  modificarProyecto() {

    if (this.formProyecto.valid && this.idProyectoSeleccionado) {
      const presupuesto = this.formProyecto.get('presupuesto')?.value;
      const fechaInicial = this.formProyecto.get('fechaInicial')?.value;
      const fechaFinal = this.formProyecto.get('fechaFinal')?.value;
      const actividadEstrategica = {
        presupuesto:presupuesto,
        fechaInicial: fechaInicial,
        fechaFinal: fechaFinal,
      };

      this.actividadService
        .modificarProyecto(actividadEstrategica, this.idProyectoSeleccionado, this.auth.obtenerHeader())
        .subscribe(
          (response) => {
            swal({
              title: "Modificado Satisfactoriamente",
              text: "La actividad estrategica se ha modificado",
              icon: "success",
            }).then((value) => {
              location.reload();
            });
          },
          (error) => {
            swal(error.error.mensajeTecnico, "warning");
          }
        );
    }
  }

  obtenerActividadGestion(idActividadGestion: number,actividadGestion:any) {
    this.idActividadGestionSeleccionado = idActividadGestion;
    this.nombreActividadGestion = actividadGestion.nombre;
  }
  obtenerProyecto(idActividadEstrategica: number,actividadEstrategica:any) {
    this.idProyectoSeleccionado = idActividadEstrategica;
    this.nombreProyecto = actividadEstrategica.nombre;
  }

  obtenerNombreUsuario(idUsuario: number) {
    const usuario = this.usuarios.find((u) => u.idUsuario === idUsuario);
    return usuario ? usuario.nombre + " " + usuario.apellidos : '';
  }
  colorPorcentaje(porcentaje: number): string {
    if (porcentaje < 30) {
      return 'porcentaje-bajo'; // Define las clases CSS para porcentajes bajos en tu archivo de estilos.
    } else if (porcentaje >= 30 && porcentaje < 100){
      return 'porcentaje-medio'; // Define las clases CSS para porcentajes normales en tu archivo de estilos.
    } else {
      return 'porcentaje-cien';
    }
  }
  colorDias(diasRestantes: number): string {
    if (diasRestantes < 10) {
      return 'porcentaje-bajo'; // Define las clases CSS para porcentajes bajos en tu archivo de estilos.
    } else {
      return 'porcentaje-normal';
    }
  }
  
}
