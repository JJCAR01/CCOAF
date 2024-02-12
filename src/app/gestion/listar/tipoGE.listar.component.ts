import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { TipoGEService } from '../services/tipoGE.service';
import { PatService } from 'src/app/pat/services/pat.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TareaService } from 'src/app/tarea/services/tarea.service';
import { EEstado } from 'src/enums/eestado';
import { EPeriodicidad } from 'src/enums/eperiodicidad';
import { ObservacionService } from 'src/app/observacion/services/observacion.service';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.development';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Pat } from 'src/app/modelo/pat';
import { Usuario } from 'src/app/modelo/usuario';
import { ActividadEstrategica } from 'src/app/modelo/actividadestrategica';
import { ActividadGestion } from 'src/app/modelo/actividadgestion';
import { Tarea } from 'src/app/modelo/tarea';

@Component({
  selector: 'app-root:not(p)',
  templateUrl: './tipoGE.listar.component.html',
  styleUrls: ['./tipoGE.listar.component.scss']
})

export class TipogeListarComponent implements OnInit {
  title = 'listarTipoGE';
  ESTE_CAMPO_ES_OBLIGARORIO: string = 'Este campo es obligatorio*';
  tipoFormulario: 'ACTIVIDAD_ESTRATEGICA' | 'ACTIVIDAD_GESTION' | 'TAREA' = 'ACTIVIDAD_ESTRATEGICA'; // Por defecto, muestra el formulario para actividad estratégica
  pesoDeArchivo = 300 * 1024 * 1024; // 300 MB
  extencionesPermitidas = /\.(doc|docx|xls|xlsx|ppt|pptx|zip|pdf)$/i;
  nombreArchivoSeleccionado: string = '';
  archivoSeleccionado: File | null = null;
  documentoObtenido:any;
  usuarioPat:Usuario | undefined;
  porcentajePat:number | 0 = 0;
  nombrePat:string | undefined = '';
  fechaAnualPat:number | undefined;
  idPat:number | 0 = 0;
  idUsuarioSeleccionado: any | 0 = 0;
  idActividadGestionSeleccionado: number | 0 = 0;
  nombreActividadGestion: string | undefined = '';
  fechaInicialGestion:Date | undefined;
  fechaFinalGestion:Date | undefined;
  idActividadEstrategicaSeleccionado: number | 0 = 0;
  nombreActividadEstrategica: string | undefined = '';
  fechaInicialEstrategica: Date | undefined;
  fechaFinalEstrategica: Date | undefined;
  metaEstrategica: number | 0=0;
  idTareaSeleccionado: number | 0 = 0;
  idTareaTipo: number | 0 = 0;
  nombreTarea: string | undefined = '';
  estadoTarea: string | undefined = '';
  porcentajeTarea: number | 0 = 0;
  periodicidadTarea: string | undefined = '';
  estadoEnumList: string[] = [];
  periodiciadEnumLista: string[] = [];
  gestiones: ActividadGestion[] = [];
  actividades: ActividadEstrategica[] = [];
  pats: Pat[] = [];
  usuarios: Usuario[] = [];
  tareas:Tarea[] =[];
  observaciones:any[] =[];
  observacionesActividadesEstrategicas:any[] =[];
  formGestion:FormGroup;
  formEstrategica:FormGroup;
  formModificarEstadoTarea:FormGroup;
  formModificarPorcentaje:FormGroup;
  formModificarTarea:FormGroup
  formTarea:FormGroup;
  formObservacion:FormGroup;

  constructor(
    private gestionService: TipoGEService,private auth: AuthService,
    private patService: PatService,private route: ActivatedRoute,
    private usuarioService :UsuarioService,private formBuilder: FormBuilder,
    private tareaService:TareaService,    private observacionService:ObservacionService
  ) 
  
