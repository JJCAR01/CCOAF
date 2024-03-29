import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login/auth/auth.service';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { ActividadService } from '../services/actividad.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { EModalidad } from 'src/enums/emodalidad';
import { Usuario } from 'src/app/modelo/usuario';

@Component({
  selector: 'app-crear',
  templateUrl: './actividad.crear.component.html',
  styleUrls: ['./actividad.crear.component.scss']
})
export class ActividadCrearComponent implements OnInit{
  title = 'crearActividad';
  ESTE_CAMPO_ES_OBLIGARORIO: string = 'Este campo es obligatorio*';
  usuarios: Usuario[] = [];
  actividadNombre:any;
  idActividadEstrategica:number = 0;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private auth: AuthService,
    private actividadService:ActividadService, private usuarioService:UsuarioService,
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
      this.idActividadEstrategica = params['idActividadEstrategica'];
      this.actividadNombre = params['actividadNombre'];
    })
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.listarUsuario(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.usuarios = data.sort((a:any, b:any) => a.nombre.localeCompare(b.nombre));
    });
  }

  crearActividadOProyecto() {
    if(this.form.valid){
      const nombre = this.form.get('nombre')?.value;
      const fechaInicial = this.form.get('fechaInicial')?.value
      const fechaFinal = this.form.get('fechaFinal')?.value
      const idUsuario = this.form.get('idUsuario')?.value
      const idActividadEstrategica = this.idActividadEstrategica
      const actividadGestion = {
        idActividadEstrategica:idActividadEstrategica,
        nombre: nombre,
        fechaFinal:fechaFinal,
        fechaInicial:fechaInicial,
        idUsuario:idUsuario
      };
        this.actividadService
          .crearActividadGestionActividadEstrategica(actividadGestion, this.auth.obtenerHeader()).subscribe(
            () => {
              this.handleSuccessResponse('Actividad de gestión');
            },
            (error) => {
              this.handleErrorResponse(error);
            }
          );
    } else {
      return this.form.markAllAsTouched();
    }
  }

  handleSuccessResponse(type: string) {
    Swal.fire({
      title:'Creado',
      text: `El ${type} se ha creado!!`,
      icon:'success',
      position: "center",
      showConfirmButton: false,
      timer: 1500
    }
    );
    this.form.reset();

  }
  handleErrorResponse(error: any) {
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
