import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { TipoGEService } from '../services/tipoGE.service';
import { PatService } from 'src/app/pat/services/pat.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root:not(p)',
  templateUrl: './tipoGE.listar.component.html',
  styleUrls: ['./tipoGE.listar.component.scss']
})

export class TipogeListarComponent implements OnInit {
  title = 'listarTipoGE';
  elementoSeleccionado: string = 'actividadese';
  gestiones: any[] = [];
  actividades: any[] = [];
  pats: any[] = [];
  usuarios:any[] =[];
  usuarioPat:any;
  porcentajePat:any;
  patNombre:any;
  anual:any;
  idPat:any;
  usuarioEstrategica:any;
  usuarioGestion:any;
  idActividadGestionSeleccionado:any;
  nombreActividadGestion:any;
  idActividadEstrategicaSeleccionado:any;
  nombreActividadEstrategica:any;
  form:FormGroup;

  constructor(
    private gestionService: TipoGEService,private auth: AuthService,
    private patService: PatService,private route: ActivatedRoute,
    private usuarioService :UsuarioService,private formBuilder: FormBuilder
  ) {this.form = this.formBuilder.group({
    nombre: ['', Validators.required],
    fechaInicial: ['', Validators.required],
    fechaFinal: ['', Validators.required],
  });}
  

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
          Swal.fire(error.error.mensajeTecnico,'','error');
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
            title : error.error.mensajeTecnico,
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
      confirmButtonText: "Confirmar",
      confirmButtonColor: "#3085d6",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    })
    .then((confirmacion) => {
      if (confirmacion.isConfirmed) {
        this.gestionService.eliminarGestion(idActividadGestion, this.auth.obtenerHeader()).subscribe(
          (response) => {
            Swal.fire("Se ha eliminado satisfactoriamente", "El pat con el nombre " + gestionAEliminar.nombre + " se ha eliminado.", "success").then(() => {
              window.location.reload();
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
      confirmButtonText: "Confirmar",
      confirmButtonColor: "#3085d6",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    })
    .then((confirmacion) => {
      if (confirmacion.isConfirmed) {
        this.gestionService.eliminarActividadEstrategica(idActividadEstrategica, this.auth.obtenerHeader()).subscribe(
          (response) => {
            Swal.fire("Se ha eliminado satisfactoriamente", "El pat con el nombre " + actividadAEliminar.nombre + " se ha eliminado.", "success").then(() => {
              window.location.reload();
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
    if (this.form.valid && this.idActividadGestionSeleccionado) {
      const nombre = this.form.get('nombre')?.value;
      const fechaInicial = this.form.get('fechaInicial')?.value;
      const fechaFinal = this.form.get('fechaFinal')?.value;
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
        confirmButtonText: "Confirmar",
        confirmButtonColor: "#3085d6",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
      }).then((confirmacion) => {
        if (confirmacion.isConfirmed) {
          this.gestionService
        .modificarActividadGestión(actividadGestion, this.idActividadGestionSeleccionado, this.auth.obtenerHeader())
        .subscribe(
          (response) => {
            Swal.fire({
              title: "Modificado Satisfactoriamente",
              text: "La gestión del área se ha modificado",
              icon: "success",
            }).then((value) => {
              location.reload();
            });
          },
          (error) => {
            Swal.fire(error.error.mensajeTecnico,'' ,"warning");
          }
        );
        }
      }) 
    }
  }
  modificarActividadEstrategica() {
    if (this.form.valid && this.idActividadEstrategicaSeleccionado) {
      const nombre = this.form.get('nombre')?.value;
      const fechaInicial = this.form.get('fechaInicial')?.value;
      const fechaFinal = this.form.get('fechaFinal')?.value;
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
        icon: "question",
        confirmButtonText: "Confirmar",
        confirmButtonColor: "#3085d6",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
      }).then((confirmacion) => {
        if (confirmacion.isConfirmed) {
        this.gestionService
        .modificarActividadEstrategica(actividadEstrategica, this.idActividadEstrategicaSeleccionado, this.auth.obtenerHeader())
        .subscribe(
          (response) => {
            Swal.fire({
              title: "Modificado Satisfactoriamente",
              text: "La actividad estrategica se ha modificado",
              icon: "success",
            }).then((value) => {
              location.reload();
            });
          },
          (error) => {
            Swal.fire(error.error.mensajeHumano,error.error.mensajeTecnico,"warning");
          }
          );
          }
        }) 
    }
  }

  obtenerActividadGestion(idActividadGestion: number,actividadGestion:any) {
    this.idActividadGestionSeleccionado = idActividadGestion;
    this.nombreActividadGestion = actividadGestion.nombre;
    this.usuarioGestion = actividadGestion.idUsuario
  }
  obtenerActividadEstrategica(idActividadEstrategica: number,actividadEstrategica:any) {
    this.idActividadEstrategicaSeleccionado = idActividadEstrategica;
    this.nombreActividadEstrategica = actividadEstrategica.nombre;
    this.usuarioEstrategica = actividadEstrategica.idUsuario
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
  

}
