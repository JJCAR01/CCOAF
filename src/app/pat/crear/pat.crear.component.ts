import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { PatService } from '../services/pat.service';

@Component({
  selector: 'app-root',
  templateUrl: './pat.crear.component.html',
  styleUrls: ['./pat.crear.component.scss']
})
export class PatCrearComponent {
  title = 'crearPat';
  usuarios: any[] = [];
  form:FormGroup;
  
  constructor(private patService:PatService,private usuarioService: UsuarioService,private formBuilder: FormBuilder) 
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
    this.usuarioService.listarUsuario().subscribe(
      (data: any) => {
        this.usuarios = data;
        console.log(this.usuarios);
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

      console.log("ID de usuario seleccionado:", idUsuarioSeleccionado);
      // Busca el objeto de área correspondiente según el idArea seleccionado
      const usuarioSeleccionado = this.usuarios.find(user =>  user.idUsuario === idUsuarioSeleccionado);
      console.log(usuarioSeleccionado.idUsuario);

      if (nombre !== null && usuarioSeleccionado) {
        const cargo = {
          nombre: nombre,
          fechaAnual: fechaAnual,
          porcentaje: porcentaje,
          proceso: proceso,
          idUsuario: usuarioSeleccionado.idUsuario,
        };
        // Luego, envía 'cargo' al backend usando tu servicio.
        this.patService.crearPat(cargo).subscribe(
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