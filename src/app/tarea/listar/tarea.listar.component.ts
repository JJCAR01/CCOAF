import { Component } from '@angular/core';
import { TareaService } from '../services/tarea.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { SprintService } from 'src/app/sprint/services/sprint.service';
import { ActivatedRoute } from '@angular/router';
import { ActividadService } from 'src/app/actividad/services/actividad.service';
import swal from 'sweetalert';
import { TipoGEService } from 'src/app/gestion/services/tipoGE.service';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.listar.component.html',
  styleUrls: ['./tarea.listar.component.scss']
})
export class TareaListarComponent {
  title = 'listarTarea';
  tareas: any[] = [];
  usuarios : any[]=[];
  actgesactestrategicas : any [] = [];
  actividadNombre:any;
  sprintNombre:any;
  gestionNombre:any;
  idSprintSeleccionado:any;
  idActGestionSeleccionado:any;
  idActGestionActEstrategicaSeleccionado:any;
  idASE:any;
  form:FormGroup;
  busqueda: any;

  constructor(
    private tareaService: TareaService,private auth: AuthService,
    private sprintService: SprintService,private tipoService:TipoGEService,
    private actividadService:ActividadService,private usuarioService:UsuarioService,
    private route: ActivatedRoute,private formBuilder: FormBuilder
  ) {this.form = this.formBuilder.group({
    estado: ['', Validators.required],
  });}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const idActividadGestion = params['idActividadGestion'];
      const idSprint = params['idSprint'];
      const idActividadGestionActividadEstrategica = params['idActividadGestionActividadEstrategica'];
      const tipo = params['tipoASE'];
      if(idSprint){
        this.sprintService.listarSprintPorId(idSprint,this.auth.obtenerHeader()).subscribe(
          (data: any) => {
            this.sprintNombre = data.nombre;
            this.idASE = data.idSprint
            this.cargarTareas(idSprint,tipo); // Asignar el nombre del Pat a patNombre
          },
        );
      }
      else if(idActividadGestion){
        this.tipoService.listarGestionPorId(idActividadGestion,this.auth.obtenerHeader()).subscribe(
          (data: any) => {
            this.gestionNombre = data.nombre;
            this.idASE = data.idActividadGestion
            this.cargarTareas(idActividadGestion,tipo); // Asignar el nombre del Pat a patNombre
          },
        );
      }
      else if(idActividadGestionActividadEstrategica){
        this.actividadService.listarActividadGestionActividadEstrategicaPorId(idActividadGestionActividadEstrategica,this.auth.obtenerHeader()).subscribe(
          (data: any) => {
            this.actividadNombre = data.nombre;
            this.idASE = data.idActividadGestionActividadEstrategica
            this.cargarTareas(idActividadGestionActividadEstrategica,tipo); // Asignar el nombre del Pat a patNombre
          },
        );
        this.tareas.forEach(tarea => {
          tarea.estado = {
            EN_BACKLOG: tarea.estado === 'EN_BACKLOG',
            EN_PROCESO: tarea.estado === 'EN_PROCESO',
            TERMINADO: tarea.estado === 'TERMINADO',
            IMPEDIMENTO: tarea.estado === 'IMPEDIMENTO',
          };
        });
      }
      

      
    });
    this.cargarUsuario();
  }
  isEstado(tareaEstado:any, estado:any) {
    return tareaEstado === estado;
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
  obtenerNombreUsuario(idUsuario: number) {
    const usuario = this.usuarios.find((u) => u.idUsuario === idUsuario);
    return usuario ? usuario.nombre + " " + usuario.apellidos : '';
  }

  cargarTareas(idASE: number, tipoASE: string) {
    if (tipoASE === 'SPRINT') {
      this.tareaService
        .listarTareaPorSprint(idASE, this.auth.obtenerHeader()) 
        .toPromise()
        .then(
          (data: any) => {
            this.tareas = data;
          },
          (error) => {
            swal(error.error.mensajeTecnico);
          }
        );
    } 
    else if(tipoASE === 'ACTIVIDAD_GESTION'){
      this.tareaService
        .listarTareaPorActvidadGestion(idASE, this.auth.obtenerHeader()) 
        .toPromise()
        .then(
          (data: any) => {
            this.tareas = data;
          },
          (error) => {
            swal(error.error.mensajeTecnico);
          }
        );
    }
    else if(tipoASE === 'ACTIVIDAD_GESTION_ACTIVIDAD_ESTRATEGICA'){

      this.tareaService
        .listarTareaPorActvidadGestionActividadEstrategica(idASE, this.auth.obtenerHeader()) 
        .toPromise()
        .then(
          (data: any) => {
            this.tareas = data;
          },
          (error) => {
            swal(error.error.mensajeTecnico);
          }
        );
    }
  }
  
  eliminar(idTarea: number) {
    const tareaAEliminar = this.tareas.find(t => t.idTarea === idTarea);

      swal({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar este elemento.",
        icon: "warning",
        buttons: ["Cancelar", "Eliminar"],
        dangerMode: true,
      })
      .then((confirmacion) => {
      if (confirmacion) {
        this.tareaService.eliminarTarea(idTarea, this.auth.obtenerHeader()).subscribe(
          (response) => {
            swal("Eliminado Satisfactoriamente", "El proyecto con el nombre " + tareaAEliminar.nombre + " se ha eliminado.", "success").then(() => {
              window.location.reload();
            });
            console.log(response);
          },
          (error) => {
            swal("Solicitud no válida", error.error.mensajeHumano, "error");
          }
        );
      }
      });
  }
  modificarTarea() {
    if (this.form.valid && this.idActGestionSeleccionado) {
      const estado = this.form.get('estado')?.value;
      const tarea = {
        estado: estado,
      };
      this.tareaService
        .modificarTarea(tarea, this.idActGestionSeleccionado, this.auth.obtenerHeader())
        .subscribe(
          (response) => {
            swal({
              title: "Modificado Satisfactoriamente",
              text: "La gestión del área se ha modificado",
              icon: "success",
            }).then((value) => {
              location.reload();
            });
          },
          (error) => {
            swal(error.error.mensajeTecnico, "warning");
          }
        );
    }
  }
  obtenerSprint(idSprint: number,sprint:any) {
    this.idSprintSeleccionado = idSprint;
    this.sprintNombre = sprint.nombre;
  }
  obtenerActividadGestion(idActividadGestion: number,actividadGestion:any) {
    this.idActGestionSeleccionado = idActividadGestion;
    this.gestionNombre = actividadGestion.nombre;
  }

  obtenerActividadGestionActividadEstrategica(idActividadGestionActividadEstrategica: number,actividadGestionActividadEstrategica:any) {
    this.idActGestionActEstrategicaSeleccionado = idActividadGestionActividadEstrategica;
    this.actividadNombre = actividadGestionActividadEstrategica.nombre;
  }


  obtenerNombre() : any{
    if(this.sprintNombre){
      return this.sprintNombre;
    } else if (this.actividadNombre){
      return this.actividadNombre;
    } else if (this.gestionNombre){
      return this.gestionNombre;
    }
  }

}
