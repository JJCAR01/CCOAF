import { Component,OnInit } from '@angular/core';
import { ActividadService } from '../services/actividad.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { TipoGEService } from 'src/app/gestion/services/tipoGE.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EEstado } from 'src/enums/eestado';
import { TareaService } from 'src/app/tarea/services/tarea.service';
import { EModalidad } from 'src/enums/emodalidad';
import { EPlaneacion } from 'src/enums/eplaneacion';
import { EPeriodicidad } from 'src/enums/eperiodicidad';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.development';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Usuario } from 'src/app/modelo/usuario';
import { MENSAJE_TITULO } from 'src/app/utilitarios/mensaje/mensajetitulo';
import { CustomValidators } from 'src/custom/custom-validators';

@Component({
  selector: 'app-listar',
  templateUrl: './actividad.listar.component.html',
  styleUrls: ['./actividad.listar.component.scss']
})
export class ActividadListarComponent implements OnInit{
  title = 'listarActividad';
  CAMPO_OBLIGATORIO = MENSAJE_TITULO.CAMPO_OBLIGATORIO;
  CAMPO_OBLIGATORIO_MINIMO_CARACTERES = MENSAJE_TITULO.CAMPO_OBLIGATORIO_MINIMO_CARACTERES;
  CAMPO_MINIMO_CARACTERES = MENSAJE_TITULO.MINIMO_CARACTERES_DESCRIPCION;
  NOMBRE_ACTIVDIDAD_GESTION = MENSAJE_TITULO.NOMBRE_ACTIVIDAD_GESTION;
  NOMBRE_PROYECTO = MENSAJE_TITULO.NOMBRE_PROYECTO;
  NOMBRE_TAREA = MENSAJE_TITULO.NOMBRE_TAREA_ACTVIDAD_GESTION;
  FECHA_INICIAL_ACTIVIDAD_GESTION = MENSAJE_TITULO.FECHA_INICIAL_ACTIVIDAD_GESTION;
  FECHA_INICIAL_PROYECTO = MENSAJE_TITULO.FECHA_INICIAL_PROYECTO;
  FECHA_FINAL_ACTIVIDAD_GESTION = MENSAJE_TITULO.FECHA_FINAL_ACTIVIDAD_GESTION;
  FECHA_FINAL_PROYECTO = MENSAJE_TITULO.FECHA_FINAL_PROYECTO;
  DURACION=  MENSAJE_TITULO.DURACION;
  DIAS_RESTANTES=  MENSAJE_TITULO.DIAS_RESTANTES;
  AVANCE_REAL_ACTIVIDAD_GESTION = MENSAJE_TITULO.AVANCE_REAL_ACTIVIDAD_GESTION;
  AVANCE_REAL_PROYECTO = MENSAJE_TITULO.AVANCE_REAL_PROYECTO;
  AVANCE_REAL_TAREA = MENSAJE_TITULO.AVANCE_REAL_TAREA;
  AVANCE_ESPERADO=  MENSAJE_TITULO.AVANCE_ESPERADO;
  CUMPLIMIENTO=  MENSAJE_TITULO.CUMPLIMIENTO;
  ACCIONES =  MENSAJE_TITULO.ACCIONES;
  RESPONSABLE_ACTIVIDAD_GESTION= MENSAJE_TITULO.RESPONSABLE_ACTIVIDAD_GESTION;
  RESPONSABLE_PROYECTO = MENSAJE_TITULO.RESPONSABLE_PROYECTO;
  RESPONSABLE_TAREA = MENSAJE_TITULO.RESPONSABLE_TAREA;
  PERIODICIDAD = MENSAJE_TITULO.PERIODICIDAD_TAREA;
  ESTADO = MENSAJE_TITULO.ESTADO_TAREA;
  DESCRIPCION = MENSAJE_TITULO.DESCRIPCION_TAREA;
  PRESUPUESTO = MENSAJE_TITULO.PRESUPUESTO_PROYECTO;
  MODALIDAD = MENSAJE_TITULO.MODALIDAD_PROYECTO;
  VALOR_EJECUTADO = MENSAJE_TITULO.VALOR_EJECUTADO_PROYECTO;
  PLANEACION = MENSAJE_TITULO.PLANEACION_PROYECTO;
  TOTAL_SPRINT = MENSAJE_TITULO.TOTAL_SPRINT_PROYECTO;

  esAdmin: boolean = false; 
  esDirector: boolean = false; 
  esOperador: boolean = false; // Agrega esta línea
  esOperadorEditor: boolean = false;
  esConsultor: boolean = false;

