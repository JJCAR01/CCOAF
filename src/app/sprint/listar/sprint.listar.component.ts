import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Component,Injectable,OnInit } from '@angular/core';
import { SprintService } from '../services/sprint.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { ActividadService } from 'src/app/actividad/services/actividad.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.listar.component.html',
  styleUrls: ['./sprint.listar.component.scss']
})
export class SprintListarComponent implements OnInit {
  title = 'listarSprint';
  sprints: any[] = [];
  proyectos: any[] = [];
  usuarios:any[] =[];
  nombreSprint:any;
  proyectoNombre:any;
  proyectoPorcentaje:any;
  proyectoUsuario:any;
  idProyecto:any;
  actividad:any;
  busqueda: any;

  constructor(
    private storage:AngularFireStorage,
    private sprintService: SprintService,
    private auth: AuthService,
    private actividadService: ActividadService,
    private route: ActivatedRoute,
    private usuarioService :UsuarioService,
    
  ) { 
  }

  ngOnInit() {
    // Obtén el valor de idPat de la URL
    this.route.params.subscribe(params => {
      const idProyecto = params['idProyecto'];
      this.actividadService.listarProyectoPorId(idProyecto,this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.proyectoNombre = data.nombre
          this.proyectoPorcentaje = data.avance
          this.proyectoUsuario = data.idUsuario
          this.idProyecto = data.idProyecto 
          this.actividad = data.idActividadEstrategica
        },
        (error) => {
          // Manejo de errores
        }
      );

      this.cargarSprints(idProyecto);
    });
    this.cargarUsuario();
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

  eliminarProyecto(idSprint: number) {
    const sprintAEliminar = this.sprints.find(s => s.idSprint === idSprint);

    Swal.fire({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar este elemento.",
        icon: "question",
        confirmButtonText: "Confirmar",
        confirmButtonColor: "#3085d6",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
      })
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
        this.sprintService.eliminarSprint(idSprint, this.auth.obtenerHeader()).subscribe(
          (response) => {
            Swal.fire("Eliminado Satisfactoriamente", "El sprint se ha eliminado.", "success").then(() => {
              window.location.reload();
            });
            console.log(response);
          },
          (error) => {
            Swal.fire("Solicitud no válida", error.error.mensajeHumano, "error");
          }
        );
      }
      });
  }

  obtenerSprint(sprint:any) {
    this.nombreSprint = sprint.descripcion;
  }
  
  async documento(event: any) {
    const file = event.target.files[0];

    if (file) {
      try {
        const path = `documento/${file.name}`;
        // Use AngularFireStorage service methods
        const task = this.storage.upload(path, file);
        const url = await task.snapshotChanges().toPromise().then(() => {
          return this.storage.ref(path).getDownloadURL();
        });

        // ... Do something with the URL if needed
      } catch (error) {
        console.error('Error al subir el archivo:', error);
      }
    }
  }

  agregarDocumento() {

  }
  modificarSprint(){
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

}
