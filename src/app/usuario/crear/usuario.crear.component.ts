import { Component } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { CargoService } from 'src/app/cargo/services/cargo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login/auth/auth.service';
import swal from 'sweetalert';

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
  
  constructor(private usuarioService: UsuarioService, private formBuilder: FormBuilder, private cargoService:CargoService
    ,private auth:AuthService) 
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
    this.cargoService.listar(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.cargos = data;
    },
      (error) => {
        console.log(error);
      }
    );
  }

  crearUsuario() {
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

      this.usuarioService.crearUsuario(usuarioData,this.auth.obtenerHeader()).subscribe(
        (response) => {
          swal("Creado Satisfactoriamente", 'El area con el nombre ' + this.form.value.nombre + this.form.value.apellido + ', se ha creado!!', "success");
            this.form.reset();
          console.log(response);
        },
        (error) => {
          swal(error.error.mensajeHumano,"warning");
        }
      );
    }
    this.form.reset();
  }
}