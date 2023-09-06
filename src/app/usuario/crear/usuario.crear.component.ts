import { Component } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { CargoService } from 'src/app/cargo/services/cargo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './usuario.crear.component.html',
  styleUrls: ['./usuario.crear.component.scss']
})
export class UsuarioCrearComponent {
  title = 'crearUsuario';
  cargos: any[] = [];
  roles: any[] =[];
  form:FormGroup;
  
  constructor(private usuarioService: UsuarioService, private formBuilder: FormBuilder, private cargoService:CargoService) 
  { 
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', Validators.required],
      password: ['', Validators.required],
      idCargo: ['', Validators.required],
      rol: ['', Validators.required],

  }); 
}
  ngOnInit(): void {
    this.cargarCargos();
  }

  cargarCargos() {
    this.cargoService.listarCargo().subscribe(
      (data: any) => {
        this.cargos = data;
        console.log(this.cargos);
    },
      (error) => {
        console.log(error);
      }
    );
  }

  crearUsuario() {
    console.log(this.form.value);
    if (this.form.valid) {
      const usuarioData = {
        nombre: this.form.get('nombre')?.value,
        apellido: this.form.get('apellido')?.value,
        correo: this.form.get('correo')?.value,
        password: this.form.get('password')?.value,
        idCargo: this.form.get('idCargo')?.value,
        roles: [
          {
            rol: this.form.get('rol')?.value
          }
        ]
      };

      this.usuarioService.crearUsuario(usuarioData).subscribe(
        (response) => {
          console.log(response);
          // Realiza acciones adicionales después de crear el usuario si es necesario
        },
        (error) => {
          console.error("Error en la solicitud al backend:", error);
          // Maneja el error de manera adecuada
        }
      );
    }
    this.form.reset();
  }
}