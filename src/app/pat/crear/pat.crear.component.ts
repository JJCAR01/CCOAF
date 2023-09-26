import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { PatService } from '../services/pat.service';
import { AuthService } from 'src/app/login/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './pat.crear.component.html',
  styleUrls: ['./pat.crear.component.scss']
})
export class PatCrearComponent {
  title = 'crearPat';
  usuarios: any[] = [];
  form:FormGroup;
  
  constructor(private patService:PatService,private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,private auth:AuthService) 
  { this.form = this.formBuilder.group({
    nombre: ['', Validators.required],
    fechaAnual: ['', Validators.required],
    porcentaje: ['', Validators.required],
    proceso: ['', Validators.required],
    idUsuario: ['', Validators.required], 
  }); }

  ngOnInit(): void {
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

  crearPat() { 
    if (this.form.valid) {
      const nombre = this.form.get('nombre')?.value;
      const fechaAnual = this.form.get('fechaAnual')?.value;
      const porcentaje = this.form.get('porcentaje')?.value;
      const proceso = this.form.get('proceso')?.value;
      const idUsuarioSeleccionado = parseInt(this.form.get('idUsuario')?.value);

      const usuarioSeleccionado = this.usuarios.find(user =>  user.idUsuario === idUsuarioSeleccionado);

      if (nombre !== null && usuarioSeleccionado) {
        const cargo = {
          nombre: nombre,
          fechaAnual: fechaAnual,
          porcentaje: porcentaje,
          proceso: proceso,
          idUsuario: usuarioSeleccionado.idUsuario,
        };
        // Luego, envía 'cargo' al backend usando tu servicio.
        this.patService.crearPat(cargo,this.auth.obtenerHeader()).subscribe(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.error("Error en la solicitud al backend:", error);
          }
        );
      }
    }
  }
}