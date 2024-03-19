import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { AuthService } from 'src/app/login/auth/auth.service';
import { ObservacionService } from 'src/app/observacion/services/observacion.service';
import { TareaService } from 'src/app/tarea/services/tarea.service';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { EEstado } from 'src/enums/eestado';
import { EPeriodicidad } from 'src/enums/eperiodicidad';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { ServicesSprintProyectoAreaService } from '../services/services.sprintproyectoarea.service';
import { TipoGEService } from 'src/app/gestion/services/tipoGE.service';
import { MENSAJE_TITULO } from 'src/app/utilitarios/mensaje/mensajetitulo';
import { Usuario } from 'src/app/modelo/usuario';

@Component({
  selector: 'app-listar.sprintproyectoarea',
  templateUrl: './listar.sprintproyectoarea.component.html',
  styleUrls: ['./listar.sprintproyectoarea.component.scss']
})
export class ListarSprintproyectoareaComponent implements OnInit  {
  title = 'listarSprintProyectoArea';
  CAMPO_OBLIGATORIO = MENSAJE_TITULO.CAMPO_OBLIGATORIO;
  NOMBRE_SPRINT = MENSAJE_TITULO.NOMBRE_SPRINT_PROYECTO_AREA;
  NOMBRE_TAREA = MENSAJE_TITULO.NOMBRE_TAREA_SPRINT_PROYECTO_AREA;
  FECHA_INICIAL_SPRINT = MENSAJE_TITULO.FECHA_INICIAL_SPRINT_PROYECTO_AREA;
  FECHA_FINAL_SPRINT = MENSAJE_TITULO.FECHA_FINAL_SPRINT_PROYECTO_AREA;
  AVANCE_REAL_SPRINT = MENSAJE_TITULO.AVANCE_REAL_SPRINT;
  AVANCE_REAL_TAREA = MENSAJE_TITULO.AVANCE_REAL_TAREA;
  AVANCE_ESPERADO=  MENSAJE_TITULO.AVANCE_ESPERADO;
  CUMPLIMIENTO=  MENSAJE_TITULO.CUMPLIMIENTO;
  ACCIONES =  MENSAJE_TITULO.ACCIONES;
  RESPONSABLE_TAREA = MENSAJE_TITULO.RESPONSABLE_TAREA;
  PERIODICIDAD = MENSAJE_TITULO.PERIODICIDAD_TAREA;
  ESTADO = MENSAJE_TITULO.ESTADO_TAREA;
  DESCRIPCION = MENSAJE_TITULO.DESCRIPCION_TAREA;

  esAdmin: boolean = false; 
  esDirector: boolean = false; 
  esOperador: boolean = false; // Agrega esta línea
  esOperadorEditor: boolean = false;
  esConsultor:boolean = false;

  tipoFormulario: 'SPRINT_PROYECTO_AREA' | 'TAREA' = 'SPRINT_PROYECTO_AREA';
  pesoDeArchivo = 300 * 1024 * 1024; // 300 MB
  extencionesPermitidas = /\.(doc|docx|xls|xlsx|ppt|pptx|zip|pdf)$/i;
  idObservacionSprintProyectoAreaSeleccionado: number = 0;
  idObservacionTareaSeleccionado: number = 0;
  nombreArchivoSeleccionado: string = '';
  archivoSeleccionado: File | null = null;
  estadoEnumList: string[] = [];
  periodiciadEnumLista: string[] = [];
  sprints: any[] = [];
  proyectos: any[] = [];
  tareas:any[] =[];
  usuarios:Usuario[] =[];
  observaciones:any[] =[];
  documentoObtenido: any [] = [];
  patNombre:any;
  nombreSprint:any;
  totalSprint:any;
  planeacionSprint:any;
  proyectoNombre:any;
  proyectoPorcentaje:any;
  proyectoUsuario:any;
  idProyectoArea:number = 0;
  idPat:number = 0;
  idSprintSeleccionado:number = 0;
  idTareaSeleccionado:any;
  nombreTarea:any;
  periodicidadTarea:any;
  porcentajeTarea:any;
  idTareaTipo:number = 0;
  estadoTarea:any;
  collapseSeleccionado : number | null = null;
  formSprint:FormGroup;
  formModificarEstadoTarea:FormGroup;
  formModificarPorcentaje:FormGroup;
  formTarea:FormGroup;
  formModificarTarea:FormGroup;
  formObservacion:FormGroup;
  formModificarObservacion:FormGroup;

