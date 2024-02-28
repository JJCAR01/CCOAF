import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { Component,OnInit } from '@angular/core';
import { SprintService } from '../services/sprint.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { ActividadService } from 'src/app/actividad/services/actividad.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TareaService } from "src/app/tarea/services/tarea.service";
import { EEstado } from "src/enums/eestado";
import { initializeApp } from 'firebase/app';
import { environment } from "src/environments/environment.development";
import { EPeriodicidad } from "src/enums/eperiodicidad";
import { MENSAJE_TITULO } from "src/app/utilitarios/mensaje/mensajetitulo";

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.listar.component.html',
  styleUrls: ['./sprint.listar.component.scss']
})
export class SprintListarComponent implements OnInit {
  title = 'listarSprint';
  CAMPO_OBLIGATORIO = MENSAJE_TITULO.CAMPO_OBLIGATORIO;
  NOMBRE_SPRINT = MENSAJE_TITULO.NOMBRE_SPRINT_PROYECTO;
  NOMBRE_TAREA = MENSAJE_TITULO.NOMBRE_TAREA_SPRINT_PROYECTO;
  FECHA_INICIAL_SPRINT = MENSAJE_TITULO.FECHA_INICIAL_SPRINT_PROYECTO;
  FECHA_FINAL_SPRINT = MENSAJE_TITULO.FECHA_FINAL_SPRINT_PROYECTO;
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
  esConsultor:boolean= false;

  tipoFormulario: 'SPRINT' | 'TAREA' = 'SPRINT';
  pesoDeArchivo = 300 * 1024 * 1024; // 300 MB
  extencionesPermitidas = /\.(doc|docx|xls|xlsx|ppt|pptx|zip|pdf)$/i;
  nombreArchivoSeleccionado: string = '';
  archivoSeleccionado: File | null = null;
  estadoEnumList: string[] = [];
  periodiciadEnumLista: string[] = [];
  sprints: any[] = [];
  proyectos: any[] = [];
  tareas:any[] =[];
  usuarios:any[] =[];
  observaciones:any[] =[];
  documentoObtenido: any [] = [];
  patNombre:any;
  nombreSprint:any;
  fechaInicialSprint:any;
  fechaFinalSprint:any;
  totalSprint:any;
  contadorSprint:any;
  planeacionSprint:any;
  proyectoNombre:any;
  proyectoPorcentaje:any;
  proyectoUsuario:any;
  idProyecto:any;
  actividad:any;
  idSprintSeleccionado:any;
  idTareaSeleccionado:any;
  nombreTarea:any;
  periodicidadTarea:any;
  porcentajeTarea:any;
  idTareaTipo:any;
  estadoTarea:any;
  formSprint:FormGroup;
  formModificarEstadoTarea:FormGroup;
  formModificarPorcentaje:FormGroup;
  formTarea:FormGroup;
  formModificarTarea:FormGroup;
  formObservacion:FormGroup;
  

