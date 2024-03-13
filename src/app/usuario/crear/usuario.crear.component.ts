import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { CargoService } from 'src/app/cargo/services/cargo.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { DireccionService } from 'src/app/direccion/services/direccion.service';

@Component({
  selector: 'app-root',
  templateUrl: './usuario.crear.component.html',
  styleUrls: ['./usuario.crear.component.scss']
})
export class UsuarioCrearComponent implements OnInit {
  title = 'crearUsuario';
  ESTE_CAMPO_ES_OBLIGARORIO: string = 'Este campo es obligatorio*';
  listaDeDireccionesSeleccionadas: string[] = [];
  listaDeProcesosSeleccionadas: string[] = [];
  cargos: any[] = [];
  direcciones: any[] = [];
  roles: any[] =[];
  form:FormGroup;
  
  constructor(private usuarioService: UsuarioService, 
    private direccionService: DireccionService, 
    private formBuilder: FormBuilder, private cargoService:CargoService
    ,private auth:AuthService) 
  { 
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required,Validators.email]],
      password: ['', Validators.required],
      cpassword: ['', Validators.required], 
      idCargo: ['', Validators.required],
      rol: ['', Validators.required],
      direcciones: ['', Validators.required],
    }, 
    {
      validators : matchpassword
    });
  
  }
  ngOnInit(): void {
    this.cargarCargos();
    this.cargarDirecciones();
  }

  agregarDirecciones() {
    const direccionSeleccionada = this.form.get('direcciones')?.value;
    // Verificar si la dirección ya existe en la lista antes de agregarla
    if (!this.listaDeDireccionesSeleccionadas.includes(direccionSeleccionada)) {
      this.listaDeDireccionesSeleccionadas.push(direccionSeleccionada);
    }
  }
  
  cargarCargos() {
    this.cargoService.listar(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.cargos = data.sort((a:any, b:any) => a.nombre.localeCompare(b.nombre));
    });
  }

  cargarDirecciones() {
    this.direccionService.listar(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.direcciones = data.sort((a:any, b:any) => a.nombre.localeCompare(b.nombre));
    });
  }

  crearUsuario() {
    if (this.form.valid) {
      const usuarioData = {
        nombre: this.form.get('nombre')?.value,
        apellido: this.form.get('apellido')?.value,
        correo: this.form.get('correo')?.value,
        password: this.form.get('password')?.value,
        idCargo: this.form.get('idCargo')?.value,
        direcciones: this.listaDeDireccionesSeleccionadas,
        roles: [
          {
            rol: this.form.get('rol')?.value
          }
        ]
      };
      
      this.usuarioService.crearUsuario(usuarioData,this.auth.obtenerHeader()).subscribe(
        (response) => {
          Swal.fire(
            {
              title:"Creado!!!",
              text:'El usuario se ha creado.', 
              icon:'success',
              position: "center",
              showConfirmButton: false,
              timer: 1500,
            }
          );
            this.form.reset();
            this.listaDeDireccionesSeleccionadas = [];
        },
        (error) => {
          Swal.fire(
            {
              title:"Error!!!",
              text:error.error.mensajeTecnico, 
              icon:"error",
              confirmButtonColor: '#0E823F',
            }
          );
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
  get apellidoVacio(){
    return this.form.get('apellido')?.invalid && this.form.get('apellido')?.touched;
  }
  get correoVacio(){
    return this.form.get('correo')?.invalid && this.form.get('correo')?.touched;
  }
  get passwordVacio(){
    return this.form.get('password')?.invalid && this.form.get('password')?.touched;
  }
  get cpasswordVacio(){
    return this.form.get('cpassword')?.invalid && this.form.get('cpassword')?.touched;
  }
  get idCargoVacio(){
    return this.form.get('idCargo')?.invalid && this.form.get('idCargo')?.touched;
  }
  get nombreRolVacio(){
    return this.form.get('rol')?.invalid && this.form.get('rol')?.touched;
  }
  get direccionesVacio(){
    return this.form.get('direcciones')?.invalid && this.form.get('direcciones')?.touched;
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
