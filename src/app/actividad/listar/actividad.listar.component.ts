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
import { ObservacionService } from 'src/app/observacion/services/observacion.service';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.development';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

@Component({
  selector: 'app-listar',
  templateUrl: './actividad.listar.component.html',
  styleUrls: ['./actividad.listar.component.scss']
})
export class ActividadListarComponent implements OnInit{
  title = 'listarActividad';
  pesoDeArchivo = 300 * 1024 * 1024; // 300 MB
  extencionesPermitidas = /\.(doc|docx|xls|xlsx|ppt|pptx|zip|pdf)$/i;
  nombreArchivoSeleccionado: string = '';
  archivoSeleccionado: File | null = null;
  documentoObtenido:any;
  modalidadEnumList: string[] = [];
  planeacionEnumList = Object.values(EPlaneacion);
  estadoEnumList: string[] = [];
  periodiciadEnumLista: string[] = [];
  gestiones: any[] = [];
  proyectos: any[] = [];
  actividades: any[] = [];
  usuarios:any[] =[];
  tareas:any[] =[];
  observaciones:any[] =[];
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
    private observacionService: ObservacionService,
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
    this.formModificarEstadoTarea = this.formBuilder.group({
      estado: ['', Validators.required],
    });
    this.formModificarPorcentaje = this.formBuilder.group({
      porcentaje: ['', Validators.required],
    });
    this.formObservacion = this.formBuilder.group({
      idTarea: ['', Validators.required],
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
    },
      (error) => {
        Swal.fire('Error', error.error.mensajeTecnico,'error');
      }
    );
  }

  cargarGestiones(idActividadEstrategica: number) {
    this.actividadService
      .listarActividadGestionActividadEstrategicaPorIdActividadEstrategica(idActividadEstrategica, this.auth.obtenerHeader()) // Debes tener un método en tu servicio para listar gestiones por idPat
      .toPromise()
      .then(
        (data: any) => {
          this.gestiones = data;
        },
        (error) => {this.swalError(error);}
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
        (error) => {this.swalError(error);}
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
  cargarObservaciones(idTarea:any) {
    this.observacionService
      .listarTareaPorTarea(idTarea,this.auth.obtenerHeader()) 
      .toPromise()
      .then(
        (data: any) => {
        this.observaciones = data;
        },
        (error) => {
          Swal.fire('Error',error.error.mensajeHumano,'error');
        }
    )
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
        idASE: this.idActividadGestionSeleccionado,
        idUsuario: idUsuario,
      };
      this.tareaService
        .crearTarea(tarea,this.auth.obtenerHeader())
        .subscribe(
          () => {
            this.swalSatisfactorio('creado','tarea')
              this.cargarTareas(this.idActividadGestionSeleccionado,'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA')
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
      const idTarea = this.idTareaSeleccionado;

      const observacion = {
        idTarea: idTarea,
        nombre: nombre,
        fecha: fecha,
      };
      this.observacionService
        .crearObservacion(observacion,this.auth.obtenerHeader())
        .subscribe(
          () => {
            this.swalSatisfactorio('creado','observación')
              this.formObservacion.reset()
          },
          (error) => {this.swalError(error);}
        );
    } else {
      return this.form.markAllAsTouched();
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
      const porcentaje = this.formModificarPorcentaje.get('porcentaje')?.value;
      const tareaModificar = {
        porcentaje: porcentaje,
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
    this.idActividadGestionSeleccionado = idActividadGestionSeleccionado;
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
  abrirModalAgregarDocumento(idActividadGestionActividadEstrategica: number): void {
    this.idActividadGestionSeleccionado = idActividadGestionActividadEstrategica;
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
  async subirDocumento(formulario: any) {
    if (!this.archivoSeleccionado) {
      // Puedes mostrar un mensaje de error o manejarlo de otra manera
      return;
    }
      try {
        const app = initializeApp(environment.firebase);
        const storage = getStorage(app);
        const storageRef = ref(storage, `actividadGestionActividadEstrategica/${this.idActividadGestionSeleccionado}/${this.archivoSeleccionado.name}`);
        const snapshot = await uploadBytes(storageRef, this.archivoSeleccionado);
        const downloadURL = await getDownloadURL(storageRef);
        // Crear un objeto sprint que incluya la URL de descarga
        const documento = {
          rutaDocumento: downloadURL, // Asegúrate de que el nombre de la propiedad coincida con lo que espera tu backend
        };
        this.actividadService.guardarDocumento(documento, this.idActividadGestionSeleccionado, this.auth.obtenerHeaderDocumento()).subscribe(
          (data: any) => {
            Swal.fire({
              title:'Archivo cargado!',
              text:'El archivo se cargó correctamente',
              icon:'success',
              confirmButtonColor: '#0E823F',
            })
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
    } catch (error) {
      Swal.fire({
        title:'Hubo un error!!!',
        text:'Error durante la subida del archivo',
        icon:'error',
        confirmButtonColor: '#0E823F',
      })
    }
  }
  obtenerDocumento(idActividadGestionActividadEstrategica: number) {

    this.actividadService.obtenerDocumento(idActividadGestionActividadEstrategica, this.auth.obtenerHeaderDocumento()).subscribe(
      (data: any) => {
        this.documentoObtenido = data;
  
        // Verificar si this.documentoObtenido.rutaArchivo existe
        if (this.documentoObtenido.rutaDocumento) {
          // Extraer el nombre del archivo de la URL
          const nombreArchivo = this.extraerNombreArchivo(this.documentoObtenido.rutaDocumento);

          // Crear un enlace HTML
          const enlaceHTML = `<a href="${this.documentoObtenido.rutaDocumento}" target="_blank">${nombreArchivo}</a>`;

          Swal.fire({
            title: 'Documento correspondiente a la actividad',
            html: `Para previsualizar darle click al enlace: ${enlaceHTML}`,
            confirmButtonColor: '#0E823F',
            icon:'success'
          });
        }
      },
      (error: any) => {
        Swal.fire({
          title: 'Este sprint no tiene documentos adjuntos',
          text: 'Cargue un documento para visualizarlo',
          icon: 'info',
          confirmButtonColor: '#0E823F',
        });
      }
    );
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
    this.estadoTarea = tarea.estado;
    this.porcentajeTarea = tarea.porcentaje;
    this.periodicidadTarea = tarea.periodicidad;

    this.formModificarEstadoTarea.patchValue({
      estado: this.estadoTarea,
    });
    this.formModificarPorcentaje.patchValue({
      porcentaje: this.estadoTarea,
    });

    this.formObservacion.patchValue({
      idTarea: this.idTareaSeleccionado,
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
  swalSatisfactorio(metodo: string, tipo:string) {
    Swal.fire({
      title: `Se ha ${metodo}.`,
      text: `El ${tipo} se ha ${metodo}!!`,
      icon:'success',
      confirmButtonColor: '#0E823F',
    }
    );
    this.form.reset();
    this.formProyecto.reset();
    this.formModificarEstadoTarea.reset();
    this.formModificarPorcentaje.reset();
    this.formObservacion.reset();
    this.formTarea.reset();
    this.formModificarTarea.reset();
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
