import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login/auth/auth.service';
import { Usuario } from 'src/app/modelo/usuario';
import { TipoGEService } from '../services/tipoGE.service';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { EModalidad } from 'src/enums/emodalidad';

@Component({
  selector: 'app-root',
  templateUrl: './crear.proyectoarea.component.html',
  styleUrls: ['./crear.proyectoarea.component.scss']
})
export class CrearProyectoareaComponent {
  title = 'crearProyectoArea';
  ESTE_CAMPO_ES_OBLIGARORIO: string = 'Este campo es obligatorio*';
  usuarios: Usuario[] = [];
  modalidadEnums = Object.values(EModalidad);
  patNombre:string | undefined ;
  idPat:number  = 0;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private auth: AuthService,
    private tipoService:TipoGEService, private usuarioService:UsuarioService,
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
      this.idPat = params['idPat'];
      this.patNombre = params['patNombre'];
    })
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.listarUsuario(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.usuarios = data.sort((a:any, b:any) => a.nombre.localeCompare(b.nombre));
    });
  }

  crearProyectoArea() {
    if(this.form.valid){
      const nombre = this.form.get('nombre')?.value;
      const fechaInicial = this.form.get('fechaInicial')?.value
      const fechaFinal = this.form.get('fechaFinal')?.value
      const presupuesto = this.form.get('presupuesto')?.value
      const modalidad = this.form.get('modalidad')?.value
      const valorEjecutado = this.form.get('valorEjecutado')?.value
      const planeacionSprint = this.form.get('planeacionSprint')?.value
      const idUsuario = this.form.get('idUsuario')?.value
      const proyecto = {
        idPat:this.idPat,
        nombre: nombre,
        fechaFinal:fechaFinal,
        fechaInicial:fechaInicial,
        presupuesto:presupuesto,
        modalidad:modalidad,
        valorEjecutado:valorEjecutado,
        planeacionSprint:planeacionSprint,
        idUsuario:idUsuario
      };
          this.tipoService.crearProyectoArea(proyecto,this.auth.obtenerHeader()).subscribe(
            (response) => {
              Swal.fire({
                title:"Creado!!!", 
                text:'El proyecto del área se ha creado!!',
                icon:'success',
                position: "center",
                showConfirmButton: false,
                timer: 1500
              });
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
