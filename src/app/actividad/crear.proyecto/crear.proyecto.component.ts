import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EModalidad } from 'src/enums/emodalidad';
import { AuthService } from 'src/app/login/auth/auth.service';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { ActividadService } from '../services/actividad.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/modelo/usuario';
@Component({
  selector: 'app-root',
  templateUrl: './crear.proyecto.component.html',
  styleUrls: ['./crear.proyecto.component.scss'] // Verifica esta ruta
})
export class CrearProyectoComponent {
  ESTE_CAMPO_ES_OBLIGARORIO: string = 'Este campo es obligatorio*';
  title = 'crearProyecto';
  usuarios: Usuario[] = [];
  actividadNombre:any;
  idActividadEstrategica:number = 0;
  modalidadEnums = Object.values(EModalidad);
  form: FormGroup;

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
      valorEjecutado: [0, Validators.required],
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
        this.usuarios = data.sort((a:any, b:any) => a.nombre.localeCompare(b.nombre));
    });
  }

  crearActividadOProyecto() {
    if(this.form.valid){
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
    } else {
      return Object.values(this.form.controls).forEach(control =>{
        control.markAllAsTouched();
      })
    }
  }

  handleSuccessResponse(type: string) {
    Swal.fire({
      title:'Creado',
      text: `El ${type} se ha creado!!`,
      icon:'success',
      position: "center",
      showConfirmButton: false,
      timer: 1500,
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
  get presupuestoVacio(){
    return this.form.get('presupuesto')?.invalid && this.form.get('presupuesto')?.touched;
  }
  get modalidadVacio(){
    return this.form.get('modalidad')?.invalid && this.form.get('modalidad')?.touched;
  }
  get valorEjecutadoVacio(){
    return this.form.get('valorEjecutado')?.invalid && this.form.get('valorEjecutado')?.touched;
  }
  get planeacionSprintVacio(){
    return this.form.get('planeacionSprint')?.invalid && this.form.get('planeacionSprint')?.touched;
  }
}