  tipoFormulario: 'PROYECTO' | 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA' | 'TAREA' = 'PROYECTO';
  pesoDeArchivo = 300 * 1024 * 1024; // 300 MB
  extencionesPermitidas = /\.(doc|docx|xls|xlsx|ppt|pptx|zip|pdf)$/i;
  idObservacionProyectoSeleccionado: number = 0;
  idObservacionActividadGestionEstrategicaSeleccionado: number = 0;
  idObservacionTareaSeleccionado: number = 0;
  idDocumentoActividadGestionEstrategicaSeleccionado: number | 0 = 0;
  idDocumentoTareaSeleccionado: number | 0 = 0;
  idDocumentoProyectoSeleccionado: number | 0 = 0;
  nombreArchivoSeleccionado: string = '';
  archivoSeleccionado: File | null = null;
  documentoObtenido: any [] = [];
  modalidadEnumList: string[] = [];
  planeacionEnumList = Object.values(EPlaneacion);
  estadoEnumList: string[] = [];
  periodiciadEnumLista: string[] = [];
  gestiones: any[] = [];
  proyectos: any[] = [];
  actividades: any[] = [];
  usuarios:Usuario[] =[];
  tareas:any[] =[];
  observaciones:any[] =[];
  patNombre:any;
  actividadNombre:any;
  usuarioProyecto:any;
  idActividadEstrategica:number = 0;
  porcentajeEstrategica:any;
  usuarioEstrategica:any;
  patEstrategica:number =0;
  idActividadGestionEstrategicaSeleccionado:number = 0;
  idProyectoSeleccionado:number | 0 = 0;
  nombreProyecto:any;
  idTareaSeleccionado:number | 0 = 0;
  nombreTarea:any;
  estadoTarea:any;
  idTareaTipo:number = 0;
  periodicidadTarea:any;
  collapseSeleccionado : number | null = null;
  form:FormGroup;
  formProyecto:FormGroup;
  formModificarEstadoTarea:FormGroup;
  formModificarPorcentaje:FormGroup;
  formTarea:FormGroup;
  formModificarTarea:FormGroup;
  formObservacion:FormGroup;
  formModificarValorEjecutado:FormGroup;
  formModificarObservacion:FormGroup;
  busqueda: any;

  constructor(
    private actividadService: ActividadService,
    private auth: AuthService,
    private tipoService: TipoGEService,
    private route: ActivatedRoute,
    private usuarioService :UsuarioService,
    private formBuilder: FormBuilder,
    private tareaService: TareaService,
  ) {
    this.form = this.formBuilder.group({
      nombre:['',Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      idUsuario: ['', Validators.required],
    });
    this.formProyecto = this.formBuilder.group({
      nombre:['',Validators.required],
      presupuesto: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      modalidad: ['', Validators.required],
      planeacionSprint:['', Validators.required],
      idUsuario:['', Validators.required],
    });
    this.formModificarEstadoTarea = this.formBuilder.group({
      estado: ['', Validators.required],
    });
    this.formModificarPorcentaje = this.formBuilder.group({
      porcentajeReal: ['', Validators.required],
    });
    this.formModificarValorEjecutado = this.formBuilder.group({
      valorEjecutado: ['', Validators.required],
    });
    this.formObservacion = this.formBuilder.group({
      id: ['', Validators.required],
      fecha: [this.obtenerFechaActual(), Validators.required],
      descripcion: ['', Validators.required],
    });
    this.formTarea = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required, CustomValidators.minimoCaracteres(50)],
      periodicidad: ['', Validators.required],
      idUsuario: ['', Validators.required],
    });
    this.formModificarTarea = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required, CustomValidators.minimoCaracteres(50)],
      periodicidad: ['', Validators.required],
      idUsuario: ['', Validators.required],
    });
    this.formModificarObservacion = this.formBuilder.group({
      descripcion: ['', Validators.required],
    }); 
}

ngOnInit() {
  // Usar Promise.all para esperar a que todas las promesas se resuelvan
  Promise.all([
    this.auth.esAdmin(),
    this.auth.esDirector(),
    this.auth.esOperador(),
    this.auth.esOperadorEditor(),
    this.auth.esConsultor()
  ]).then(([esAdmin, esDirector, esOperador,esOperadorEditor, esConsultor]) => {
    // Asignar los resultados a las propiedades correspondientes
    this.esAdmin = esAdmin;
    this.esDirector = esDirector;
    this.esOperador = esOperador;
    this.esOperadorEditor = esOperadorEditor;
    this.esConsultor = esConsultor;
  });
  this.modalidadEnumList= Object.values(EModalidad);
  this.route.params.subscribe(params => {
    this.patNombre = params['patNombre'];
    const idActividadEstrategica = params['idActividadEstrategica'];

    this.tipoService.listarActividadEstrategicaPorId(idActividadEstrategica, this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.actividadNombre = data.nombre;
        this.idActividadEstrategica = data.idActividadEstrategica;
        this.porcentajeEstrategica = data.porcentajeReal;
        this.usuarioEstrategica = data.idUsuario;
        this.patEstrategica = data.idPat;
        this.cargarGestiones(idActividadEstrategica);
        this.cargarProyectos(idActividadEstrategica);
      },
    );
  });
  this.cargarUsuario();
  this.estadoEnumList = Object.values(EEstado);
  this.periodiciadEnumLista = Object.values(EPeriodicidad);

}

