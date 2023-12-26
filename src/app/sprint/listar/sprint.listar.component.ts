import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { Component,Injectable,OnInit } from '@angular/core';
import { SprintService } from '../services/sprint.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { ActividadService } from 'src/app/actividad/services/actividad.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TareaService } from "src/app/tarea/services/tarea.service";
import { EEstado } from "src/app/gestion/listar/EEstado";
import { initializeApp } from 'firebase/app';
import { environment } from "src/environments/environment.development";

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.listar.component.html',
  styleUrls: ['./sprint.listar.component.scss']
})
export class SprintListarComponent implements OnInit {
  title = 'listarSprint';
  pesoDeArchivo = 300 * 1024 * 1024; // 300 MB
  extencionesPermitidas = /\.(doc|docx|xls|xlsx|ppt|pptx|zip|pdf)$/i;
  nombreArchivoSeleccionado: string = '';
  archivoSeleccionado: File | null = null;
  estadoEnumList: string[] = [];
  sprints: any[] = [];
  proyectos: any[] = [];
  tareas:any[] =[];
  usuarios:any[] =[];
  documentoObtenido:any;
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
  idTareaTipo:any;
  estadoTarea:any;
  formTarea:FormGroup;
  formSprint:FormGroup;
  formCrearTarea:FormGroup
  

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
      this.patNombre = params['patNombre'];
      const idProyecto = params['idProyecto'];
      this.actividadService.listarProyectoPorId(idProyecto,this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.proyectoNombre = data.nombre
          this.proyectoPorcentaje = data.avance
          this.proyectoUsuario = data.idUsuario
          this.idProyecto = data.idProyecto 
          this.actividad = data.idActividadEstrategica
          this.totalSprint = data.totalSprint
          this.planeacionSprint = data.planeacionSprint
        },
        (error) => {
          // Manejo de errores
        }
      );

      this.cargarSprints(idProyecto);
    });
    this.cargarUsuario();
    this.crearTarea();
    this.estadoEnumList = Object.values(EEstado);
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
    const storageRef = ref(storage, `sprint/${this.idSprintSeleccionado}/${this.archivoSeleccionado.name}`);

      try {
        const snapshot = await uploadBytes(storageRef, this.archivoSeleccionado);
        const downloadURL = await getDownloadURL(storageRef);

        // Crear un objeto sprint que incluya la URL de descarga
        const sprint = {
          rutaArchivo: downloadURL, // Asegúrate de que el nombre de la propiedad coincida con lo que espera tu backend
        };

        this.sprintService.guardarDocumentoSprint(sprint, this.idSprintSeleccionado, this.auth.obtenerHeaderDocumento()).subscribe(
            (data: any) => {
              Swal.fire({
                title:'Archivo subido!!!',
                text:'El archivo se cargo correctamente',
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
  obtenerDocumento(idSprint: number) {
    this.sprintService.obtenerDocumento(idSprint, this.auth.obtenerHeaderDocumento()).subscribe(
      (data: any) => {
        this.documentoObtenido = data;
  
        // Verificar si this.documentoObtenido.rutaArchivo existe
        if (this.documentoObtenido.rutaArchivo) {
          // Extraer el nombre del archivo de la URL
          const nombreArchivo = this.extraerNombreArchivo(this.documentoObtenido.rutaArchivo);

          // Crear un enlace HTML
          const enlaceHTML = `<a href="${this.documentoObtenido.rutaArchivo}" target="_blank">${nombreArchivo}</a>`;

          Swal.fire({
            title: ' Documento cargado al sprint',
            html: `Para previsualizar darle click al enlace: ${enlaceHTML}`,
            confirmButtonColor: '#0E823F',
            icon:'success'
          });
        } else {
          // Manejar el caso en el que la propiedad rutaArchivo no existe
          console.error('La respuesta del servidor no tiene la propiedad rutaArchivo.');
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
  
  

  abrirModalAgregarDocumento(idSprint: number): void {
    this.idSprintSeleccionado = idSprint;
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
        (error) => {
          Swal.fire(error.error.mensajeTecnico);
        }
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
              Swal.fire({
                title: "Modificado!!!",
                text: "El proyecto se ha modificado",
                icon: "success",
                confirmButtonColor: '#0E823F',
              }).then((value) => {
                this.cargarSprints(this.idProyecto)
            });
            },
            (error) => {
              Swal.fire(error.error.mensajeHumano,'' ,"warning");
            }
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
            Swal.fire({
              title:"Eliminado!!!",
              text:"El proyecto se ha eliminado.",
              icon:"success",
              reverseButtons: true, 
            }).then(() => {
              this.cargarSprints(this.idProyecto)
            });
          },
          (error) => {
            Swal.fire("Solicitud no válida", error.error.mensajeHumano, "error");
          }
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
  crearTarea() {
    if (this.formCrearTarea.valid) {
      const nombre = this.formCrearTarea.get('nombre')?.value;
      const descripcion = this.formCrearTarea.get('descripcion')?.value;
      const idUsuario = this.formCrearTarea.get('idUsuario')?.value;
      
      const tarea = {
        nombre: nombre,
        descripcion: descripcion,
        estado: EEstado.EN_BACKLOG,
        tipoASE: 'SPRINT',
        idASE: this.idSprintSeleccionado,
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
              this.cargarTareas(this.idSprintSeleccionado,'SPRINT')
              this.formCrearTarea.reset()
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
          this.tareaService.modificarTarea(tareaModificar, this.idTareaSeleccionado,this.auth.obtenerHeader())
            .subscribe(
              (response) => {
                this.cargarTareas(this.idTareaTipo,'SPRINT')
                Swal.fire({
                  title: "Modificado!!!",
                  text: "La gestión del área se ha modificado",
                  icon: "success",
                  confirmButtonColor: '#0E823F',
                }).then(() => {
                  this.formTarea.reset()
              });
          },
          (error) => {
            Swal.fire('Error',error.error.mensajeHumano, "error");
          }
        );
        }
    })
      
    }
  }
  eliminarTarea(idTarea: number) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar este elemento.",
        icon: "warning",
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
              this.cargarTareas(this.idSprintSeleccionado,'SPRINT')
            });
          },
          (error) => {
            Swal.fire("Solicitud no válida", error.error.mensajeHumano, "error");
          }
        );
      }
      });
  }
  obtenerSprint(idSprint: number,sprint:any) {
    this.idSprintSeleccionado = idSprint;
    this.nombreSprint = sprint.descripcion;
    this.fechaInicialSprint = sprint.fechaInicial
    this.fechaFinalSprint = sprint.fechaFinal
    
    this.formSprint.patchValue({
      descripcion : this.nombreSprint,
      fechaInicial : this.fechaInicialSprint,
      fechaFinal : this.fechaFinalSprint
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
