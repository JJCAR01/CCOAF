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

@Component({
  selector: 'app-listar',
  templateUrl: './actividad.listar.component.html',
  styleUrls: ['./actividad.listar.component.scss']
})
export class ActividadListarComponent implements OnInit{
  title = 'listarActividad';
  ESTE_CAMPO_ES_OBLIGARORIO: string = 'Este campo es obligatorio*';
  tipoFormulario: 'PROYECTO' | 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA' | 'TAREA' = 'PROYECTO';
  pesoDeArchivo = 300 * 1024 * 1024; // 300 MB
  extencionesPermitidas = /\.(doc|docx|xls|xlsx|ppt|pptx|zip|pdf)$/i;
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
  idUsuarioSeleccionado: any | 0 = 0;
  idActividadEstrategica:number | 0 = 0;
  porcentajeEstrategica:any;
  usuarioEstrategica:any;
  patEstrategica:number | 0 =0;
  idActividadGestionEstrategicaSeleccionado:number | 0 = 0;
  nombreActividadGestion:any;
  fechaInicialGestion:any;
  fechaFinalGestion:any;
  idProyectoSeleccionado:number | 0 = 0;
  nombreProyecto:any;
  presupuestoProyecto:any;
  fechaInicialProyecto:any;
  fechaFinalProyecto:any;
  modalidadProyecto:any;
  planeacionProyecto:any;
  idTareaSeleccionado:number | 0 = 0;
  nombreTarea:any;
  estadoTarea:any;
  idTareaTipo:number | 0 = 0;
  periodicidadTarea:any;
  porcentajeTarea:any;
  form:FormGroup;
  formProyecto:FormGroup;
  formModificarEstadoTarea:FormGroup;
  formModificarPorcentaje:FormGroup;
  formTarea:FormGroup;
  formModificarTarea:FormGroup;
  formObservacion:FormGroup;
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
    });
    this.formModificarEstadoTarea = this.formBuilder.group({
      estado: ['', Validators.required],
    });
    this.formModificarPorcentaje = this.formBuilder.group({
      porcentajeReal: ['', Validators.required],
    });
    this.formObservacion = this.formBuilder.group({
      id: ['', Validators.required],
      fecha: [this.obtenerFechaActual(), Validators.required],
      nombre: ['', Validators.required],
    });
    this.formTarea = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      periodicidad: ['', Validators.required],
      idUsuario: ['', Validators.required],
    });
    this.formModificarTarea = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      periodicidad: ['', Validators.required],
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
        this.porcentajeEstrategica = data.porcentajeReal;
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
        this.usuarios = data;
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

  eliminarGestion(idActividadGestionActividadEstrategica: number) {

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
          () => {
            this.swalSatisfactorio('eliminado','actividad de gestión')
              this.cargarGestiones(this.idActividadEstrategica)
          },
          (error) => {this.swalError(error);}
        );
      }
      });
  }
  eliminarProyecto(idProyecto: number) {

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
          () => {
            this.swalSatisfactorio('eliminado','proyecto')
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
          this.actividadService.modificarActividadGestionActividadEstrategica(actividadGestion, this.idActividadGestionEstrategicaSeleccionado, this.auth.obtenerHeader())
            .subscribe(
              () => {
                this.swalSatisfactorio('modificado','actividad de gestión')
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
              this.swalSatisfactorio('modificado','proyecto')
                this.cargarProyectos(this.idActividadEstrategica)
            },
            (error) => {this.swalError(error);}
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
  cargarObservaciones(id:any,tipo:string) {
    if(tipo === 'TAREA'){
      this.tareaService
        .listarPorIdTarea(id,this.auth.obtenerHeader()) .subscribe(
          (data: any) => {
            this.observaciones = data;
          },
        )
    } else if( tipo === 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA'){
      this.actividadService
        .listarObservacionPorIdActividadGestionActividadEstrategica(id,this.auth.obtenerHeader()) .subscribe(
          (data: any) => {
            this.observaciones = data;
          },
        )
    } else if (tipo === 'PROYECTO'){
      this.actividadService
        .listarObservacionPorIdProyecto(id,this.auth.obtenerHeader()) .subscribe(
          (data: any) => {
            this.observaciones = data;
          },
        )
    }

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
            this.swalSatisfactorio('creado','tarea')
              this.cargarTareas(this.idActividadGestionEstrategicaSeleccionado,'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA')
              this.formTarea.reset()
              this.cargarGestiones(this.idActividadEstrategica)
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
      const nombre = this.formObservacion.get('nombre')?.value;
      if(this.tipoFormulario === 'TAREA'){
        const observacion = {
          idTarea: this.idTareaSeleccionado,
          nombre: nombre,
          fecha: fecha,
        };
        this.tareaService
          .crearObservacion(observacion,this.auth.obtenerHeader())
          .subscribe(
            (response) => {
                this.swalSatisfactorio('creado','observación')
                this.formObservacion.reset()
            },
            (error) => {this.swalError(error);}
          );
      } else if( this.tipoFormulario === 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA'){
        const observacion = {
          idActividadGestionEstrategica: this.idActividadGestionEstrategicaSeleccionado,
          nombre: nombre,
          fecha: fecha,
        };
        this.actividadService
          .crearObservacionActividadGestionActividadEstrategica(observacion,this.auth.obtenerHeader())
          .subscribe(
            (response) => {
                this.swalSatisfactorio('creado','observación')
                this.formObservacion.reset()
            },
            (error) => {this.swalError(error);}
          );
      } else if (this.tipoFormulario === 'PROYECTO'){;
        const observacion = {
          idProyecto: this.idProyectoSeleccionado,
          nombre: nombre,
          fecha: fecha,
        };
        this.actividadService
          .crearObservacionProyecto(observacion,this.auth.obtenerHeader())
          .subscribe(
            (response) => {
                this.swalSatisfactorio('creado','observación')
                this.formObservacion.reset()
            },
            (error) => {this.swalError(error);}
          );
      }
    } else {
      return this.formObservacion.markAllAsTouched();
    }     
  }
  modificarEstado() {
    if (this.formModificarEstadoTarea.valid) {
      const estado = this.formModificarEstadoTarea.get('estado')?.value;
      const tareaModificar = {
        estado: estado,
      };
      Swal.fire({
        title: "¿Deseas modificarlo?",
        text: "Una vez modificado no podrás revertir los cambios",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true, 
      })
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
          this.tareaService.modificarEstadoTarea(tareaModificar, this.idTareaSeleccionado,this.auth.obtenerHeader()).subscribe(
              () => {
                this.swalSatisfactorio('modificado','estado de la tarea')
                  this.cargarGestiones(this.idActividadEstrategica);
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
      Swal.fire({
        title: "¿Deseas modificarlo?",
        text: "Una vez modificado no podrás revertir los cambios",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true, 
      })
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
          this.tareaService.modificarPorcentajeTarea(tareaModificar, this.idTareaSeleccionado,this.auth.obtenerHeader()).subscribe(
              (response) => {
                this.swalSatisfactorio('modificado','porcentaje de la tarea')
                  this.cargarGestiones(this.idActividadEstrategica);
                    this.cargarTareas(this.idTareaTipo,'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA');
                    this.formTarea.reset();              
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
      Swal.fire({
        title: "¿Deseas modificarlo?",
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
                this.swalSatisfactorio('modificado','tarea')
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
          () => {
            this.swalSatisfactorio('eliminado','tarea')
            this.cargarTareas(idActividadGestionActividadEstrategica,'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA')
          },
          (error) => {this.swalError(error);}
        );
      }
      });
  }
  async documento(event: any, idActividadGestionSeleccionado: number): Promise<void> {
    this.idActividadGestionEstrategicaSeleccionado = idActividadGestionSeleccionado;
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
  }
  abrirModalAgregarDocumento(idSeleccionado: number,tipo:string): void {
    if(tipo === 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA'){
      this.idActividadGestionEstrategicaSeleccionado = idSeleccionado;
    } else if( tipo === 'PROYECTO'){
      this.idProyectoSeleccionado = idSeleccionado;
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
  async subirDocumento(formulario: any,id:number,tipo:string) {

    if (!this.archivoSeleccionado) {
      // Puedes mostrar un mensaje de error o manejarlo de otra manera
      return;
    }
      try {
        const app = initializeApp(environment.firebase);
        const storage = getStorage(app);
        const storageRef = ref(storage, `${tipo}/${id}/${this.archivoSeleccionado.name}`);
        const snapshot = await uploadBytes(storageRef, this.archivoSeleccionado);
        const downloadURL = await getDownloadURL(storageRef);
        // Crear un objeto sprint que incluya la URL de descarga
        const documento = {
          fecha:this.obtenerFechaActual(),
          rutaDocumento: downloadURL, // Asegúrate de que el nombre de la propiedad coincida con lo que espera tu backend
        };
        if(tipo === 'actividadGestionEstrategica'){
          this.actividadService.guardarDocumento(documento, this.idActividadGestionEstrategicaSeleccionado, this.auth.obtenerHeaderDocumento()).subscribe(
            (data: any) => {
              Swal.fire({
                title:'Archivo cargado!',
                text:'El archivo se cargó correctamente',
                icon:'success',
                confirmButtonColor: '#0E823F',
              })
              this.nombreArchivoSeleccionado = ''; 
            },
            (error) => {
              Swal.fire({
                title:'Hubo un error!!!',
                text:error.error.mensajeTecnico,
                icon:'error',
                confirmButtonColor: '#0E823F',
              })
            }
          );
        } else if (tipo === 'proyecto'){
          this.actividadService.guardarDocumentoProyecto(documento, this.idProyectoSeleccionado, this.auth.obtenerHeaderDocumento()).subscribe(
            (data: any) => {
              Swal.fire({
                title:'Archivo cargado!',
                text:'El archivo se cargó correctamente',
                icon:'success',
                confirmButtonColor: '#0E823F',
              })
              this.nombreArchivoSeleccionado = ''; 
            },
            (error) => {
              Swal.fire({
                title:'Hubo un error!!!',
                text:error.error.mensajeTecnico,
                icon:'error',
                confirmButtonColor: '#0E823F',
              })
            }
        );
        }
        
    } catch (error) {
      Swal.fire({
        title:'Hubo un error!!!',
        text:'Error durante la subida del archivo',
        icon:'error',
        confirmButtonColor: '#0E823F',
      })
    }
  }
  obtenerDocumento(id: number,tipo: string) {

    if(tipo === 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA'){
      this.actividadService.obtenerDocumento(id, this.auth.obtenerHeaderDocumento()).subscribe(
        (data: any) => {
          this.documentoObtenido = data;
        },
        (error: any) => {
          Swal.fire({
            title: 'La actividad no tiene documentos adjuntos',
            text: 'Cargue un documento para visualizarlo',
            icon: 'info',
            confirmButtonColor: '#0E823F',
          });
        }
      );
    } else if(tipo === 'PROYECTO'){
      this.actividadService.obtenerDocumentoProyecto(id, this.auth.obtenerHeaderDocumento()).subscribe(
        (data: any) => {
          this.documentoObtenido = data;
        },
        (error: any) => {
          Swal.fire({
            title: 'La actividad no tiene documentos adjuntos',
            text: 'Cargue un documento para visualizarlo',
            icon: 'info',
            confirmButtonColor: '#0E823F',
          });
        }
      );
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
      planeacionSprint: proyecto.planeacionSprint
    });
    this.formObservacion.patchValue({
      id: idProyecto,
      fecha:  this.obtenerFechaActual(),
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
  colorPorcentajeDependiendoFechaInicial(porcentaje: number, fechaInicial: Date): string {
    const fechaActual = new Date();
    const fechaInicioActividad = new Date(fechaInicial);
    if (fechaInicioActividad  > fechaActual) {
      return 'porcentaje-negro'; // Define las clases CSS para cuando la fecha es posterior a la fecha actual.
    } else {
      if (porcentaje < 30) {
        return 'porcentaje-bajo'; // Define las clases CSS para porcentajes bajos en tu archivo de estilos.
      } else if (porcentaje >= 30 && porcentaje < 100) {
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

  swalSatisfactorio(metodo: string, tipo:string) {
    Swal.fire({
      title: `Se ha ${metodo}.`,
      text: `El ${tipo} se ha ${metodo}!!`,
      icon:'success',
      confirmButtonColor: '#0E823F',
    }
    );
  }
  swalError(error: any) {
    Swal.fire(
      {
        title:"Error!!!",
        text:error.error.mensajeHumano, 
        icon:"error",
        confirmButtonColor: '#0E823F',
      }
    );
  } 

  get nombreVacio(){
    return this.formTarea.get('nombre')?.invalid && this.formTarea.get('nombre')?.touched;
  }
  get descripcionVacio(){
    return this.formTarea.get('descripcion')?.invalid && this.formTarea.get('descripcion')?.touched;
  }
  get periodicidadVacio(){
    return this.formTarea.get('periodicidad')?.invalid && this.formTarea.get('periodicidad')?.touched;
  }
  get idUsuarioVacio(){
    return this.formTarea.get('idUsuario')?.invalid && this.formTarea.get('idUsuario')?.touched;
  }
  get nombreObservacionVacio(){
    return this.formObservacion.get('nombre')?.invalid && this.formObservacion.get('nombre')?.touched;
  }
  get fechaVacio(){
    return this.formObservacion.get('fecha')?.invalid && this.formObservacion.get('fecha')?.touched;
  }
  
}