  { this.formEstrategica = this.formBuilder.group({
      nombre: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      meta: ['', Validators.required],
      idUsuario:['',Validators.required]
    });
    this.formGestion = this.formBuilder.group({
      nombre: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      idUsuario:['',Validators.required]
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
    
    // Obtén el valor de idPat de la URL
    this.route.params.subscribe(params => {
      const idPat = params['idPat'];
      this.patService.listarPatPorId(idPat,this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.nombrePat = data.nombre;
          this.idPat = data.idPat; // Asignar el nombre del Pat a patNombre
          this.porcentajePat = data.porcentajeReal;
          this.fechaAnualPat = data.fechaAnual;
          this.usuarioPat = data.idUsuario;
        }
      );
      this.cargarGestiones(idPat);
      this.cargarActividadesEstrategicas(idPat);
      this.cargarUsuario();
    });

    this.crearTarea();
    this.estadoEnumList = Object.values(EEstado);
    this.periodiciadEnumLista = Object.values(EPeriodicidad);
  }
  siguienteRuta(idActividadEstrategica: number, nombrePat : string){
    return ['/panel', { outlets: { 'OutletAdmin': ['listarActividad', idActividadEstrategica,'pat', nombrePat] } }];
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

  cargarGestiones(idPat: number) {
    // Utiliza idPat en tu solicitud para cargar las gestiones relacionadas
    this.gestionService
      .listarGestionPorIdPat(idPat, this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.gestiones = data;
        });
  }

  cargarActividadesEstrategicas(idPat: number) {
    // Utiliza idPat en tu solicitud para cargar las epicas relacionadas
    this.gestionService
      .listarActividadEstrategicaPorIdPat(idPat, this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.actividades = data;
        }
      );
  }
  cargarObservaciones(id:any,tipo:string) {
    if(tipo === 'TAREA'){
      this.tareaService
        .listarPorIdTarea(id,this.auth.obtenerHeader()) .subscribe(
          (data: any) => {
            this.observaciones = data;
          },
        )
    } else if( tipo === 'ACTIVIDAD_GESTION'){
      this.gestionService
        .listarObservacionPorIdActividadGestion(id,this.auth.obtenerHeader()) .subscribe(
          (data: any) => {
            this.observaciones = data;
          },
        )
    } else if (tipo === 'ACTIVIDAD_ESTRATEGICA'){
      this.gestionService
        .listarObservacionPorIdActividadEstrategica(id,this.auth.obtenerHeader()) .subscribe(
          (data: any) => {
            this.observaciones = data;
          },
        )
    }
  } 
  eliminarGestion(idActividadGestion: number) {
    Swal.fire({
      icon:"question",
      title: "¿Estás seguro?",
      text: "Una vez eliminada la actividad de gestión, no podrás recuperar este elemento.",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
      confirmButtonColor: '#0E823F',
      reverseButtons: true, 
    })
    .then((confirmacion) => {
      if (confirmacion.isConfirmed) {
        this.gestionService.eliminarGestion(idActividadGestion, this.auth.obtenerHeader()).subscribe(
          () => {
            this.swalSatisfactorio('eliminado','actividad del área')
              this.cargarGestiones(this.idPat)
          },
          (error) => {this.swalError(error);}
        );
      }
    });
  }
  eliminarActividadesEstrategica(idActividadEstrategica: number) {
    Swal.fire({
      icon:"question",
      title: "¿Estás seguro?",
      text: "Una vez eliminado la actividad estratégica, NO podrás recuperarlo.",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
      confirmButtonColor: '#0E823F',
      reverseButtons: true, 
    })
    .then((confirmacion) => {
      if (confirmacion.isConfirmed) {
        this.gestionService.eliminarActividadEstrategica(idActividadEstrategica, this.auth.obtenerHeader()).subscribe(
          () => {
              this.swalSatisfactorio('eliminado','actividad estratégica')
              this.cargarActividadesEstrategicas(this.idPat)
          },
          (error) => {this.swalError(error);}
        );
      }
    });
  }

