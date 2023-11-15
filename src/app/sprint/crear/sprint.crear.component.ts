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
  usuarios: any[] = [];
  form: FormGroup;
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
            Swal.fire("Creado Satisfactoriamente", 'El sprint con el nombre ' + sprint.descripcion + ', se ha creado!!', "success");
            this.form.reset();
          },
          (error) => {
            Swal.fire("Error",error.error.mensajeTecnico,"error");
          }
        );
  }
}}
