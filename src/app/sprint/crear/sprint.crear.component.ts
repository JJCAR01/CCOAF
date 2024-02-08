import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login/auth/auth.service';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { SprintService } from '../services/sprint.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.crear.component.html',
  styleUrls: ['./sprint.crear.component.scss']
})
export class SprintCrearComponent implements OnInit{
  title = 'crearSprint';
  ESTE_CAMPO_ES_OBLIGARORIO: string = 'Este campo es obligatorio*';
  usuarios: any[] = [];
  form: FormGroup;
  patNombre:any;
  proyectoNombre:any;
  idProyecto:any;
  tipoActividadGestionActividadEstrategica: boolean = false;
  tipoProyecto: boolean = false;
  tipo: string = ''; // Variable para rastrear el tipo de actividad

  constructor(private formBuilder: FormBuilder, private auth: AuthService,
    private sprintService:SprintService, private usuarioService:UsuarioService,
    private route: ActivatedRoute) {
    this.form = this.formBuilder.group({
      descripcion: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idProyecto = params['idProyecto'];
      this.proyectoNombre = params['proyectoNombre'];
      this.patNombre = params['patNombre']
    })
    this.cargarUsuarios();
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
  crearSprint() { 
    if(this.form.valid){
      const descripcion = this.form.get('descripcion')?.value;
      const fechaInicial = this.form.get('fechaInicial')?.value;
      const fechaFinal = this.form.get('fechaFinal')?.value;

      if (descripcion !== null) {
        const sprint = {
          descripcion: descripcion,
          fechaInicial: fechaInicial,
          fechaFinal: fechaFinal,
          idProyecto: this.idProyecto, 
        };
          // Luego, envía 'cargo' al backend usando tu servicio.
          this.sprintService.crearSprint(sprint,this.auth.obtenerHeader()).subscribe(
            (response) => {
              Swal.fire({
                title:'Creado!!!',
                text: "El sprint se ha eliminado.",
                icon: "success",
                confirmButtonColor: '#0E823F'
              });
              this.form.reset();
            },
            (error) => {
              Swal.fire({
                title:'Solicitud no válida!',
                text: error.error.mensajeTecnico,
                icon: "error",
                confirmButtonColor: '#0E823F',
              });
            }
          );
      }
    } else {
      return this.form.markAllAsTouched();
    }
  }
  
  get descripcionVacio(){
    return this.form.get('descripcion')?.invalid && this.form.get('descripcion')?.touched;
  }
  get fechaInicialVacio(){
    return this.form.get('fechaInicial')?.invalid && this.form.get('fechaInicial')?.touched;
  }
  get fechaFinalVacio(){
    return this.form.get('fechaFinal')?.invalid && this.form.get('fechaFinal')?.touched;
  }

}
