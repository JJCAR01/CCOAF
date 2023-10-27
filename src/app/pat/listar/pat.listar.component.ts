import { Component, OnInit } from '@angular/core';
import { PatService } from '../services/pat.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import swal from 'sweetalert';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoGEService } from 'src/app/gestion/services/tipoGE.service';
import { ActividadService } from 'src/app/actividad/services/actividad.service';

@Component({
  selector: 'app-root',
  templateUrl: './pat.listar.component.html',
  styleUrls: ['./pat.listar.component.scss']
})
export class PatListarComponent implements OnInit{
  title = 'listarPat';
  pats: any[] = [];
  usuarios:any[] =[];
  busqueda: any;
  selectedPatId: number | null = null;
  nombrePatSeleccionado:any;
  cantidadPats:any;
  cantidadProyectos:any;
  cantidadGestiones:any;
  cantidadEstrategicas:any;
  form:FormGroup;
  
    constructor(private patService: PatService,private auth:AuthService,
      private usuarioService:UsuarioService, private formBuilder: FormBuilder,
      private tipoService:TipoGEService, private actividadService:ActividadService) 
      {
        this.form = this.formBuilder.group({
          fechaAnual: ['', Validators.required],
          proceso: ['', Validators.required],
        }); 
       }  

    ngOnInit() {
      this.cargarPats();
      this.cargarUsuario();
      this.cargarActividadesEstrategica();
      this.cargarPatsActividadGestion();
      this.cargarPatsProyectos();
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


    cargarPats() {
      this.patService.listarPat(this.auth.obtenerHeader()).toPromise().then(
        (data: any) => {
          this.pats = data;
          const numeroDeListas = Object.keys(data).length;
          this.cantidadPats = numeroDeListas;
        },
        (error) => {
          swal(error.error.mensajeTecnico);
        }
      );
    }
    cargarActividadesEstrategica() {
      this.tipoService.listarActividadEstrategica(this.auth.obtenerHeader()).toPromise().then(
        (data: any) => {
          const numeroDeListas = Object.keys(data).length;
          this.cantidadEstrategicas = numeroDeListas;
        },
        (error) => {
          swal(error.error.mensajeTecnico);
        }
      );
    }
    cargarPatsActividadGestion() {
      this.tipoService.listarGestion(this.auth.obtenerHeader()).toPromise().then(
        (data: any) => {
          const numeroDeListas = Object.keys(data).length;
          this.cantidadGestiones = numeroDeListas;
        },
        (error) => {
          swal(error.error.mensajeTecnico);
        }
      );
    }
    cargarPatsProyectos() {
      this.actividadService.listarProyecto(this.auth.obtenerHeader()).toPromise().then(
        (data: any) => {
          const numeroDeListas = Object.keys(data).length;
          this.cantidadProyectos = numeroDeListas;
        },
        (error) => {
          swal(error.error.mensajeTecnico);
        }
      );
    }

    modificarPat() {
      if (this.form.valid && this.selectedPatId) {
        const fechaAnual = this.form.get('fechaAnual')?.value;
        const proceso = this.form.get('proceso')?.value;
        const pat = {
          fechaAnual: fechaAnual,
          proceso: proceso,
        };
        this.patService
          .modificarPat(pat, this.selectedPatId, this.auth.obtenerHeader())
          .subscribe(
            (response) => {
              swal("Modificado Satisfactoriamente", "El PAT se ha modificado", "success");
              this.form.reset();
              window.location.reload()
            },
            (error) => {
              swal(error.error.mensajeTecnico, "warning");
            }
          );
      }
    }
    
    eliminarPat(idPat: number) {
      const patAEliminar = this.pats.find(pat => pat.idPat === idPat);

      swal({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar este elemento.",
        icon: "warning",
        buttons: ["Cancelar", "Eliminar"],
        dangerMode: true,
      })
      .then((confirmacion) => {
      if (confirmacion) {
        this.patService.eliminarPat(idPat, this.auth.obtenerHeader()).subscribe(
          (response) => {
            swal("Eliminado Satisfactoriamente", "El usuario con el nombre " + patAEliminar.nombre + " se ha eliminado.", "success").then(() => {
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

    obtenerNombreUsuario(idUsuario: number) {
      const usuario = this.usuarios.find((u) => u.idUsuario === idUsuario);
      return usuario ? usuario.nombre + " " + usuario.apellidos : '';
    }

    setSelectedPat(idPat: number,pat:any) {
      this.selectedPatId = idPat;
      this.nombrePatSeleccionado = pat.nombre;
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
    
    
    
}