import { Component,OnInit } from '@angular/core';
import { ActividadService } from '../services/actividad.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { TipoGEService } from 'src/app/gestion/services/tipoGE.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Proyecto } from '../crear/proyecto';
import { EEstado } from 'src/app/gestion/listar/EEstado';
import { TareaService } from 'src/app/tarea/services/tarea.service';

@Component({
  selector: 'app-listar',
  templateUrl: './actividad.listar.component.html',
  styleUrls: ['./actividad.listar.component.scss']
})
export class ActividadListarComponent implements OnInit{
  title = 'listarActividad';
  estadoEnumList: string[] = [];
  gestiones: any[] = [];
  proyectos: any[] = [];
  actividades: any[] = [];
  usuarios:any[] =[];
  tareas:any[] =[];
  actividadNombre:any;
  usuarioProyecto:any;
  usuarioGestion:any;
  idActividadEstrategica:any;
  porcentajeEstrategica:any;
  usuarioEstrategica:any;
  patEstrategica:any;
  idActividadGestionSeleccionado:any;
  nombreActividadGestion:any;
  idProyectoSeleccionado:any;
  nombreProyecto:any;
  idTareaSeleccionado:any;
  nombreTarea:any;
  form:FormGroup;
  formProyecto:FormGroup;
  formTarea:FormGroup;
  formCrearTarea:FormGroup
  busqueda: any;

