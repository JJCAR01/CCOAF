import { Component } from '@angular/core';
import { PatService } from '../services/pat.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import swal from 'sweetalert';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './pat.listar.component.html',
  styleUrls: ['./pat.listar.component.scss']
})
export class PatListarComponent {
  title = 'listarPat';
  pats: any[] = [];
  usuarios:any[] =[];
  busqueda: any;
  selectedPatId: number | null = null;
  nombrePatSeleccionado:any;
  form:FormGroup;
  
    constructor(private patService: PatService,private auth:AuthService,
      private usuarioService:UsuarioService, private formBuilder: FormBuilder) 
      {
        this.form = this.formBuilder.group({
          fechaAnual: ['', Validators.required],
          proceso: ['', Validators.required],
        }); 
       }  

    ngOnInit() {
      this.cargarPats();
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


    cargarPats() {
      this.patService.listarPat(this.auth.obtenerHeader()).toPromise().then(
        (data: any) => {
          this.pats = data;
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
    
}