  modificarActividadGestion() {
    if (this.formGestion.valid && this.idActividadGestionSeleccionado) {
      const nombre = this.formGestion.get('nombre')?.value;
      const fechaInicial = this.formGestion.get('fechaInicial')?.value;
      const fechaFinal = this.formGestion.get('fechaFinal')?.value;
      const idUsuario = this.formGestion.get('idUsuario')?.value;
      const idPat = this.idPat
      const actividadGestion = {
        nombre: nombre,
        fechaInicial: fechaInicial,
        fechaFinal: fechaFinal,
        idUsuario :idUsuario,
        idPat : idPat
      };
      Swal.fire({
        title: "¿Estás seguro de modificar?",
        icon: "question",
        text: "Una vez modificado no podrás revertir los cambios",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true, 
      }).then((confirmacion) => {
        if (confirmacion.isConfirmed) {
          this.gestionService
        .modificarActividadGestión(actividadGestion, this.idActividadGestionSeleccionado, this.auth.obtenerHeader())
        .subscribe(
          (response) => {
            this.swalSatisfactorio('modificado','actividad del área')
              this.cargarGestiones(this.idPat)
          },
          (error) => {this.swalError(error);}
        );
        }
      }) 
    }
  }
  modificarActividadEstrategica() {
    if (this.formEstrategica.valid) {
      const nombre = this.formEstrategica.get('nombre')?.value;
      const fechaInicial = this.formEstrategica.get('fechaInicial')?.value;
      const fechaFinal = this.formEstrategica.get('fechaFinal')?.value;
      const meta = this.formEstrategica.get('meta')?.value;
      const idUsuario = this.formEstrategica.get('idUsuario')?.value;
      const idPat = this.idPat
      const actividadEstrategica = {
        nombre: nombre,
        fechaInicial: fechaInicial,
        fechaFinal: fechaFinal,
        meta:meta,
        idUsuario :idUsuario,
        idPat : idPat
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
          if (this.idActividadEstrategicaSeleccionado != null) {
          this.gestionService.modificarActividadEstrategica(actividadEstrategica, this.idActividadEstrategicaSeleccionado, this.auth.obtenerHeader())
          .subscribe(
            () => {
                this.swalSatisfactorio('modificado','actividad estratégica')
                this.cargarActividadesEstrategicas(this.idPat)
            },
            (error) => {this.swalError(error);}
            );
            }
          }
        }) 
    }
  }

  cargarTareas(idASE:any, tipoASE:any) {
    if(tipoASE === 'ACTIVIDAD_GESTION'){
    this.tareaService
      .listarTareaPorActvidadGestion(idASE,this.auth.obtenerHeader()) 
      .toPromise()
      .then(
        (data: any) => {
        this.tareas = data;
        this.nombreTarea = data.descripcion
        },
        (error) => {
          Swal.fire('Error',error.error.mensajeHumano,'error');
        }
    )};
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
        tipoASE: 'ACTIVIDAD_GESTION',
        idASE: this.idActividadGestionSeleccionado,
        idUsuario: idUsuario,
      };
      this.tareaService
        .crearTarea(tarea,this.auth.obtenerHeader())
        .subscribe(
          (response) => {
              this.swalSatisfactorio('creado','tarea')
              this.cargarTareas(this.idActividadGestionSeleccionado,'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA')
              this.formTarea.reset()
              this.cargarGestiones(this.idPat)
          },
          (error) => {this.swalError(error);}
        );
    } else {
      return this.formTarea.markAllAsTouched();
    }
  }
  crearObservacion() {
    console.log(this.tipoFormulario)
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
      } else if( this.tipoFormulario === 'ACTIVIDAD_GESTION'){
        const observacion = {
          idActividadGestion: this.idActividadGestionSeleccionado,
          nombre: nombre,
          fecha: fecha,
        };
        console.log(observacion)
        this.gestionService
          .crearObservacionActividadGestion(observacion,this.auth.obtenerHeader())
          .subscribe(
            (response) => {
                this.swalSatisfactorio('creado','observación')
                this.formObservacion.reset()
            },
            (error) => {this.swalError(error);}
          );
      } else if (this.tipoFormulario === 'ACTIVIDAD_ESTRATEGICA'){;
        const observacion = {
          idActividadEstrategica: this.idActividadEstrategicaSeleccionado,
          nombre: nombre,
          fecha: fecha,
        };
        this.gestionService
          .crearObservacionActividadEstrategica(observacion,this.auth.obtenerHeader())
          .subscribe(
            (response) => {
                this.swalSatisfactorio('creado','observación')
                this.formObservacion.reset()
            },
            (error) => {this.swalError(error);}
          );
      }
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
                  this.cargarGestiones(this.idPat);
                  this.cargarTareas(this.idTareaTipo,'ACTIVIDAD_GESTION');
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
              () => {
                  this.swalSatisfactorio('modificado','porcentaje de la actividad')
                  this.cargarGestiones(this.idPat)
                  this.cargarTareas(this.idTareaTipo,'ACTIVIDAD_GESTION')
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
              () => {
                this.swalSatisfactorio('modificado','tarea')
                  this.cargarGestiones(this.idPat)
                  this.cargarTareas(this.idTareaTipo,'ACTIVIDAD_GESTION')
                  this.formModificarEstadoTarea.reset()              
              },
              (error) => {this.swalError(error);}
            );
        } 
      });
    }
  }
  eliminarTarea(idTarea: number,idActividadGestion: number) {
    
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
              this.cargarTareas(idActividadGestion,'ACTIVIDAD_GESTION')
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
  abrirModalAgregarDocumento(idActividadGestion: number): void {
    this.idActividadGestionSeleccionado = idActividadGestion;
  }
  async subirDocumento(formulario: any) {
    if (!this.archivoSeleccionado) {
      // Puedes mostrar un mensaje de error o manejarlo de otra manera
      return;
    }
      try {
        const app = initializeApp(environment.firebase);
        const storage = getStorage(app);
        const storageRef = ref(storage, `actividadGestion/${this.idActividadGestionSeleccionado}/${this.archivoSeleccionado.name}`);
        const snapshot = await uploadBytes(storageRef, this.archivoSeleccionado);
        const downloadURL = await getDownloadURL(storageRef);
        // Crear un objeto sprint que incluya la URL de descarga
        const documento = {
          rutaDocumento: downloadURL, // Asegúrate de que el nombre de la propiedad coincida con lo que espera tu backend
        };
        this.gestionService.guardarDocumento(documento, this.idActividadGestionSeleccionado, this.auth.obtenerHeaderDocumento()).subscribe(
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
  obtenerDocumento(idActividadGestion: number) {

    this.gestionService.obtenerDocumento(idActividadGestion, this.auth.obtenerHeaderDocumento()).subscribe(
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
  

  obtenerActividadGestion(idActividadGestion: number,actividadGestion:any) {
    this.tipoFormulario = 'ACTIVIDAD_GESTION';
    this.idActividadGestionSeleccionado = idActividadGestion;
    this.nombreActividadGestion = actividadGestion.nombre;
    this.idUsuarioSeleccionado = actividadGestion.idUsuario
    this.fechaInicialGestion = actividadGestion.fechaInicial
    this.fechaFinalGestion = actividadGestion.fechaFinal


    this.formGestion.patchValue({
      nombre: this.nombreActividadGestion,
      fechaIncial: this.fechaInicialGestion,
      fechaFinal: this.fechaFinalGestion,
      idUsuario: this.idUsuarioSeleccionado,
    });
    this.formObservacion.patchValue({
      id: this.idActividadGestionSeleccionado,
    });
  }
  obtenerTarea(idTarea: number,tarea:any) {
    this.idTareaSeleccionado = idTarea;
    this.nombreTarea = tarea.nombre;
    this.idTareaTipo = tarea.idASE;
    this.estadoTarea = tarea.estado;
    this.porcentajeTarea = tarea.porcentajeReal;
    this.periodicidadTarea = tarea.periodicidad;
    this.tipoFormulario = 'TAREA';

    this.formModificarEstadoTarea.patchValue({
      estado: this.estadoTarea,
    });
    this.formModificarPorcentaje.patchValue({
      porcentajeReal: this.porcentajeTarea,
    });

    this.formObservacion.patchValue({
      id: this.idTareaSeleccionado,
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
  obtenerActividadEstrategica(idActividadEstrategica: number,actividadEstrategica:any) {
    this.tipoFormulario = 'ACTIVIDAD_ESTRATEGICA'; 
    this.idActividadEstrategicaSeleccionado = idActividadEstrategica;
    this.nombreActividadEstrategica = actividadEstrategica.nombre;
    this.idUsuarioSeleccionado = actividadEstrategica.idUsuario;
    this.fechaInicialEstrategica = actividadEstrategica.fechaInicial;
    this.fechaFinalEstrategica = actividadEstrategica.fechaFinal;  
    this.metaEstrategica = actividadEstrategica.meta;

    this.formEstrategica.patchValue({
      nombre: this.nombreActividadGestion,
      fechaInicial: this.fechaInicialGestion,
      fechaFinal: this.fechaFinalGestion,
      meta: this.metaEstrategica,
      idUsuario: this.idUsuarioSeleccionado,
    });
    this.formObservacion.patchValue({
      id: this.idActividadEstrategicaSeleccionado,
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

  swalSatisfactorio(metodo: string, tipo:string) {
    Swal.fire({
      title: `Se ha ${metodo}.`,
      text: `El ${tipo} se ha ${metodo}!!`,
      icon:'success',
      confirmButtonColor: '#0E823F',
    }
    );
    this.formEstrategica.reset();
    this.formGestion.reset();
    this.formModificarEstadoTarea.reset();
    this.formModificarPorcentaje.reset();
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
    return (this.formObservacion.get('nombre')?.invalid && this.formObservacion.get('nombre')?.touched);
  }
  get fechaVacio(){
    return this.formObservacion.get('fecha')?.invalid && this.formObservacion.get('fecha')?.touched;
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

}