  constructor(
    private actividadService: ActividadService,
    private auth: AuthService,
    private tipoService: TipoGEService,
    private route: ActivatedRoute,
    private usuarioService :UsuarioService,
    private formBuilder: FormBuilder,
    private tareaService: TareaService
  ) {
    this.form = this.formBuilder.group({
      nombre:['',Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
    });
    this.formProyecto = this.formBuilder.group({
      nombre:['',Validators.required],
      presupuesto: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
    });
    this.formTarea = this.formBuilder.group({
      estado: ['', Validators.required],
    });
    this.formCrearTarea = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      idUsuario: ['', Validators.required],
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
    this.crearTarea();
    this.estadoEnumList = Object.values(EEstado);
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
          console.log(data)
        },
        (error) => {
          Swal.fire(error.error.mensajeTecnico,'', 'error');
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
          Swal.fire(error.error.mensajeTecnico,'', 'error');
        }
      );
  }

  eliminarGestion(idActividadGestionActividadEstrategica: number) {
    const gestionAEliminar = this.gestiones.find(gest => gest.idActividadGestionActividadEstrategica === idActividadGestionActividadEstrategica);

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
        this.actividadService.eliminarActividadGestionActividadEstrategica(idActividadGestionActividadEstrategica, this.auth.obtenerHeader()).subscribe(
          (response) => {
            Swal.fire("Eliminado Satisfactoriamente", "La gestión del área " + gestionAEliminar.nombre + " se ha eliminado.", "success").then(() => {
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
  eliminarProyecto(idProyecto: number) {
    const proyectoAEliminar = this.proyectos.find(ep => ep.idProyecto === idProyecto);

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
        this.actividadService.eliminarProyecto(idProyecto, this.auth.obtenerHeader()).subscribe(
          (response) => {
            Swal.fire("Eliminado Satisfactoriamente", "El proyecto con el nombre " + proyectoAEliminar.nombre + " se ha eliminado.", "success").then(() => {
              window.location.reload();
            });
            console.log(response);
          },
          (error) => {
            Swal.fire("Solicitud no válida", error.error.mensajeHumano, "error");
          }
        );
      }
      });
  }
  modificarActividadGestion() {
    if (this.form.valid && this.idActividadGestionSeleccionado) {
      
      const nombre = this.form.get('nombre')?.value;
      const fechaInicial = this.form.get('fechaInicial')?.value;
      const fechaFinal = this.form.get('fechaFinal')?.value;
      const idUsuario = this.usuarioGestion;
      const idActividadEstrategica = this.idActividadEstrategica
      
      const actividadGestion = {
        nombre:nombre,
        fechaInicial: fechaInicial,
        fechaFinal: fechaFinal,
        idUsuario:idUsuario,
        idActividadEstrategica:idActividadEstrategica
      };
      
      this.actividadService
        .modificarActividadGestionActividadEstrategica(actividadGestion, this.idActividadGestionSeleccionado, this.auth.obtenerHeader())
        .subscribe(
          (response) => {
            Swal.fire({
              title: "Modificado Satisfactoriamente",
              text: "La gestión del área se ha modificado",
              icon: "success",
            }).then((value) => {
              location.reload();
            });
          },
          (error) => {
            Swal.fire(error.error.mensajeTecnico, '',"warning");
          }
        );
    }
  }
  modificarProyecto() {
    if (this.formProyecto.valid && this.idProyectoSeleccionado) {
      const nombre = this.formProyecto.get('nombre')?.value;
      const presupuesto = this.formProyecto.get('presupuesto')?.value;
      const fechaInicial = this.formProyecto.get('fechaInicial')?.value;
      const fechaFinal = this.formProyecto.get('fechaFinal')?.value;
      const idActividadEstrategica = this.idActividadEstrategica;
      const idUsuario = this.usuarioProyecto

      const proyecto = {
        nombre:nombre,
        presupuesto:presupuesto,
        fechaInicial: fechaInicial,
        fechaFinal: fechaFinal,
        idUsuario : idUsuario,
        idActividadEstrategica : idActividadEstrategica
      };

      this.actividadService
        .modificarProyecto(proyecto, this.idProyectoSeleccionado, this.auth.obtenerHeader())
        .subscribe(
          (response) => {
            Swal.fire({
              title: "Modificado Satisfactoriamente",
              text: "La actividad estrategica se ha modificado",
              icon: "success",
            }).then((value) => {
              location.reload();
            });
          },
          (error) => {
            Swal.fire(error.error.mensajeTecnico, "warning");
          }
        );
    }
  }
  cargarTareas(idASE:any, tipoASE:any) {
    if(tipoASE === 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA'){
    this.tareaService
      .listarTareaPorActvidadGestionActividadEstrategica(idASE,this.auth.obtenerHeader()) 
      .toPromise()
      .then(
        (data: any) => {
        this.tareas = data;
        this.nombreTarea = data.descripcion
        },
        (error) => {
          Swal.fire('Error',error.error.mensajeTecnico,'error');
        }
    )};
  } 
  crearTarea() {

    if (this.formCrearTarea.valid) {
      
      const nombre = this.formCrearTarea.get('nombre')?.value;
      const descripcion = this.formCrearTarea.get('descripcion')?.value;
      const idUsuario = this.formCrearTarea.get('idUsuario')?.value;
      
      const tarea = {
        nombre: nombre,
        descripcion: descripcion,
        estado: EEstado.EN_BACKLOG,
        tipoASE: 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA',
        idASE: this.idActividadGestionSeleccionado,
        idUsuario: idUsuario,
      };
      
      this.tareaService
        .crearTarea(tarea,this.auth.obtenerHeader())
        .subscribe(
          (response) => {
            Swal.fire({
              title: "Modificado Satisfactoriamente",
              text: "La gestión del área se ha modificado",
              icon: "success",
            });
          },
          (error) => {
            Swal.fire('Error',error.error.mensajeHumano, "error");
          }
        );
    }
  }
  modificarTarea() {
    if (this.formTarea.valid) {
      const estado = this.formTarea.get('estado')?.value;
      const tareaModificar = {
        estado: estado,
      };
      this.tareaService
        .modificarTarea(tareaModificar, this.idTareaSeleccionado,this.auth.obtenerHeader())
        .subscribe(
          (response) => {
            Swal.fire({
              title: "Modificado!!!",
              text: "La gestión del área se ha modificado",
              icon: "success",
            });
          },
          (error) => {
            Swal.fire('Error',error.error.mensajeHumano, "error");
          }
        );
    }
  }
  eliminarTarea(idTarea: number) {
    const tareaAEliminar = this.tareas.find(t => t.idTarea === idTarea);

    Swal.fire({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar este elemento.",
        icon: "warning",
        confirmButtonText: "Confirmar",
        confirmButtonColor: "#3085d6",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
      })
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
        this.tareaService.eliminarTarea(idTarea, this.auth.obtenerHeader()).subscribe(
          (response) => {
            Swal.fire("Eliminado Satisfactoriamente", "La actividad de gestión " + tareaAEliminar.nombre + " se ha eliminado.", "success").then(() => {
              window.location.reload();
            });
            console.log(response);
          },
          (error) => {
            Swal.fire("Solicitud no válida", error.error.mensajeHumano, "error");
          }
        );
      }
      });
  }

  obtenerActividadGestionActividadEstrategica(idActividadGestionActividadEstrategica: number,gestion:any) {
    this.idActividadGestionSeleccionado = idActividadGestionActividadEstrategica;
    this.nombreActividadGestion = gestion.nombre;
    this.usuarioGestion = gestion.idUsuario
  }
  obtenerTarea(idTarea: number,tarea:any) {
    this.idTareaSeleccionado = idTarea;
    this.nombreTarea = tarea.nombre;
  }
  obtenerProyecto(idProyecto: number,proyecto:any) {
    this.idProyectoSeleccionado = idProyecto;
    this.nombreProyecto = proyecto.nombre;
    this.usuarioProyecto = proyecto.idUsuario;
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
  isEstado(tareaEstado:any, estado:any) {
    return tareaEstado === estado;
  }
  
}
