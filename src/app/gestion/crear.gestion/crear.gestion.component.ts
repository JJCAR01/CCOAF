import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login/auth/auth.service';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { TipoGEService } from '../services/tipoGE.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/modelo/usuario';

@Component({
  selector: 'app-root',
  templateUrl: './crear.gestion.component.html',
  styleUrls: ['./crear.gestion.component.scss']
})
export class CrearGestionComponent {
  title = 'crearActividadGestion';
  ESTE_CAMPO_ES_OBLIGARORIO: string = 'Este campo es obligatorio*';
  usuarios: Usuario[] = [];
  patNombre:string | undefined ;
  idPat:number | 0 = 0;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private auth: AuthService,
    private tipoService:TipoGEService, private usuarioService:UsuarioService,
    private route: ActivatedRoute) {

    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      idUsuario: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idPat = params['idPat'];
      this.patNombre = params['patNombre'];
    })
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.listarUsuario(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.usuarios = data;
    });
  }

  crearActividad() {
    if(this.form.valid){
      const nombre = this.form.get('nombre')?.value;
      const fechaInicial = this.form.get('fechaInicial')?.value;
      const fechaFinal = this.form.get('fechaFinal')?.value;
      const idUsuario = this.form.get('idUsuario')?.value;
      const idPat = this.idPat

        const actividad = {
          nombre: nombre,
          fechaInicial: fechaInicial,
          fechaFinal: fechaFinal,
          idPat: idPat, 
          idUsuario: idUsuario,
        };

          this.tipoService.crearGestion(actividad,this.auth.obtenerHeader()).subscribe(
            (response) => {
              Swal.fire({
                title:"Creado!!!", 
                text:'La gestión del área se ha creado!!',
                icon: "success",
                confirmButtonColor: '#0E823F',});
              this.form.reset();
            },
            (error) => {
              Swal.fire({
                title:'Solicitud no válida!',
                text: error.error.mensajeHumano,
                icon: "error",
                confirmButtonColor: '#0E823F',
              });
            }
          );
    } else {
      return Object.values(this.form.controls).forEach(control =>{
        control.markAllAsTouched();
      })
    }
  }

    get nombreVacio(){
      return this.form.get('nombre')?.invalid && this.form.get('nombre')?.touched;
    }
    get fechaInicialVacio(){
      return this.form.get('fechaInicial')?.invalid && this.form.get('fechaInicial')?.touched;
    }
    get fechaFinalVacio(){
      return this.form.get('fechaFinal')?.invalid && this.form.get('fechaFinal')?.touched;
    }
    get idUsuarioVacio(){
      return this.form.get('idUsuario')?.invalid && this.form.get('idUsuario')?.touched;
    }
}
