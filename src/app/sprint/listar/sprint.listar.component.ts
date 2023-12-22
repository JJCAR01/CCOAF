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
  estadoEnumList: string[] = [];
  sprints: any[] = [];
  proyectos: any[] = [];
  tareas:any[] =[];
  usuarios:any[] =[];
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


  async documento($event: any, idSprintSeleccionado: number) {
  const app = initializeApp(environment.firebase);
  const storage = getStorage(app);
  const storageRef = ref(storage, `sprint/${idSprintSeleccionado}/${$event.target.files[0].name}`);
  const file = $event.target.files[0];

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    const headers = this.auth.obtenerHeader(); // Asegúrate de que esta línea sea correcta y devuelva los encabezados necesarios.

    this.sprintService.guardarDocumentoSprint(downloadURL, idSprintSeleccionado, this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        console.log('URL de descarga:', downloadURL);
        console.log('Respuesta del servicio:', data);
        // Puedes realizar acciones adicionales después de que el documento se ha guardado.
      },
      (error: any) => {
        console.error('Error al guardar el documento:', error);
        // Manejar el error según tus necesidades.
        // Puedes mostrar un mensaje de error al usuario.
      }
    );

  } catch (error) {
    console.error('Error durante la subida del archivo:', error);
    // Manejar el error según tus necesidades.
    // Puedes mostrar un mensaje de error al usuario.
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