  constructor(
    private sprintService: SprintService,
    private auth: AuthService,
    private actividadService: ActividadService,
    private route: ActivatedRoute,
    private usuarioService :UsuarioService,
    private formBuilder: FormBuilder,
    private tareaService: TareaService,
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
            // Usar Promise.all para esperar a que todas las promesas se resuelvan
    Promise.all([
      this.auth.esAdmin(),
      this.auth.esDirector(),
      this.auth.esOperador(),
      this.auth.esConsultor()
    ]).then(([esAdmin, esDirector, esOperador, esConsultor]) => {
      // Asignar los resultados a las propiedades correspondientes
      this.esAdmin = esAdmin;
      this.esDirector = esDirector;
      this.esOperador = esOperador;
      this.esConsultor = esConsultor;
    });
    // Obtén el valor de idPat de la URL
    this.route.params.subscribe(params => {
      this.patNombre = params['patNombre'];
      const idProyecto = params['idProyecto'];
      this.actividadService.listarProyectoPorId(idProyecto,this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.proyectoNombre = data.nombre
          this.proyectoPorcentaje = data.porcentajeReal
          this.proyectoUsuario = data.idUsuario
          this.idProyecto = data.idProyecto 
          this.actividad = data.idActividadEstrategica
          this.totalSprint = data.totalSprint
          this.planeacionSprint = data.planeacionSprint
        }
      );
      this.cargarSprints(idProyecto);
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
        if(tipo === 'sprint'){
          this.sprintService.guardarDocumentoSprint(documento, this.idSprintSeleccionado, this.auth.obtenerHeaderDocumento()).subscribe(
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
        } else if (tipo === 'tarea'){
          this.tareaService.guardarDocumentoTarea(documento, this.idTareaSeleccionado, this.auth.obtenerHeaderDocumento()).subscribe(
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

    if(tipo === 'SPRINT'){
      this.sprintService.obtenerDocumento(id, this.auth.obtenerHeaderDocumento()).subscribe(
        (data: any) => {
          this.documentoObtenido = data;
        },
        (error: any) => {
          Swal.fire({
            title: 'El sprint no tiene documentos adjuntos',
            text: 'Cargue un documento para visualizarlo',
            icon: 'info',
            confirmButtonColor: '#0E823F',
          });
        }
      );
    } else if(tipo === 'TAREA'){
      this.tareaService.obtenerDocumentoTarea(id, this.auth.obtenerHeaderDocumento()).subscribe(
        (data: any) => {
          this.documentoObtenido = data;
        },
        (error: any) => {
          Swal.fire({
            title: 'La tarea no tiene documentos adjuntos',
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
  
  abrirModalAgregarDocumento(idSeleccionado: number,tipo:string): void {
    if(tipo === 'SPRINT'){
      this.idSprintSeleccionado = idSeleccionado;
    } else if( tipo === 'TAREA'){
      this.idTareaSeleccionado = idSeleccionado;
    }

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


  cargarSprints(idProyecto: number) {
    // Utiliza idPat en tu solicitud para cargar las epicas relacionadas
    this.sprintService
      .listarSprintPorProyecto(idProyecto, this.auth.obtenerHeader()) // Debes tener un método en tu servicio para listar epicas por idPat
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
          this.sprintService.modificarSprint(sprint, this.idSprintSeleccionado, this.auth.obtenerHeader())
          .subscribe(
            (response) => {
              this.swalSatisfactorio('modificado','sprint')
                this.cargarSprints(this.idProyecto)
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
        this.sprintService.eliminarSprint(idSprint, this.auth.obtenerHeader()).subscribe(
          (response) => {
            this.swalSatisfactorio('eliminado','sprint')
              this.cargarSprints(this.idProyecto)
          },
          (error) => {this.swalError(error);}
        );
      }
    });
  }
  cargarTareas(idASE:any, tipoASE:any) {
    if(tipoASE === 'SPRINT'){
    this.tareaService
      .listarTareaPorSprint(idASE,this.auth.obtenerHeader()) 
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
    console.log(tipo)
    if(tipo === 'TAREA'){
      this.tareaService
        .listarPorIdTarea(id,this.auth.obtenerHeader()) .subscribe(
          (data: any) => {
            this.observaciones = data;
          },
        )
    } else if( tipo === 'SPRINT'){
      this.sprintService
        .listarPorIdSprint(id,this.auth.obtenerHeader()) .subscribe(
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
        tipoASE: 'SPRINT',
        idASE: this.idSprintSeleccionado,
        idUsuario: idUsuario,
      };
      this.tareaService
        .crearTarea(tarea,this.auth.obtenerHeader())
        .subscribe(
          (response) => {
            this.swalSatisfactorio('creada','tarea')
              this.cargarTareas(this.idSprintSeleccionado,'SPRINT');
              this.formTarea.reset();
              this.cargarSprints(this.idProyecto);
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
      } else if( this.tipoFormulario === 'SPRINT'){
        const observacion = {
          idSprint: this.idSprintSeleccionado,
          nombre: nombre,
          fecha: fecha,
        };
        this.sprintService
          .crearObservacionSprint(observacion,this.auth.obtenerHeader())
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
              (response) => {
                this.swalSatisfactorio ('modificado','estado del área')
                  this.cargarSprints(this.idProyecto);
                  this.cargarTareas(this.idTareaTipo,'SPRINT');
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
                this.swalSatisfactorio('modificado','porcentaje del área')
                  this.cargarSprints(this.idProyecto);
                    this.cargarTareas(this.idTareaTipo,'SPRINT');
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
                  this.cargarTareas(this.idTareaTipo,'SPRINT');
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
  obtenerSprint(idSprint: number,sprint:any) {
    this.tipoFormulario = 'SPRINT';
    this.idSprintSeleccionado = idSprint;
    
    this.formSprint.patchValue({
      descripcion : sprint.descripcion,
      fechaInicial : sprint.fechaInicial,
      fechaFinal : sprint.fechaFinal
    });
    this.formObservacion.patchValue({
      id: idSprint,
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

  private obtenerFechaActual(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
