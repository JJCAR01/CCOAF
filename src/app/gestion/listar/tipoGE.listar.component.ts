import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { TipoGEService } from '../services/tipoGE.service';
import { PatService } from 'src/app/pat/services/pat.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TareaService } from 'src/app/tarea/services/tarea.service';
import { EEstado } from './EEstado';

@Component({
  selector: 'app-root:not(p)',
  templateUrl: './tipoGE.listar.component.html',
  styleUrls: ['./tipoGE.listar.component.scss']
})

export class TipogeListarComponent implements OnInit {
  title = 'listarTipoGE';
  elementoSeleccionado: string = 'actividadese';
  estadoEnumList: string[] = [];
  gestiones: any[] = [];
  actividades: any[] = [];
  pats: any[] = [];
  usuarios:any[] =[];
  tareas:any[] =[];
  usuarioPat:any;
  porcentajePat:any;
  patNombre:any;
  anual:any;
  idPat:any;
  usuarioEstrategica:any;
  usuarioGestion:any;
  idActividadGestionSeleccionado:any;
  nombreActividadGestion:any;
  fechaInicialGestion:any;
  fechaFinalGestion:any;
  idActividadEstrategicaSeleccionado:any;
  nombreActividadEstrategica:any;
  fechaInicialEstrategica:any;
  fechaFinalEstrategica:any;
  idTareaSeleccionado:any;
  idTareaTipo:any;
  nombreTarea:any;
  estadoTarea:any;
  formGestion:FormGroup;
  formEstrategica:FormGroup;
  formTarea:FormGroup;
  formCrearTarea:FormGroup

