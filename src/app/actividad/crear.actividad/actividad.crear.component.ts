import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login/auth/auth.service';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { ActividadService } from '../services/actividad.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { EModalidad } from 'src/enums/emodalidad';

@Component({
  selector: 'app-crear',
  templateUrl: './actividad.crear.component.html',
  styleUrls: ['./actividad.crear.component.scss']
})
export class ActividadCrearComponent implements OnInit{
  title = 'crearActividad';
  usuarios: any[] = [];
  form: FormGroup;
  actividadNombre:any;
  idActividadEstrategica:any;

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
        this.usuarios = data;
    });
  }

  crearActividadOProyecto() {
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
  }

  handleSuccessResponse(type: string) {
    Swal.fire({
      title:'Creado',
      text: `El ${type} se ha creado!!`,
      icon:'success',
      confirmButtonColor: '#0E823F',
    }
    );
    this.form.reset();

  }
  handleErrorResponse(error: any) {
    Swal.fire(
      {
        title:"Error!!!",
        text:error.error.mensajeTecnico, 
        icon:"error",
        confirmButtonColor: '#0E823F',
      }
    );
  }

}
