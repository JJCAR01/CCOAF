import { Component } from '@angular/core';
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
export class ActividadCrearComponent {
  title = 'crearActividad';
  proyecto:Proyecto = new Proyecto();
  actividad:ActividadGestion = new ActividadGestion();
  usuarios: any[] = [];
  form: FormGroup;
  patNombre:any;
  idPat:any;
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
    },
      (error) => {
        console.log(error);
      }
    );
  }

  crearActividadOProyecto() {


        if (this.tipo === 'gestion') {
          this.actividadService.crearActividadGestionActividadEstrategica(this.actividad,this.auth.obtenerHeader()).subscribe(
            (response) => {
              Swal.fire("Creado Satisfactoriamente", 'El actividad estratégica con el nombre ' + this.form.value.nombre + ', se ha creado!!', "success");
            },
            (error) => {
              Swal.fire("Error",error.error.mensajeTecnico,"error");
            }
          );
        } else if (this.tipo === 'proyecto') {
          this.actividadService.crearProyecto(this.proyecto,this.auth.obtenerHeader()).subscribe(
            (response) => {
              Swal.fire("Creado Satisfactoriamente", 'La gestión del área con el nombre ' + this.form.value.nombre + ', se ha creado!!', "success");
            },
            (error) => {
              Swal.fire("Error",error.error.mensajeTecnico,"error");
            }
          );
        }

        Swal.fire("Creado Satisfactoriamente", `La actividad ${this.tipo} con el nombre '${this.form.value.nombre}' se ha creado!!`, "success");
        this.form.reset();
        this.tipo = ''; // Reinicia el tipo de actividad
        this.tipoActividadGestionActividadEstrategica = false; // Reinicia el estado de los checkboxes
        this.tipoProyecto = false;
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