  constructor(
    private gestionService: TipoGEService,private auth: AuthService,
    private patService: PatService,private route: ActivatedRoute,
    private usuarioService :UsuarioService,private formBuilder: FormBuilder,
    private tareaService:TareaService
  ) 
  { this.formEstrategica = this.formBuilder.group({
      nombre: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
    });
    this.formGestion = this.formBuilder.group({
      nombre: ['', Validators.required],
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
      const idPat = params['idPat'];
      this.patService.listarPatPorId(idPat,this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.patNombre = data.nombre;
          this.idPat = data.idPat // Asignar el nombre del Pat a patNombre
          this.porcentajePat = data.porcentaje
          this.anual = data.fechaAnual
          this.usuarioPat = data.idUsuario
        },
        (error) => {
          // Manejo de errores
        }
      );

      this.cargarGestiones(idPat);
      this.cargarActividadesEstrategicas(idPat);
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
  cargarGestiones(idPat: number) {
    // Utiliza idPat en tu solicitud para cargar las gestiones relacionadas
    this.gestionService
      .listarGestionPorIdPat(idPat, this.auth.obtenerHeader()) // Debes tener un método en tu servicio para listar gestiones por idPat
      .toPromise()
      .then(
        (data: any) => {
          this.gestiones = data;
        },
        (error) => {
          Swal.fire('Error!',error.error.mensajeTecnico,'error');
        }
      );
  }

  cargarActividadesEstrategicas(idPat: number) {
    // Utiliza idPat en tu solicitud para cargar las epicas relacionadas
    this.gestionService
      .listarActividadEstrategicaPorIdPat(idPat, this.auth.obtenerHeader()) // Debes tener un método en tu servicio para listar epicas por idPat
      .toPromise()
      .then(
        (data: any) => {
          this.actividades = data;
        },
        (error) => {
          Swal.fire({
            text :error.error.mensajeTecnico,
            title : 'Error!',
            icon : 'error'});
        }
      );
  }

  eliminarGestion(idActividadGestion: number) {
    const gestionAEliminar = this.gestiones.find(g => g.idActividadGestion === idActividadGestion);
    Swal.fire({
      icon:"question",
      title: "¿Estás seguro?",
      text: "Una vez eliminado  el pat "  + gestionAEliminar.nombre + ", no podrás recuperar este elemento.",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
      confirmButtonColor: '#0E823F',
      reverseButtons: true, 
    })
    .then((confirmacion) => {
      if (confirmacion.isConfirmed) {
        this.gestionService.eliminarGestion(idActividadGestion, this.auth.obtenerHeader()).subscribe(
          (response) => {
            Swal.fire({
              title:"Eliminado!!!",
              text:"La gestión del área se ha eliminado.",
              icon: "success",
              confirmButtonColor: '#0E823F'
            }).then(() => {
              this.cargarGestiones(this.idPat)
            });
          },
          (error) => {
            Swal.fire("Solicitud no válida", error.error.mensajeHumano, "error");
          }
        );
      }
    });
  }
  eliminarActividadesEstrategica(idActividadEstrategica: number) {
    const actividadAEliminar = this.actividades.find(a => a.idActividadEstrategica === idActividadEstrategica);
    Swal.fire({
      icon:"question",
      title: "¿Estás seguro?",
      text: "Una vez eliminado  la actividad estratégica "  + actividadAEliminar.nombre + ", NO podrás recuperarlo.",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
      confirmButtonColor: '#0E823F',
      reverseButtons: true, 
    })
    .then((confirmacion) => {
      if (confirmacion.isConfirmed) {
        this.gestionService.eliminarActividadEstrategica(idActividadEstrategica, this.auth.obtenerHeader()).subscribe(
          (response) => {
            Swal.fire({
              title:"Eliminado!!!", 
              text:"La actividad estratégica se ha eliminado.", 
              icon:"success",
              confirmButtonColor: '#0E823F',
            }).then(() => {
              this.cargarActividadesEstrategicas(this.idPat)
            });
          },
          (error) => {
            Swal.fire("Solicitud no válida", error.error.mensajeHumano, "error");
          }
        );
      }
    });
  }

  modificarActividadGestion() {
    if (this.formGestion.valid && this.idActividadGestionSeleccionado) {
      const nombre = this.formGestion.get('nombre')?.value;
      const fechaInicial = this.formGestion.get('fechaInicial')?.value;
      const fechaFinal = this.formGestion.get('fechaFinal')?.value;
      const idUsuario = this.usuarioGestion
      const idPat = this.idPat
      const actividadGestion = {
        nombre: nombre,
        fechaInicial: fechaInicial,
        fechaFinal: fechaFinal,
        idUsuario :idUsuario,
        idPat : idPat
      };
      console.log(actividadGestion)
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
            Swal.fire({
              title: "Modificado!!!",
              text: "La gestión del área se ha modificado",
              icon: "success",
              confirmButtonColor: '#0E823F',
            }).then((value) => {
              this.cargarGestiones(this.idPat)
            });
          },
          (error) => {
            Swal.fire('Error',error.error.mensajeTecnico,"warning");
          }
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
      const idUsuario = this.usuarioEstrategica
      const idPat = this.idPat
      const actividadEstrategica = {
        nombre: nombre,
        fechaInicial: fechaInicial,
        fechaFinal: fechaFinal,
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
            (response) => {
              Swal.fire({
                title: "Modificado!!!",
                text: "La actividad estratégica se ha modificado",
                icon: "success",
                confirmButtonColor: '#0E823F',
              }).then((value) => {
                this.cargarActividadesEstrategicas(this.idPat)
              });
            },
            (error) => {
              Swal.fire(error.error.mensajeHumano,error.error.mensajeTecnico,"warning");
            }
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
    if (this.formCrearTarea.valid) {
      const nombre = this.formCrearTarea.get('nombre')?.value;
      const descripcion = this.formCrearTarea.get('descripcion')?.value;
      const idUsuario = this.formCrearTarea.get('idUsuario')?.value;
      
      const tarea = {
        nombre: nombre,
        descripcion: descripcion,
        estado: EEstado.EN_BACKLOG,
        tipoASE: 'ACTIVIDAD_GESTION',
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
              this.cargarTareas(this.idActividadGestionSeleccionado,'ACTIVIDAD_GESTION')
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
                Swal.fire({
                  icon : 'success',
                  title : 'Modificado!!!',
                  text : 'Se ha modificado la tarea.',
                  confirmButtonColor: '#0E823F',
                }).then(()=>{
                  this.cargarTareas(this.idTareaTipo,'ACTIVIDAD_GESTION')
                  this.formTarea.reset()  
                });               
              },
              (error) => {
                Swal.fire("Solicitud no válida", error.error.mensajeHumano, "error");
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
              icon: "success",
              confirmButtonColor: '#0E823F',}).then(() => {
            }).then(()=>{
              this.cargarTareas(this.idActividadGestionSeleccionado,'ACTIVIDAD_GESTION')
            }); 
          },
          (error) => {
            Swal.fire("Solicitud no válida", error.error.mensajeHumano, "error");
          }
        );
      }

      });
      
  }

  obtenerActividadGestion(idActividadGestion: number,actividadGestion:any) {
    this.idActividadGestionSeleccionado = idActividadGestion;
    this.nombreActividadGestion = actividadGestion.nombre;
    this.usuarioGestion = actividadGestion.idUsuario
    this.fechaInicialGestion = actividadGestion.fechaInicial
    this.fechaFinalGestion = actividadGestion.fechaFinal

    this.formGestion.patchValue({
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
      estado: this.estadoTarea,
    });
  }
  obtenerActividadEstrategica(idActividadEstrategica: number,actividadEstrategica:any) {
    
    this.idActividadEstrategicaSeleccionado = idActividadEstrategica;
    this.nombreActividadEstrategica = actividadEstrategica.nombre;
    this.usuarioEstrategica = actividadEstrategica.idUsuario
    this.fechaInicialEstrategica = actividadEstrategica.fechaInicial
    this.fechaFinalEstrategica = actividadEstrategica.fechaFinal  

    this.formEstrategica.patchValue({
      nombre: this.nombreActividadGestion,
      fechaInicial: this.fechaInicialGestion,
      fechaFinal: this.fechaFinalGestion,
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
 

}
