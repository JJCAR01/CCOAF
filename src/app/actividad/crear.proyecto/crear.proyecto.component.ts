import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EModalidad } from '../listar/emodalidad';
import { AuthService } from 'src/app/login/auth/auth.service';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { ActividadService } from '../services/actividad.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-root',
  templateUrl: './crear.proyecto.component.html',
  styleUrls: ['./crear.proyecto.component.scss'] // Verifica esta ruta
})
export class CrearProyectoComponent {
  title = 'crearProyecto';
  usuarios: any[] = [];
  form: FormGroup;
  actividadNombre:any;
  idActividadEstrategica:any;
  modalidadEnums = Object.values(EModalidad);

  constructor(private formBuilder: FormBuilder, private auth: AuthService,
    private actividadService:ActividadService, private usuarioService:UsuarioService,
    private route: ActivatedRoute) {

    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      idUsuario: ['', Validators.required],
      presupuesto: ['', Validators.required], // Agrega otros campos según sea necesario
      modalidad: ['', Validators.required],
      valorEjecutado: ['', Validators.required],
      planeacionSprint: ['', Validators.required],
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
    const presupuesto = this.form.get('presupuesto')?.value
    const modalidad = this.form.get('modalidad')?.value
    const valorEjecutado = this.form.get('valorEjecutado')?.value
    const planeacionSprint = this.form.get('planeacionSprint')?.value
    const idUsuario = this.form.get('idUsuario')?.value
    const idActividadEstrategica = this.idActividadEstrategica
    const proyecto = {
      idActividadEstrategica:idActividadEstrategica,
      nombre: nombre,
      fechaFinal:fechaFinal,
      fechaInicial:fechaInicial,
      presupuesto:presupuesto,
      modalidad:modalidad,
      valorEjecutado:valorEjecutado,
      planeacionSprint:planeacionSprint,
      idUsuario:idUsuario
    };
    this.actividadService
        .crearProyecto(proyecto, this.auth.obtenerHeader()).subscribe(
          (response) => {
            this.handleSuccessResponse('proyecto');
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
