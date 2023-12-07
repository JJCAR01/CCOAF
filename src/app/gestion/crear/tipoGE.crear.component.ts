import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { TipoGEService } from '../services/tipoGE.service';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tipo-ge.crear',
  templateUrl: './tipoGE.crear.component.html',
  styleUrls: ['./tipoGE.crear.component.scss']
})
export class TipoGECrearComponent implements OnInit {
  title = 'crearTipoGE';
  usuarios: any[] = [];
  form: FormGroup;
  patNombre:any;
  idPat:any;
  tipoActividadEstrategica: boolean = false;
  tipoActividadGestion: boolean = false;
  tipoActividad: string = ''; // Variable para rastrear el tipo de actividad

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
    },
      (error) => {
        console.log(error);
      }
    );
  }

  crearActividad() {
    if (this.form.valid && this.tipoActividad) {
      const nombre = this.form.get('nombre')?.value;
      const fechaInicial = this.form.get('fechaInicial')?.value;
      const fechaFinal = this.form.get('fechaFinal')?.value;
      const idUsuarioSeleccionado = parseInt(this.form.get('idUsuario')?.value);

      const usuarioSeleccionado = this.usuarios.find(user =>  user.idUsuario === idUsuarioSeleccionado);

      if (nombre !== null) {
        const actividad = {
          nombre: nombre,
          fechaInicial: fechaInicial,
          fechaFinal: fechaFinal,
          idPat: this.idPat, 
          idUsuario: usuarioSeleccionado.idUsuario,
        };
        if (this.tipoActividad === 'estrategica') {
          this.tipoService.crearActividadEstrategica(actividad,this.auth.obtenerHeader()).subscribe(
            (response) => {
              Swal.fire("Creado!!!", 'La actividad estratégica se ha creado!!', "success");
              this.form.reset();
            },
            (error) => {
              Swal.fire("Error",error.error.mensajeTecnico,"error");
            }
          );
        } else if (this.tipoActividad === 'gestion') {
          this.tipoService.crearGestion(actividad,this.auth.obtenerHeader()).subscribe(
            (response) => {
              Swal.fire("Creado!!!", 'La gestión del área se ha creado!!', "success");
              this.form.reset();
            },
            (error) => {
              Swal.fire("Error",error.error.mensajeTecnico,"error");
            }
          );
        }
        this.form.reset();
        this.tipoActividad = ''; // Reinicia el tipo de actividad
        this.tipoActividadEstrategica = false; // Reinicia el estado de los checkboxes
        this.tipoActividadGestion = false;
        }
      }
  }

  toggleTipoActividad(tipo: string) {
    if (tipo === 'estrategica') {
      this.tipoActividadEstrategica = true;
      this.tipoActividadGestion = false;
      this.tipoActividad = 'estrategica'
    } else if (tipo === 'gestion') {
      this.tipoActividadGestion = true;
      this.tipoActividadEstrategica = false;
      this.tipoActividad = 'gestion'
    }
  } 
}
