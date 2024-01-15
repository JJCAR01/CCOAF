import { Component,OnInit } from '@angular/core';
import { ActividadService } from '../services/actividad.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { TipoGEService } from 'src/app/gestion/services/tipoGE.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EEstado } from 'src/app/gestion/listar/EEstado';
import { TareaService } from 'src/app/tarea/services/tarea.service';
import { EModalidad } from './emodalidad';
import { EPlaneacion } from './eplaneacion';

@Component({
  selector: 'app-listar',
  templateUrl: './actividad.listar.component.html',
  styleUrls: ['./actividad.listar.component.scss']
})
export class ActividadListarComponent implements OnInit{
  title = 'listarActividad';
  modalidadEnumList: string[] = [];
  planeacionEnumList = Object.values(EPlaneacion);
  estadoEnumList: string[] = [];
  gestiones: any[] = [];
  proyectos: any[] = [];
  actividades: any[] = [];
  usuarios:any[] =[];
  tareas:any[] =[];
  patNombre:any;
  actividadNombre:any;
  usuarioProyecto:any;
  usuarioGestion:any;
  idActividadEstrategica:any;
  porcentajeEstrategica:any;
  usuarioEstrategica:any;
  patEstrategica:any;
  idActividadGestionSeleccionado:any;
  nombreActividadGestion:any;
  fechaInicialGestion:any;
  fechaFinalGestion:any;
  idProyectoSeleccionado:any;
  nombreProyecto:any;
  presupuestoProyecto:any;
  fechaInicialProyecto:any;
  fechaFinalProyecto:any;
  modalidadProyecto:any;
  planeacionProyecto:any;
  idTareaSeleccionado:any;
  nombreTarea:any;
  estadoTarea:any;
  idTareaTipo:any;
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
      modalidad: ['', Validators.required],
      planeacionSprint:['', Validators.required],
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
  this.modalidadEnumList= Object.values(EModalidad);
  this.route.params.subscribe(params => {
    this.patNombre = params['patNombre'];
    const idActividadEstrategica = params['idActividadEstrategica'];

    this.tipoService.listarActividadEstrategicaPorId(idActividadEstrategica, this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.actividadNombre = data.nombre;
        this.idActividadEstrategica = data.idActividadEstrategica;
        this.porcentajeEstrategica = data.avance;
        this.usuarioEstrategica = data.idUsuario;
        this.patEstrategica = data.idPat;

        this.cargarGestiones(idActividadEstrategica);
        this.cargarProyectos(idActividadEstrategica);
      },
    );
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
        Swal.fire('Error', error.error.mensajeTecnico,'error');
      }
    );
  }

  toggleBotonesAdicionales() {
    const btnOpcion1 = document.getElementById('btnOpcion1');
    const btnOpcion2 = document.getElementById('btnOpcion2');

    if (btnOpcion1 && btnOpcion2) {
      btnOpcion1.classList.toggle('d-none');
      btnOpcion2.classList.toggle('d-none');
    }
  }

  cargarGestiones(idActividadEstrategica: number) {
    this.actividadService
      .listarActividadGestionActividadEstrategicaPorIdActividadEstrategica(idActividadEstrategica, this.auth.obtenerHeader()) // Debes tener un método en tu servicio para listar gestiones por idPat
      .toPromise()
      .then(
        (data: any) => {
          this.gestiones = data;
        },
        (error) => {
          Swal.fire('Error', error.error.mensajeTecnico,'error');
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
          Swal.fire('Error',error.error.mensajeTecnico,'error');
        }
      );
  }

  eliminarGestion(idActividadGestionActividadEstrategica: number) {
    const gestionAEliminar = this.gestiones.find(gest => gest.idActividadGestionActividadEstrategica === idActividadGestionActividadEstrategica);

      Swal.fire({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar este elemento.",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true,     
      })
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
        this.actividadService.eliminarActividadGestionActividadEstrategica(idActividadGestionActividadEstrategica, this.auth.obtenerHeader()).subscribe(
          (response) => {
            Swal.fire({
              title:"Eliminado!!!", 
              text:"La gestión del área se ha eliminado.",
              icon: "success",
              confirmButtonColor: '#0E823F',
            }).then(() => {
              this.cargarGestiones(this.idActividadEstrategica)
            });
          },
          (error) => {
            Swal.fire({
              title:'Solicitud no válida!',
              text: error.error.mensajeTecnico,
              icon: "error",
              confirmButtonColor: '#0E823F',
            });
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
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true,  
      })
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
        this.actividadService.eliminarProyecto(idProyecto, this.auth.obtenerHeader()).subscribe(
          (response) => {
            Swal.fire({
              title:"Eliminado!!!",
              text:"El proyecto se ha eliminado.",
              icon:"success",
              reverseButtons: true,  
            }).then(() => {
              this.cargarProyectos(this.idActividadEstrategica)
            });
          },
          (error) => {
            Swal.fire({
              title:'Solicitud no válida!',
              text: error.error.mensajeTecnico,
              icon: "error",
              confirmButtonColor: '#0E823F',
            });
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

      Swal.fire({
        title: "¿Estás seguro de modificar?",
        icon:"question",
        text: "Una vez modificado no podrás revertir los cambios",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true, 
      }).then((confirmacion) => {
        if (confirmacion.isConfirmed) {
          this.actividadService.modificarActividadGestionActividadEstrategica(actividadGestion, this.idActividadGestionSeleccionado, this.auth.obtenerHeader())
            .subscribe(
              (response) => {
              Swal.fire({
                title: "Modificado!!!",
                text: "La gestión del área se ha modificado",
                icon: "success",
                confirmButtonColor: '#0E823F',
              }).then((value) => {
                this.cargarGestiones(this.idActividadEstrategica)
              });
              },
          (error) => {
            Swal.fire({
              title:'Solicitud no válida!',
              text: error.error.mensajeTecnico,
              icon: "error",
              confirmButtonColor: '#0E823F',
            });
          }
        );
        }
      })
    }
  }
  modificarProyecto() {
    if (this.formProyecto.valid) {
      const nombre = this.formProyecto.get('nombre')?.value;
      const presupuesto = this.formProyecto.get('presupuesto')?.value;
      const fechaInicial = this.formProyecto.get('fechaInicial')?.value;
      const fechaFinal = this.formProyecto.get('fechaFinal')?.value;
      const modalidad = this.formProyecto.get('modalidad')?.value;
      const planeacionSprint = this.formProyecto.get('planeacionSprint')?.value;
      const idActividadEstrategica = this.idActividadEstrategica;
      const idUsuario = this.usuarioProyecto

      const proyecto = {
        nombre:nombre,
        presupuesto:presupuesto,
        fechaInicial: fechaInicial,
        fechaFinal: fechaFinal,
        modalidad:modalidad,
        planeacionSprint: planeacionSprint,
        idUsuario : idUsuario,
        idActividadEstrategica : idActividadEstrategica
      };

      Swal.fire({
        title: "¿Estás seguro de modificar?",
        icon:"question",
        text: "Una vez modificado no podrás revertir los cambios",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true, 
      }).then((confirmacion) => {
        if (confirmacion.isConfirmed) {
        this.actividadService
          .modificarProyecto(proyecto, this.idProyectoSeleccionado, this.auth.obtenerHeader())
          .subscribe(
            (response) => {
              Swal.fire({
                title: "Modificado!!!",
                text: "El proyecto se ha modificado",
                icon: "success",
                confirmButtonColor: '#0E823F',
              }).then(() => {
                this.cargarProyectos(this.idActividadEstrategica)
              });
            },
            (error) => {
              Swal.fire({
                title:'Solicitud no válida!',
                text: error.error.mensajeTecnico,
                icon: "error",
                confirmButtonColor: '#0E823F',
              });
            }
          );
        }
      })
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
              title: "Creado!!!",
              text: "Se ha creado la tarea.",
              icon: "success",
              confirmButtonColor: '#0E823F',
            }).then(()=>{
              this.cargarTareas(this.idActividadGestionSeleccionado,'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA')
              this.formCrearTarea.reset()
              this.cargarGestiones(this.idActividadEstrategica)
            });
          },
          (error) => {
            Swal.fire({
              title:'Solicitud no válida!',
              text: error.error.mensajeTecnico,
              icon: "error",
              confirmButtonColor: '#0E823F',
            });
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
      Swal.fire({
        title: "Modificado!!!",
        text: "La gestión del área se ha modificado",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true, 
      })
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
          this.tareaService.modificarTarea(tareaModificar, this.idTareaSeleccionado,this.auth.obtenerHeader()).subscribe(
              (response) => {
                Swal.fire({
                  icon : 'success',
                  title : 'Modificado!!!',
                  text : 'El ha modificado la tarea.',
                  confirmButtonColor: '#0E823F',
                  }).then(() => {
                    this.cargarGestiones(this.idActividadEstrategica)
                    this.cargarTareas(this.idTareaTipo,'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA')
                    this.formTarea.reset()
                });
              },
              (error) => {
                Swal.fire({
                  title:'Solicitud no válida!',
                  text: error.error.mensajeTecnico,
                  icon: "error",
                  confirmButtonColor: '#0E823F',
                });
              }
            );
        }
      });
    }
  }
  eliminarTarea(idTarea: number) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar este elemento.",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true, 
      })
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
        this.tareaService.eliminarTarea(idTarea, this.auth.obtenerHeader()).subscribe(
          (response) => {
            Swal.fire({
              title:"Eliminado!!!", 
              text:"La tarea se ha eliminado.", 
              icon:"success",
              confirmButtonColor: '#0E823F', 
            }).then(() => {
              this.cargarTareas(this.idActividadGestionSeleccionado,'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA')
            });
          },
          (error) => {
            Swal.fire({
              title:'Solicitud no válida!',
              text: error.error.mensajeTecnico,
              icon: "error",
              confirmButtonColor: '#0E823F',
            });
          }
        );
      }
      });
  }

  obtenerActividadGestionActividadEstrategica(idActividadGestionActividadEstrategica: number,gestion:any) {
    this.idActividadGestionSeleccionado = idActividadGestionActividadEstrategica;
    this.nombreActividadGestion = gestion.nombre;
    this.usuarioGestion = gestion.idUsuario,
    this.fechaInicialGestion = gestion.fechaInicial,
    this.fechaFinalGestion = gestion.fechaFinal,

    this.form.patchValue({
      nombre: this.nombreActividadGestion,
      fechaIncial: this.fechaInicialGestion,
      fechaFinal: this.fechaFinalGestion,
    });
  }
  obtenerTarea(idTarea: number,tarea:any) {
    this.idTareaSeleccionado = idTarea;
    this.nombreTarea = tarea.nombre;
    this.idTareaTipo = tarea.idASE;
    this.estadoTarea = tarea.estado

    this.formTarea.patchValue({
      estado : this.estadoTarea,
    });
  }
  obtenerProyecto(idProyecto: number,proyecto:any) {
    this.idProyectoSeleccionado = idProyecto;
    this.nombreProyecto = proyecto.nombre;
    this.usuarioProyecto = proyecto.idUsuario;
    this.presupuestoProyecto = proyecto.presupuesto
    this.fechaInicialProyecto = proyecto.fechaInicial
    this.fechaFinalProyecto = proyecto.fechaFinal
    this.modalidadProyecto = proyecto.modalidad
    this.planeacionProyecto = proyecto.planeacionSprint

    this.formProyecto.patchValue({
      nombre: this.nombreProyecto,
      presupuesto: this.presupuestoProyecto,
      fechaInicial: this.fechaInicialProyecto,
      fechaFinal: this.fechaFinalProyecto,
      modalidad: this.modalidadProyecto,
      planeacionSprint:this.planeacionProyecto
    });
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
  convertirModalidad(valor: string): string {
    return valor.toUpperCase().replace(/ /g, '_');;
  }

  verModalidad(valor: string): string {
    return valor.toUpperCase().replace(/_/g, ' ');;
  }
  
}