  constructor(
    private sprintService: ServicesSprintProyectoAreaService,
    private auth: AuthService,
    private gestionService: TipoGEService,
    private route: ActivatedRoute,
    private usuarioService :UsuarioService,
    private formBuilder: FormBuilder,
    private tareaService: TareaService,
    private observacionService: ObservacionService,

  ) { 
    this.formSprint = this.formBuilder.group({
      descripcion: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
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
      descripcion: ['', Validators.required],
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
    // Obtén el valor de idPat de la URL
    this.route.params.subscribe(params => {
      this.patNombre = params['patNombre'];
      const idProyectoArea = params['idProyectoArea'];
      this.gestionService.listarProyectoAreaPorId(idProyectoArea,this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.proyectoNombre = data.nombre,
          this.proyectoPorcentaje = data.porcentajeReal,
          this.proyectoUsuario = data.idUsuario,
          this.idProyectoArea = data.idProyectoArea,
          this.idPat = data.idPat,
          this.totalSprint = data.totalSprint,
          this.planeacionSprint = data.planeacionSprint
        }
      );
      this.cargarSprints(idProyectoArea);
    });
    this.cargarUsuario();
    this.crearTarea();
    this.estadoEnumList = Object.values(EEstado);
    this.periodiciadEnumLista = Object.values(EPeriodicidad);
  }



  async documento(event: any, idSprintSeleccionado: number): Promise<void> {
    this.idSprintSeleccionado = idSprintSeleccionado;
    this.archivoSeleccionado = event.target.files[0];
  
    try {
      await this.validarArchivo();
      // Actualizar el nombre del archivo seleccionado
      this.nombreArchivoSeleccionado = this.archivoSeleccionado ? this.archivoSeleccionado.name : '';
      // Resto del código si la validación es exitosa
    } catch (error) {
      // Mostrar un mensaje de error o tomar alguna acción si la validación falla
      console.error(error);
      this.archivoSeleccionado = null;
      this.nombreArchivoSeleccionado = '';
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
  async subirDocumento(formulario: any) {
    if (!this.archivoSeleccionado) {
      // Puedes mostrar un mensaje de error o manejarlo de otra manera
      return;
    }

    const app = initializeApp(environment.firebase);
    const storage = getStorage(app);
    const storageRef = ref(storage, `sprintProyectoArea/${this.idSprintSeleccionado}/${this.archivoSeleccionado.name}`);

      try {
        const snapshot = await uploadBytes(storageRef, this.archivoSeleccionado);
        const downloadURL = await getDownloadURL(storageRef);

        // Crear un objeto sprint que incluya la URL de descarga
        const sprint = {
          fecha:this.obtenerFechaActual(),
          rutaDocumento: downloadURL, // Asegúrate de que el nombre de la propiedad coincida con lo que espera tu backend
        };
        debugger
        this.sprintService.guardarDocumentoSprintProyectoArea(sprint, this.idSprintSeleccionado, this.auth.obtenerHeaderDocumento()).subscribe(
            (data: any) => {
              Swal.fire({
                title:'Archivo subido!!!',
                text:'El archivo se cargo correctamente',
                icon:'success',
                confirmButtonColor: '#0E823F',
              })
              this.nombreArchivoSeleccionado = ''; 
            },
            (error) => {
              Swal.fire({
                title:'Hubo un error!!!',
                text:error.error.mensajeHumano,
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
  obtenerDocumento(idSprint: number) {
    this.sprintService.obtenerDocumento(idSprint, this.auth.obtenerHeaderDocumento()).subscribe(
      (data: any) => {
        this.documentoObtenido = data;
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
  
  

  abrirModalAgregarDocumento(idSprint: number): void {
    this.idSprintSeleccionado = idSprint;
  }

  cargarUsuario() {
    this.usuarioService.listarUsuario(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.usuarios = data.sort((a:any, b:any) => a.nombre.localeCompare(b.nombre));
    });
  }


  cargarSprints(idProyecto: number) {
    // Utiliza idPat en tu solicitud para cargar las epicas relacionadas
    this.sprintService
      .listarSprintProyectoAreaPorProyecto(idProyecto, this.auth.obtenerHeader()) // Debes tener un método en tu servicio para listar epicas por idPat
      .toPromise()
      .then(
        (data: any) => {
          this.sprints = data;
        },
        (error) => {this.swalError(error);}
      );
  }
  modificarSprint(){
    if (this.formSprint.valid) {
      const descripcion = this.formSprint.get('descripcion')?.value;
      const fechaInicial = this.formSprint.get('fechaInicial')?.value;
      const fechaFinal = this.formSprint.get('fechaFinal')?.value;

      const sprint = {
        descripcion: descripcion,
        fechaInicial: fechaInicial,
        fechaFinal: fechaFinal, 
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
          this.sprintService.modificarSprintProyectoArea(sprint, this.idSprintSeleccionado, this.auth.obtenerHeader())
          .subscribe(
            (response) => {
              this.swalSatisfactorio('modificado','sprint')
                this.cargarSprints(this.idProyectoArea)
            },
            (error) => {this.swalError(error);}
        );
        }
      })
    }
  }

  eliminarSprint(idSprint: number) {
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
        this.sprintService.eliminarSprintProyectoArea(idSprint, this.auth.obtenerHeader()).subscribe(
          (response) => {
            this.swalSatisfactorio('eliminado','sprint')
              this.cargarSprints(this.idProyectoArea)
          },
          (error) => {this.swalError(error);}
        );
      }
    });
  }

  cargarTareas(idASE: any, tipoASE: any) {
    // Si se hace clic en la misma gestión, la cerramos
    if (this.collapseSeleccionado === idASE) {
    this.collapseSeleccionado = null;
    } else {
      this.collapseSeleccionado = idASE;
      if(tipoASE === 'SPRINT_PROYECTO_AREA'){
        this.tareaService
        .listarTareaPorSprintProyectoArea(idASE,this.auth.obtenerHeader()) 
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
          },
        )
    } else if( tipo === 'SPRINT_PROYECTO_AREA'){
      this.sprintService
        .listarPorIdSprintProyectoArea(id,this.auth.obtenerHeader()) .subscribe(
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
      const idASE = this.idSprintSeleccionado;
      
      const tarea = {
        nombre: nombre,
        descripcion: descripcion,
        estado: EEstado.EN_BACKLOG,
        periodicidad: periodicidad,
        tipoASE: 'SPRINT_PROYECTO_AREA',
        idASE: idASE,
        idUsuario: idUsuario,
      };
      this.tareaService
        .crearTarea(tarea,this.auth.obtenerHeader())
        .subscribe(
          (response) => {
            this.swalSatisfactorio('creada','tarea')
              this.cargarTareas(this.idSprintSeleccionado,'SPRINT_PROYECTO_AREA');
              this.formTarea.reset();
          },
          (error) => {this.swalError(error);}
        );
    } else {
      return this.formTarea.markAllAsTouched();
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
                this.swalSatisfactorio('creado','observación')
                this.formObservacion.reset()
            },
            (error) => {this.swalError(error);}
          );
      } else if( this.tipoFormulario === 'SPRINT_PROYECTO_AREA'){
        const observacion = {
          idSprintProyectoArea: this.idSprintSeleccionado,
          descripcion: descripcion,
          fecha: fecha,
        };
        this.sprintService
          .crearObservacionSprintProyectoArea(observacion,this.auth.obtenerHeader())
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
  modificarObservacion(tipo: string) {
    if (this.formModificarObservacion.valid) {
      const descripcion = this.formModificarObservacion.get('descripcion')?.value;
      const observacion = {
        descripcion: descripcion,
      }
      Swal.fire({
        icon: "question",
        title: "¿Estás seguro de modificar?",
        text: "Una vez modificado no podrás revertir los cambios",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true,
      })
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
          switch (tipo) {
            case 'TAREA':
              this.tareaService.modificarObservacionTarea(observacion, this.idObservacionTareaSeleccionado, this.auth.obtenerHeader()).subscribe(
                () => {
                  this.swalSatisfactorio('modificado', 'tarea');
                },
                (error) => {
                  this.swalError(error);
                }
              );
              break;
            case 'SPRINT_PROYECTO_AREA':
              this.sprintService.modificarObservacionSprintProyectoArea(observacion, this.idObservacionSprintProyectoAreaSeleccionado, this.auth.obtenerHeader()).subscribe(
                () => {
                  this.swalSatisfactorio('modificado', 'actividad estratégica');
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
              (response) => {
                this.swalSatisfactorio ('modificado','estado del área')
                  this.cargarTareas(this.idTareaTipo,'SPRINT_PROYECTO_AREA');
                  this.formModificarEstadoTarea.reset();              
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
                this.swalSatisfactorio('modificado','porcentaje del área')
                  this.cargarTareas(this.idTareaTipo,'SPRINT_PROYECTO_AREA');
                  this.formModificarPorcentaje.reset();             
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
                  this.cargarTareas(this.idTareaTipo,'SPRINT_PROYECTO_AREA');
                  this.formModificarTarea.reset();               
              },
              (error) => {this.swalError(error);}
            );
        } 
      });
    }
  }
  eliminarTarea(idTarea: number, idSprint: number) {
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
            this.swalSatisfactorio('eliminado','tarea')
            this.cargarTareas(idSprint,'SPRINT');
          },
          (error) => {this.swalError(error);}
        );
      }
      });
  }
  obtenerSprint(idSprintProyectoArea: number,sprint:any) {
    this.tipoFormulario = 'SPRINT_PROYECTO_AREA';
    this.idSprintSeleccionado = idSprintProyectoArea;
     
    this.formSprint.patchValue({
      descripcion : sprint.descripcion,
      fechaInicial : sprint.fechaInicial,
      fechaFinal : sprint.fechaFinal
    });
    this.formObservacion.patchValue({
      id: idSprintProyectoArea,
      fecha:  this.obtenerFechaActual(),
    });
  }
  obtenerTarea(idTarea: number,tarea:any) {
    this.tipoFormulario = 'TAREA'
    this.idTareaSeleccionado = idTarea;
    this.nombreTarea = tarea.nombre;
    this.idTareaTipo = tarea.idASE;
    this.periodicidadTarea = tarea.periodicidad;

    this.formModificarEstadoTarea.patchValue({
      estado: tarea.estado,
    });
    this.formModificarPorcentaje.patchValue({
      porcentajeReal: tarea.porcentajeReal,
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
  obtenerObservacion(tipo : string,observacion:any) {
    switch (tipo) {
      case 'TAREA':
        this.tipoFormulario = 'TAREA';
        this.idObservacionTareaSeleccionado = observacion.idObservacionTarea;
        this.formModificarObservacion.patchValue({
          descripcion: observacion.descripcion,
        });
        break;
      case 'SPRINT_PROYECTO_AREA':
        console.log(observacion)
        this.tipoFormulario = 'SPRINT_PROYECTO_AREA'; 
        this.idObservacionSprintProyectoAreaSeleccionado = observacion.idObservacionSprintProyectoArea;
        this.formModificarObservacion.patchValue({
          descripcion: observacion.descripcion,
        });
        break;
    }
  } 

  obtenerNombreUsuario(idUsuario: number) {
    const usuario = this.usuarios.find((u) => u.idUsuario === idUsuario);
    return usuario ? usuario.nombre + " " + usuario.apellidos : '';
  }
  colorPorcentaje(porcentaje: number): string {
    if (porcentaje < 30) {
      return 'porcentaje-bajo'; // Define las clases CSS para porcentajes bajos en tu archivo de estilos.
    } else if (porcentaje >= 30 && porcentaje < 100){
      return 'porcentaje-normal'; // Define las clases CSS para porcentajes normales en tu archivo de estilos.
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

  swalSatisfactorio(metodo: string, tipo:string) {
    Swal.fire({
      title: `Se ha ${metodo}.`,
      text: `El ${tipo} se ha ${metodo}!!`,
      icon:'success',
        position: "center",
        showConfirmButton: false,
        timer: 1000
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
  get descripcionObservacionVacio(){
    return this.formObservacion.get('descripcion')?.invalid && this.formObservacion.get('descripcion')?.touched;
  }
  get fechaVacio(){
    return this.formObservacion.get('fecha')?.invalid && this.formObservacion.get('fecha')?.touched;
  }

    private obtenerFechaActual(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
