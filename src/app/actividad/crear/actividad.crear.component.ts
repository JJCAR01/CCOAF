import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login/auth/auth.service';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { ActividadService } from '../services/actividad.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Proyecto } from './proyecto';
import { ActividadGestion } from './actividadgestion';

@Component({
  selector: 'app-crear',
  templateUrl: './actividad.crear.component.html',
  styleUrls: ['./actividad.crear.component.scss']
})
export class ActividadCrearComponent implements OnInit{
  title = 'crearActividad';
  proyecto:Proyecto = new Proyecto();
  actividad:ActividadGestion = new ActividadGestion();
  usuarios: any[] = [];
  form: FormGroup;
  actividadNombre:any;
  idActividadEstrategica:any;
  tipoActividadGestionActividadEstrategica: boolean = false;
  tipoProyecto: boolean = false;
  tipo: string = ''; // Variable para rastrear el tipo de actividad

  constructor(private formBuilder: FormBuilder, private auth: AuthService,
    private actividadService:ActividadService, private usuarioService:UsuarioService,
    private route: ActivatedRoute) {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      idUsuario: ['', Validators.required],
      presupuesto: [null], // Agrega otros campos según sea necesario
      modalidad: [''],
      valorEjecutado: [''],
      planeacionSprint: [''],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idActividadEstrategica = params['idActividadEstrategica'];
      this.actividadNombre = params['actividadNombre'];
    })
    this.cargarUsuarios();
    this.iniciarFormulario();
  }

  iniciarFormulario() {
    this.form = this.formBuilder.group({
      idActividadEstrategica: [this.idActividadEstrategica],
      nombre: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      idUsuario: ['', Validators.required],
      presupuesto: [null],
      modalidad: [''],
      valorEjecutado: [''],
      planeacionSprint: [''],
    });
  }

  cargarUsuarios() {
    this.usuarioService.listarUsuario(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.usuarios = data;
    },
      (error) => {
        console.log(error);
      }
    );
  }

  crearActividadOProyecto() {
    this.actividad.idActividadEstrategica = this.idActividadEstrategica;
    this.proyecto.idActividadEstrategica = this.idActividadEstrategica;

    if (this.tipo === 'gestion') {
      this.actividadService
        .crearActividadGestionActividadEstrategica(this.form.value, this.auth.obtenerHeader())
        .subscribe(
          (response) => {
            this.handleSuccessResponse('actividad estratégica');
          },
          (error) => {
            this.handleErrorResponse(error);
          }
        );
    } else if (this.tipo === 'proyecto') {
      this.actividadService
        .crearProyecto(this.form.value, this.auth.obtenerHeader())
        .subscribe(
          (response) => {
            this.handleSuccessResponse('proyecto');
          },
          (error) => {
            this.handleErrorResponse(error);
          }
        );
    }
    this.form.reset();
    this.tipo = ''; // Reinicia el tipo de actividad
    this.tipoActividadGestionActividadEstrategica = false; // Reinicia el estado de los checkboxes
    this.tipoProyecto = false;
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
    this.tipo = ''; // Reset the type of activity
    this.tipoActividadGestionActividadEstrategica = false; // Reset checkbox state
    this.tipoProyecto = false;
  }
  handleErrorResponse(error: any) {
    Swal.fire('Error', error.error.mensajeHumano, 'error');
  }


  toggleTipoActividad(tipo: string) {
    if (tipo === 'gestion') {
        this.tipoActividadGestionActividadEstrategica = !this.tipoActividadGestionActividadEstrategica;
        this.tipoProyecto = false;
        this.tipo = 'gestion'
    } else if (tipo === 'proyecto') {
        this.tipoProyecto = !this.tipoProyecto;
        this.tipoActividadGestionActividadEstrategica = false;
        this.tipo = 'proyecto'
    }
} 
}