private obtenerFechaActual(): string {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
  const day = ('0' + currentDate.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

  cargarUsuario() {
    this.usuarioService.listarUsuario(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.usuarios = data.sort((a:any, b:any) => a.nombre.localeCompare(b.nombre));
    });
  }

  cargarGestiones(idActividadEstrategica: number) {
    this.actividadService
      .listarActividadGestionActividadEstrategicaPorIdActividadEstrategica(idActividadEstrategica, this.auth.obtenerHeader()) // Debes tener un método en tu servicio para listar gestiones por idPat
      .toPromise()
      .then(
        (data: any) => {
          this.gestiones = data;
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
        }
      );
  }

  modificarValorEjecutado() {
     if (this.formModificarValorEjecutado.valid) {
      const valorEjecutado = this.formModificarValorEjecutado.get('valorEjecutado')?.value;
      const proyectoValorEjecutado = {
        valorEjecutado: valorEjecutado,
      };
      this.mensajePregunta('¿Deseas modificarlo?','modificado','question')
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
          this.actividadService.modificarValorEjecutado(proyectoValorEjecutado, this.idProyectoSeleccionado,this.auth.obtenerHeader()).subscribe(
              (response) => {
                this.mostrarMensaje('Se ha modificado el valor ejecutado del proyecto','success');
                  this.cargarProyectos(this.idActividadEstrategica);
                  this.formModificarValorEjecutado.reset();              
              },
              (error) => {this.swalError(error);}
            );
        } 
      });
    }
  }

  eliminarGestion(idActividadGestionActividadEstrategica: number) {

    this.mensajePregunta('¿Deseas eliminarlo?','eliminado','question')
    .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
        this.actividadService.eliminarActividadGestionActividadEstrategica(idActividadGestionActividadEstrategica, this.auth.obtenerHeader()).subscribe(
          () => {
            this.mostrarMensaje('Se ha eliminado la actividad gestión','success');
              this.cargarGestiones(this.idActividadEstrategica)
          },
          (error) => {this.swalError(error);}
        );
      }
      });
  }
  eliminarProyecto(idProyecto: number) {

    this.mensajePregunta('¿Deseas eliminarlo?','eliminado','question')
    .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
        this.actividadService.eliminarProyecto(idProyecto, this.auth.obtenerHeader()).subscribe(
          () => {
            this.mostrarMensaje('Se ha modificado el proyecto','success');
              this.cargarProyectos(this.idActividadEstrategica)
          },
          (error) => {this.swalError(error);}
        );
      }
      });
  }
  modificarActividadGestion() {
    if (this.form.valid && this.idActividadGestionEstrategicaSeleccionado) {
      
      const nombre = this.form.get('nombre')?.value;
      const fechaInicial = this.form.get('fechaInicial')?.value;
      const fechaFinal = this.form.get('fechaFinal')?.value;
      const idUsuario = this.form.get('idUsuario')?.value;
      const idActividadEstrategica = this.idActividadEstrategica
      
      const actividadGestion = {
        nombre:nombre,
        fechaInicial: fechaInicial,
        fechaFinal: fechaFinal,
        idUsuario:idUsuario,
        idActividadEstrategica:idActividadEstrategica
      };

      this.mensajePregunta('¿Deseas modificarlo?','modificado','question')
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
          this.actividadService.modificarActividadGestionActividadEstrategica(actividadGestion, this.idActividadGestionEstrategicaSeleccionado, this.auth.obtenerHeader())
            .subscribe(
              () => {
                this.mostrarMensaje('Se ha modificado la actividad gestión ' + nombre,'success');
                this.cargarGestiones(this.idActividadEstrategica)
              },
              (error) => {this.swalError(error);}
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
      const idUsuario = this.formProyecto.get('idUsuario')?.value;
      const idActividadEstrategica = this.idActividadEstrategica;

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

      this.mensajePregunta('¿Deseas modificarlo?','modificado','question')
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
        this.actividadService
          .modificarProyecto(proyecto, this.idProyectoSeleccionado, this.auth.obtenerHeader())
          .subscribe(
            (response) => {
              this.mostrarMensaje('Se ha modificado el proyecto ' + nombre,'success');
                this.cargarProyectos(this.idActividadEstrategica)
            },
            (error) => {this.swalError(error);}
          );
        }
      })
    }
  }
  cargarTareas(idASE: any, tipoASE: any) {
    // Si se hace clic en la misma gestión, la cerramos
    if (this.collapseSeleccionado === idASE) {
      this.collapseSeleccionado = null;
    } else {
      this.collapseSeleccionado = idASE;
      if (tipoASE === 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA') {
        this.tareaService
          .listarTareaPorActvidadGestionActividadEstrategica(idASE, this.auth.obtenerHeader())
          .toPromise()
          .then(
            (data: any) => {
              this.tareas = data;
              this.nombreTarea = data.descripcion;
            },
            (error) => {
              Swal.fire('Error', error.error.mensajeTecnico, 'error');
            }
          );
      }
    }
  }
  
  cargarObservaciones(id:any,tipo:string) {
    if(tipo === 'TAREA'){
      this.tareaService
        .listarPorIdTarea(id,this.auth.obtenerHeader()) .subscribe(
          (data: any) => {
            this.observaciones = data;
            this.tipoFormulario = 'TAREA';
          },
        )
    } else if( tipo === 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA'){
      this.actividadService
        .listarObservacionPorIdActividadGestionActividadEstrategica(id,this.auth.obtenerHeader()) .subscribe(
          (data: any) => {
            this.observaciones = data;
            this.tipoFormulario = 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA';
          },
        )
    } else if (tipo === 'PROYECTO'){
      this.actividadService
        .listarObservacionPorIdProyecto(id,this.auth.obtenerHeader()) .subscribe(
          (data: any) => {
            this.observaciones = data;
            this.tipoFormulario = 'PROYECTO';
          },
        )
    }
  } 
  eliminarObservacion(observacion: any, tipo:string) {
    this.mensajePregunta('¿Deseas eliminarlo?','eliminado','question')
    .then((confirmacion) => {
      if (confirmacion.isConfirmed) {
        if(tipo === 'TAREA'){
          const idTarea = observacion.idTarea;
          this.tareaService.eliminarObservacionTarea(observacion.idObservacionTarea, this.auth.obtenerHeader()).subscribe(
            () => {
              this.mostrarMensaje('Se ha eliminado la observación','success');
              this.cargarObservaciones(idTarea, 'TAREA')
            },
            (error) => {
              this.swalError(error.mensajeHumano);
            }
          );
        } else if( tipo === 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA'){
          const idActividadGestionEstrategica = observacion.idActividadGestionEstrategica;
          this.actividadService
            .eliminarObservacionActividadGestionActividadEstrategica(observacion.idObservacionActividadGestionEstrategica,this.auth.obtenerHeader()) .subscribe(
                () => {
                  this.mostrarMensaje('Se ha eliminado la observación','success');
                  this.cargarObservaciones(idActividadGestionEstrategica, 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA')
                },
                (error) => {
                  this.swalError(error.mensajeHumano);
                }
            );
        } else if (tipo === 'PROYECTO'){
          const idProyecto = observacion.idProyecto;
          this.actividadService
            .eliminarObservacionProyecto(observacion.idObservacionProyecto,this.auth.obtenerHeader()) .subscribe(
              () => {
                this.mostrarMensaje('Se ha eliminado la observación','success');
                this.cargarObservaciones(idProyecto, 'PROYECTO')
              },
              (error) => {
                this.swalError(error.mensajeHumano);
              }
          );
        }
        
      }
    });
  } 
  crearTarea() {
    if (this.formTarea.valid) {
      const nombre = this.formTarea.get('nombre')?.value;
      const descripcion = this.formTarea.get('descripcion')?.value;
      const periodicidad = this.formTarea.get('periodicidad')?.value;
      const idUsuario = this.formTarea.get('idUsuario')?.value;
      
      const tarea = {
        nombre: nombre,
        descripcion: descripcion,
        estado: EEstado.EN_BACKLOG,
        periodicidad: periodicidad,
        tipoASE: 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA',
        idASE: this.idActividadGestionEstrategicaSeleccionado,
        idUsuario: idUsuario,
      };
      console.log(tarea)
      this.tareaService
        .crearTarea(tarea,this.auth.obtenerHeader())
        .subscribe(
          () => {
            this.mostrarMensaje('Se ha creado la tarea ' + nombre,'success');
              this.cargarTareas(this.idActividadGestionEstrategicaSeleccionado,'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA')
              this.formTarea.reset()
          },
          (error) => {this.swalError(error);}
        );
    } else {
        this.formTarea.markAllAsTouched();
    }
  }
  crearObservacion() {
    if (this.formObservacion.valid) {
      const fecha = this.formObservacion.get('fecha')?.value;
      const descripcion = this.formObservacion.get('descripcion')?.value;
      if(this.tipoFormulario === 'TAREA'){
        const observacion = {
          idTarea: this.idTareaSeleccionado,
          descripcion: descripcion,
          fecha: fecha,
        };
        this.tareaService
          .crearObservacion(observacion,this.auth.obtenerHeader())
          .subscribe(
            (response) => {
              this.mostrarMensaje('Se ha creado la observación ' + descripcion,'success');
                this.formObservacion.reset()
            },
            (error) => {this.swalError(error);}
          );
      } else if( this.tipoFormulario === 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA'){
        const observacion = {
          idActividadGestionEstrategica: this.idActividadGestionEstrategicaSeleccionado,
          descripcion: descripcion,
          fecha: fecha,
        };
        this.actividadService
          .crearObservacionActividadGestionActividadEstrategica(observacion,this.auth.obtenerHeader())
          .subscribe(
            (response) => {
              this.mostrarMensaje('Se ha creado la observación ' + descripcion,'success');
                this.formObservacion.reset()
            },
            (error) => {this.swalError(error);}
          );
      } else if (this.tipoFormulario === 'PROYECTO'){;
        const observacion = {
          idProyecto: this.idProyectoSeleccionado,
          descripcion: descripcion,
          fecha: fecha,
        };
        this.actividadService
          .crearObservacionProyecto(observacion,this.auth.obtenerHeader())
          .subscribe(
            (response) => {
              this.mostrarMensaje('Se ha creado la observación ' + descripcion,'success');
                this.formObservacion.reset()
            },
            (error) => {this.swalError(error);}
          );
      }
    } else {
      return this.formObservacion.markAllAsTouched();
    }     
  }
  modificarObservacion(tipo: string) {
    if (this.formModificarObservacion.valid) {
      const descripcion = this.formModificarObservacion.get('descripcion')?.value;
      const observacion = {
        descripcion: descripcion,
      }
      this.mensajePregunta('¿Deseas modificarlo?','modificado','question')
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
          switch (tipo) {
            case 'TAREA':
              this.tareaService.modificarObservacionTarea(observacion, this.idObservacionTareaSeleccionado, this.auth.obtenerHeader()).subscribe(
                () => {
                  this.mostrarMensaje('Se ha modificado la observación ' + descripcion,'success');
                },
                (error) => {
                  this.swalError(error);
                }
              );
              break;
            case 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA':
              this.actividadService.modificarObservacionActividadGestionActividadEstrategica(observacion, this.idObservacionActividadGestionEstrategicaSeleccionado, this.auth.obtenerHeader()).subscribe(
                () => {
                  this.mostrarMensaje('Se ha modificado la observación ' + descripcion,'success');
                },
                (error) => {
                  this.swalError(error);
                }
              );
              break;
            case 'PROYECTO':
              this.actividadService.modificarObservacionProyecto(observacion, this.idObservacionProyectoSeleccionado, this.auth.obtenerHeader()).subscribe(
                () => {
                  this.mostrarMensaje('Se ha modificado la observación ' + descripcion,'success');
                },
                (error) => {
                  this.swalError(error);
                }
              );
              break;
          }
        }
      });
    }
  }
  modificarEstado() {
    if (this.formModificarEstadoTarea.valid) {
      const estado = this.formModificarEstadoTarea.get('estado')?.value;
      const tareaModificar = {
        estado: estado,
      };
      this.mensajePregunta('¿Deseas modificarlo?','modificado','question')
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
          this.tareaService.modificarEstadoTarea(tareaModificar, this.idTareaSeleccionado,this.auth.obtenerHeader()).subscribe(
              () => {
                this.mostrarMensaje('Se ha modificado el estado de la tarea','success');
                this.collapseSeleccionado = null;
                this.cargarTareas(this.idTareaTipo,'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA');
                this.formTarea.reset();             
              },
              (error) => {this.swalError(error);}
            );
        } 
      });
    }
  }
  modificarPorcentaje() {
    if(this.periodicidadTarea == "UNICA_VEZ"){
      Swal.fire({
        title:'Solicitud no válida!',
        text: 'La tarea a editar no se puede modificar, porque su periodicidad es única.',
        icon: "warning",
        confirmButtonColor: '#0E823F',
      });
    } else if (this.formModificarPorcentaje.valid) {
      const porcentajeReal = this.formModificarPorcentaje.get('porcentajeReal')?.value;
      const tareaModificar = {
        porcentajeReal: porcentajeReal,
      };
      this.mensajePregunta('¿Deseas modificarlo?','modificado','question')
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
          this.tareaService.modificarPorcentajeTarea(tareaModificar, this.idTareaSeleccionado,this.auth.obtenerHeader()).subscribe(
              (response) => {
                this.mostrarMensaje('Se ha modificado el porcentaje de la tarea','success');
                this.collapseSeleccionado = null;
                this.cargarTareas(this.idTareaTipo,'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA');
                this.formModificarPorcentaje.reset()              
              },
              (error) => {this.swalError(error);}
            );
        } 
      });
    }
  }
  modificarTarea() {
    if (this.formModificarTarea.valid) {
      const nombre = this.formModificarTarea.get('nombre')?.value;
      const periodicidad = this.formModificarTarea.get('periodicidad')?.value;
      const descripcion = this.formModificarTarea.get('descripcion')?.value;
      const idUsuario = this.formModificarTarea.get('idUsuario')?.value;
      const tareaModificar = {
        nombre: nombre,
        periodicidad: periodicidad,
        descripcion: descripcion,
        idUsuario: idUsuario,
      };
      this.mensajePregunta('¿Deseas modificarlo?','modificado','question')
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
          this.tareaService.modificarTarea(tareaModificar, this.idTareaSeleccionado,this.auth.obtenerHeader()).subscribe(
              (response) => {
                this.mostrarMensaje('Se ha modificado la tarea ' + nombre,'success');
                this.collapseSeleccionado = null;
                this.cargarTareas(this.idTareaTipo,'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA');
                this.formTarea.reset();             
              },
              (error) => {this.swalError(error);}
            );
        } 
      });
    }
  }
  eliminarTarea(idTarea: number, idActividadGestionActividadEstrategica: number) {
    this.mensajePregunta('¿Deseas eliminarlo?','eliminado','question')
    .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
        this.tareaService.eliminarTarea(idTarea, this.auth.obtenerHeader()).subscribe(
          () => {
            this.mostrarMensaje('Se ha eliminado la tarea ','success');
            this.collapseSeleccionado = null;
            this.cargarTareas(idActividadGestionActividadEstrategica,'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA')
          },
          (error) => {this.swalError(error);}
        );
      }
      });
  }
  async documento(event: any, tipo: string): Promise<void> {
    if (tipo === 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA' || tipo === 'PROYECTO' || tipo === 'TAREA') {
      this.tipoFormulario = tipo;

      if(tipo === 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA'){
        this.idActividadGestionEstrategicaSeleccionado;
      } else if (tipo === 'PROYECTO'){
        this.idProyectoSeleccionado;
      } else if (tipo === 'TAREA'){
        this.idTareaSeleccionado;
      }
      this.archivoSeleccionado = event.target.files[0];
    
      try {
        await this.validarArchivo();
        // Actualizar el nombre del archivo seleccionado
        this.nombreArchivoSeleccionado = this.archivoSeleccionado ? this.archivoSeleccionado.name : '';
        // Resto del código si la validación es exitosa
      } catch (error) {
        this.archivoSeleccionado = null;
        this.nombreArchivoSeleccionado = '';
      }
    } else {
      throw new Error(`Tipo inválido: ${tipo}`);
    }
  }
  obtenerId(idRecibido: number,tipo:string): void {
    if (tipo === 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA' || tipo === 'PROYECTO' || tipo === 'TAREA') {
      this.tipoFormulario = tipo;

      if(tipo === 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA'){
        this.idActividadGestionEstrategicaSeleccionado = idRecibido;
      } else if (tipo === 'PROYECTO'){
        this.idProyectoSeleccionado = idRecibido;
      }else if (tipo === 'TAREA'){
        this.idTareaSeleccionado = idRecibido;
      }
    } else {
      throw new Error(`Tipo inválido: ${tipo}`);
    }
  }

  private validarArchivo(): boolean {
    if (!this.archivoSeleccionado) {
      // Puedes mostrar un mensaje de error o manejarlo de otra manera
      return false;
    }

    const fileSize = this.archivoSeleccionado.size;
    const fileName = this.archivoSeleccionado.name;

    if (fileSize > this.pesoDeArchivo) {
      alert('El archivo supera el límite de tamaño permitido (300MB).');
      return false;
    } else if (!this.extencionesPermitidas.test(fileName)) {
      alert('Formato de archivo no permitido. Por favor, elija un archivo con una de las siguientes extensiones: .doc, .docx, .xls, .xlsx, .ppt, .pptx, .zip');
      return false;
    }

    return true;
  }
  async subirDocumento(formulario: any,tipo: string) {
    if (tipo === 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA' || tipo === 'PROYECTO' || tipo === 'TAREA') {
      this.tipoFormulario = tipo;
        try {
            if (!this.archivoSeleccionado) {
                throw new Error('No se ha seleccionado ningún archivo.');
            }

            const { id, carpeta } = this.obtenerIdYCarpetaporTipo(tipo);

            const app = initializeApp(environment.firebase);
            const storage = getStorage(app);
            const storageRef = ref(storage, `${carpeta}/${id}/${this.archivoSeleccionado.name}`);
            const snapshot = await uploadBytes(storageRef, this.archivoSeleccionado);
            const downloadURL = await getDownloadURL(storageRef);

            const documento = {
                fecha: this.obtenerFechaActual(),
                rutaDocumento: downloadURL,
            };

            let guardarDocumentoObservable;

            switch (tipo) {
                case 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA':
                    guardarDocumentoObservable = this.actividadService.guardarDocumentoActividadGestionActividadEstrategica(documento, this.idActividadGestionEstrategicaSeleccionado, this.auth.obtenerHeaderDocumento());
                    break;
                case 'PROYECTO':
                    guardarDocumentoObservable = this.actividadService.guardarDocumentoProyecto(documento, this.idProyectoSeleccionado, this.auth.obtenerHeaderDocumento());
                    break;
                case 'TAREA':
                    guardarDocumentoObservable = this.tareaService.guardarDocumentoTarea(documento, this.idTareaSeleccionado, this.auth.obtenerHeaderDocumento());
                    break;
                default:
                    throw new Error(`Tipo de documento no válido: ${tipo}`);
            }

            guardarDocumentoObservable.subscribe(
                () => {
                    this.mostrarMensaje('Archivo modificado correctamente', 'success');  
                    this.archivoSeleccionado = null; // Limpiar el archivo seleccionado
                    this.nombreArchivoSeleccionado = ''; // Limpiar el nombre del archivo seleccionado  
                },
                error => this.mostrarMensaje('Hubo un error: ' + error.error.mensajeTecnico, 'error')
            );

        } catch (error) {
            this.mostrarMensaje('Hubo un error durante al cargar el archivo', 'error');
        }
      } else {
      throw new Error(`Tipo inválido: ${tipo}`);
      }
  }


  async modificarDocumento(formulario: any, tipo: string) {
    if (tipo === 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA' || tipo === 'PROYECTO' || tipo === 'TAREA') {
      this.tipoFormulario = tipo;
      try {
          if (!this.archivoSeleccionado) {
              throw new Error('No se ha seleccionado ningún archivo.');
          }

          const { id, carpeta } = this.obtenerIdYCarpetaporTipo(tipo);

          const app = initializeApp(environment.firebase);
          const storage = getStorage(app);
          const storageRef = ref(storage, `${carpeta}/${id}/${this.archivoSeleccionado.name}`);
          const snapshot = await uploadBytes(storageRef, this.archivoSeleccionado);
          const downloadURL = await getDownloadURL(storageRef);

          const documento = {
              fecha: this.obtenerFechaActual(),
              rutaDocumento: downloadURL,
          };

          let modificarDocumentoObservable;

          switch (tipo) {
            case 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA':
                  modificarDocumentoObservable = this.actividadService.modificarDocumentoActividadGestionEstrategica(documento, this.idDocumentoActividadGestionEstrategicaSeleccionado, this.auth.obtenerHeaderDocumento());
                  break;
            case 'PROYECTO':
                  modificarDocumentoObservable = this.actividadService.modificarDocumentoProyecto(documento, this.idDocumentoProyectoSeleccionado, this.auth.obtenerHeaderDocumento());
                  break;
            case 'TAREA':
                  modificarDocumentoObservable = this.tareaService.modificarDocumentoTarea(documento, this.idDocumentoTareaSeleccionado, this.auth.obtenerHeaderDocumento());
                  break;
              default:
                  throw new Error(`Tipo de documento no válido: ${tipo}`);
          }

          modificarDocumentoObservable.subscribe(
              () => {
                  this.mostrarMensaje('Archivo cargado correctamente', 'success');
                  this.archivoSeleccionado = null; // Limpiar el archivo seleccionado
                  this.nombreArchivoSeleccionado = ''; // Limpiar el nombre del archivo seleccionado
              },
              error => this.mostrarMensaje('Hubo un error: ' + error.error.mensajeTecnico, 'error')
          );

      } catch (error) {
          this.mostrarMensaje('Hubo un error durante al cargar el archivo', 'error');
      }
    } else {
    throw new Error(`Tipo inválido: ${tipo}`);
    }
  }

  verDocumentos(id: number, tipo: string) {
    if (tipo === 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA' || tipo === 'PROYECTO' || tipo === 'TAREA') {
      this.tipoFormulario = tipo;
      let obtenerDocumentoObservable;
      switch (tipo) {
        case 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA':
          obtenerDocumentoObservable = this.actividadService.obtenerDocumento(id, this.auth.obtenerHeaderDocumento());
          break;
        case 'PROYECTO':
          obtenerDocumentoObservable = this.actividadService.obtenerDocumentoProyecto(id, this.auth.obtenerHeaderDocumento());
          break;
        case 'TAREA':
          obtenerDocumentoObservable = this.tareaService.obtenerDocumentoTarea(id, this.auth.obtenerHeaderDocumento());
          break;
        default:
          obtenerDocumentoObservable = null;
          break;
      }

      if (obtenerDocumentoObservable) {
        obtenerDocumentoObservable.subscribe(
          (data: any) => {
            this.documentoObtenido = data;
          },
          error => this.mostrarMensaje('Hubo un error: ' + error.error.mensajeTecnico, 'error')
          
        );
      } else {
        this.mostrarMensaje('Hubo un error durante al cargar el archivo', 'error');
      }
    } else {
      throw new Error(`Tipo inválido: ${tipo}`);
    }
  }
  eliminarDocumento(documento: any, tipo: string) {
    if (tipo === 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA' || tipo === 'PROYECTO' || tipo === 'TAREA') {
      this.tipoFormulario = tipo;

      this.mensajePregunta('¿Deseas eliminarlo?','eliminado','question')
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
          let id;
          let eliminarDocumentoObservable;
          switch (tipo) {
            case 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA':
              id = documento.idDocumentoActividadGestionEstrategica;
              eliminarDocumentoObservable = this.actividadService.eliminarDocumentoActividadGestionEstrategica(id, this.auth.obtenerHeader());
              break;
            case 'PROYECTO':
              id = documento.idDocumentoProyectoArea;
              eliminarDocumentoObservable = this.actividadService.eliminarDocumentoProyecto(id, this.auth.obtenerHeader());
              break;
            case 'TAREA':
              id = documento.idDocumentoTarea;
              eliminarDocumentoObservable = this.tareaService.eliminarDocumentoTarea(id, this.auth.obtenerHeader());
              break;
            default:
              throw new Error(`Tipo inválido: ${tipo}`);
          }
            eliminarDocumentoObservable.subscribe(
              () => {
                this.mostrarMensajeDocumentoEliminado('Archivo eliminado!!!', 'success');
              },
            );
            this.verDocumentos(id,this.tipoFormulario);
        }
      });
    } else {
      throw new Error(`Tipo inválido: ${tipo}`);
    }

  }
  
  extraerNombreArchivo(rutaArchivo: string): string {
    // Decodificar la URL para manejar códigos de escape
    const nombreArchivoDecodificado = decodeURIComponent(rutaArchivo);
  
    // Buscar la posición de la última '/'
    const posicionUltimaBarra = nombreArchivoDecodificado.lastIndexOf('/');
  
    // Buscar la posición del primer '?' después de la extensión
    const posicionInterrogante = nombreArchivoDecodificado.indexOf('?', posicionUltimaBarra);
  
    // Verificar si se encontró la posición adecuada
    if (posicionUltimaBarra !== -1 && posicionInterrogante !== -1) {
      // Extraer el nombre del archivo
      const nombreArchivo = nombreArchivoDecodificado.substring(posicionUltimaBarra + 1, posicionInterrogante);
      return nombreArchivo;
    } else {
      console.error('No se pudo determinar el nombre del archivo desde la URL:', rutaArchivo);
      return '';
    }
  }

  obtenerActividadGestionEstrategica(idActividadGestionEstrategica: number,gestion:any) {
    this.tipoFormulario = 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA';
    this.idActividadGestionEstrategicaSeleccionado = idActividadGestionEstrategica;

    this.form.patchValue({
      nombre: gestion.nombre,
      fechaInicial: gestion.fechaInicial,
      fechaFinal: gestion.fechaFinal,
      idUsuario: gestion.idUsuario
    });
    this.formObservacion.patchValue({
      id: idActividadGestionEstrategica,
      fecha:  this.obtenerFechaActual(),
    });
  }
  obtenerTarea(idTarea: number,tarea:any) {
    this.tipoFormulario = 'TAREA';
    this.idTareaSeleccionado = idTarea;
    this.nombreTarea = tarea.nombre;
    this.idTareaTipo = tarea.idASE;
    this.periodicidadTarea = tarea.periodicidad;

    this.formModificarEstadoTarea.patchValue({
      estado: tarea.estado,
    });
    this.formModificarPorcentaje.patchValue({
      porcentaje: tarea.porcentajeReal,
    });

    this.formObservacion.patchValue({
      id: idTarea,
      fecha:  this.obtenerFechaActual(),
    });
  }
  obtenerTareaAModificar(idTarea: number,tarea:any) {
    this.idTareaSeleccionado = idTarea;
    this.nombreTarea = tarea.nombre;
    this.idTareaTipo = tarea.idASE;
    

    this.formModificarTarea.patchValue({
      nombre : tarea.nombre,
      descripcion : tarea.descripcion,
      periodicidad : tarea.periodicidad,
      idUsuario : tarea.idUsuario,
    });
  }
  obtenerProyecto(idProyecto: number,proyecto:any) {
    this.tipoFormulario = 'PROYECTO';
    this.idProyectoSeleccionado = idProyecto;
    this.usuarioProyecto = proyecto.idUsuario;

    this.formProyecto.patchValue({
      nombre: proyecto.nombre,
      presupuesto: proyecto.presupuesto,
      fechaInicial: proyecto.fechaInicial,
      fechaFinal: proyecto.fechaFinal,
      modalidad: proyecto.modalidad,
      planeacionSprint: proyecto.planeacionSprint,
      idUsuario: proyecto.idUsuario
    });

    this.formModificarValorEjecutado.patchValue({
      valorEjecutado:  proyecto.valorEjecutado,
    });
    this.formObservacion.patchValue({
      id: idProyecto,
      fecha:  this.obtenerFechaActual(),
    });
  }
  obtenerObservacion(tipo : string,observacion:any) {
    switch (tipo) {
      case 'TAREA':
        this.tipoFormulario = 'TAREA';
        this.idObservacionTareaSeleccionado = observacion.idObservacionTarea;
        this.formModificarObservacion.patchValue({
          descripcion: observacion.descripcion,
        });
        break;
      case 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA':
        this.tipoFormulario = 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA'; 
        this.idObservacionActividadGestionEstrategicaSeleccionado = observacion.idObservacionActividadGestionEstrategica;
        this.formModificarObservacion.patchValue({
          descripcion: observacion.descripcion,
        });
        break;
      case 'PROYECTO':
        this.tipoFormulario = 'PROYECTO';
        this.idObservacionProyectoSeleccionado = observacion.idObservacionProyecto;
        this.formModificarObservacion.patchValue({
          descripcion: observacion.descripcion,
        });
        break;
    }
  }  
  obtenerIdYCarpetaporTipo(tipo: string): { id: number, carpeta: string } {
    let id;
    let carpeta;
    switch (tipo) {
        case 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA':
            id = this.idActividadGestionEstrategicaSeleccionado;
            carpeta = 'actividadGestionEstrategica';
            break;
        case 'PROYECTO':
            id = this.idProyectoSeleccionado;
            carpeta = 'proyecto';
            break;
        case 'TAREA':
            id = this.idTareaSeleccionado;
            carpeta = 'tarea';
            break;
        default:
            throw new Error(`Tipo inválido: ${tipo}`);
    }
    return { id: id, carpeta: carpeta };
  }
  obtenerDocumento(documento:any, tipo:string){
    tipo = this.tipoFormulario;
    switch (tipo) {
      case 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA':
        this.idDocumentoActividadGestionEstrategicaSeleccionado = documento.idDocumentoActividadGestionEstrategica;
        this.idActividadGestionEstrategicaSeleccionado = documento.idActividadGestionEstrategica;
          break;
      case 'PROYECTO':
        this.idDocumentoProyectoSeleccionado = documento.idDocumentoProyecto;
        this.idProyectoSeleccionado = documento.idProyecto;
          break;
      case 'TAREA':
        this.idDocumentoTareaSeleccionado = documento.idDocumentoTarea;
        this.idTareaSeleccionado = documento.idTarea;
          break;
      default:
          throw new Error(`No se obtuvo el documento: ${tipo}`);
    }
    this.nombreArchivoSeleccionado =  documento.rutaDocumento;
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
  colorPorcentajeDependiendoFechaInicial(porcentaje: number, fechaInicial: Date): string {
    const fechaActual = new Date();
    const fechaInicioActividad = new Date(fechaInicial);
    if (fechaInicioActividad  > fechaActual) {
      return 'porcentaje-negro'; // Define las clases CSS para cuando la fecha es posterior a la fecha actual.
    } else {
      if (porcentaje < 80 ) {
        return 'porcentaje-bajo'; // Define las clases CSS para porcentajes bajos en tu archivo de estilos.
      } else if (porcentaje >= 80 && porcentaje < 100) {
        return 'porcentaje-medio'; // Define las clases CSS para porcentajes normales en tu archivo de estilos.
      } else {
        return 'porcentaje-cien';
      }
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
  swalError(error: any) {
    Swal.fire(
      {
        title:"Error!!!",
        text:error.error.mensajeTecnico, 
        icon:"error",
        confirmButtonColor: '#0E823F',
      }
    );
  } 
  mensajePregunta(pregunta: string,metodo :string, tipo: 'question' | 'error') {
    return Swal.fire({
      title: tipo === 'question' ? pregunta : 'Hubo un error!!!',
      icon: tipo,
      text: "Una vez " + metodo + ", NO podrás recuperarlo.",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
      confirmButtonColor: '#0E823F',
      reverseButtons: true,
    });
  }
  mostrarMensaje(mensaje: string, tipo: 'success' | 'error') {
    Swal.fire({
        title: tipo === 'success' ? mensaje : 'Hubo un error!!!',
        icon: tipo,
        confirmButtonColor: '#0E823F',
        position: "center",
        showConfirmButton: false,
        timer: 2000
    });
  }
  mostrarMensajeDocumentoEliminado(mensaje: string, tipo: 'success' | 'error') {
    Swal.fire({
        title: tipo === 'success' ? mensaje : 'Hubo un error!!!',
        icon: tipo,
        confirmButtonColor: '#0E823F',
        iconHtml: '<i class="bi bi-trash"></i>',
        position: "center",
        showConfirmButton: false,
        timer: 1500
    });
  }

  get nombreVacio(){
    return this.formTarea.get('nombre')?.invalid && this.formTarea.get('nombre')?.touched;
  }
  get descripcionVacio(){
    return this.formTarea.get('descripcion')?.invalid && this.formTarea.get('descripcion')?.touched;
  }
  get descripcionMinimoCaracteres() {
    return this.formTarea.get('descripcion')?.hasError('maxCharacters');
  }
  get descripcionModificarTareaMinimoCaracteres() {
    return this.formModificarTarea.get('descripcion')?.hasError('maxCharacters');
  }
  get periodicidadVacio(){
    return this.formTarea.get('periodicidad')?.invalid && this.formTarea.get('periodicidad')?.touched;
  }
  get idUsuarioVacio(){
    return this.formTarea.get('idUsuario')?.invalid && this.formTarea.get('idUsuario')?.touched;
  }
  get descripcionObservacionVacio(){
    return this.formObservacion.get('descripcion')?.invalid && this.formObservacion.get('descripcion')?.touched;
  }
  get fechaVacio(){
    return this.formObservacion.get('fecha')?.invalid && this.formObservacion.get('fecha')?.touched;
  }
  
}
