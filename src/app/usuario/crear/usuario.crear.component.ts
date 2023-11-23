import { Component } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { CargoService } from 'src/app/cargo/services/cargo.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';

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
      cpassword: ['', Validators.required],  // Agrega el control para confirmar la contraseña
    }, {
      validators : matchpassword
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
          Swal.fire("Creado Satisfactoriamente", 'El area con el nombre ' + usuarioData.nombre + ', se ha creado!!', "success");
            this.form.reset();
          console.log(response);
        },
        (error) => {
          Swal.fire('Error!!!',error.error.mensajeHumano,"warning");
        }
      );
    }
    this.form.reset();
  }

}

const matchpassword :ValidatorFn = (control:AbstractControl):ValidationErrors|null =>{

  let password = control.get('password');
  let cpassword = control.get('cpassword');
  if(password && cpassword && password?.value != cpassword?.value){
    return{
      passwordMatchError : true
    }
  }
  return null;
}