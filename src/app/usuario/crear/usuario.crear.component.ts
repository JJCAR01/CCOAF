import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { CargoService } from 'src/app/cargo/services/cargo.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { ProcesoService } from 'src/app/proceso/services/proceso.service';
import { DireccionService } from 'src/app/direccion/services/direccion.service';

@Component({
  selector: 'app-root',
  templateUrl: './usuario.crear.component.html',
  styleUrls: ['./usuario.crear.component.scss']
})
export class UsuarioCrearComponent implements OnInit {
  title = 'crearUsuario';
  ESTE_CAMPO_ES_OBLIGARORIO: string = 'Este campo es obligatorio*';
  procesosLista: any;
  direccionesLista: any;
  listaDeDireccionesSeleccionadas: string[] = [];
  listaDeProcesosSeleccionadas: string[] = [];
  cargos: any[] = [];
  procesos: any[] = [];
  direcciones: any[] = [];
  roles: any[] =[];
  form:FormGroup;
  
  constructor(private usuarioService: UsuarioService, 
    private procesoService: ProcesoService, 
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
      nombreRol: ['', Validators.required],
      direcciones: ['', Validators.required],
      procesos:['',Validators.required]
    }, 
    {
      validators : matchpassword
    });
  
  }
  ngOnInit(): void {
    this.cargarCargos();
    this.cargarDirecciones();
    this.cargarProcesos();
  }

  agregarDirecciones() {
    const direccionSeleccionada = this.form.get('direcciones')?.value;
    // Verificar si la dirección ya existe en la lista antes de agregarla
    if (!this.listaDeDireccionesSeleccionadas.includes(direccionSeleccionada)) {
      this.listaDeDireccionesSeleccionadas.push(direccionSeleccionada);
    }
  }

  agregarProcesos() {
    const procesoSeleccionado = this.form.get('procesos')?.value;  
    // Verificar si el proceso ya existe en la lista antes de agregarlo
    if (!this.listaDeProcesosSeleccionadas.includes(procesoSeleccionado)) {
      this.listaDeProcesosSeleccionadas.push(procesoSeleccionado);
    }
  }
  
  cargarCargos() {
    this.cargoService.listar(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.cargos = data;
    });
  }

  cargarDirecciones() {
    this.direccionService.listar(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.direcciones = data;
    },
      (error) => {
        console.log(error);
      }
    );
  }
  cargarProcesos() {
    this.procesoService.listar(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.procesos = data;
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
        direcciones: this.listaDeDireccionesSeleccionadas,
        procesos: this.listaDeProcesosSeleccionadas,
        roles: [
          {
            nombreRol: this.form.get('nombreRol')?.value
          }
        ]
      };
      
      this.usuarioService.crearUsuario(usuarioData,this.auth.obtenerHeader()).subscribe(
        (response) => {
          Swal.fire(
            {
              title:"Creado!!!",
              text:'El usuario se ha creado.', 
              icon:"success",
              confirmButtonColor: '#0E823F',
            }
          );
            this.form.reset();
            this.listaDeDireccionesSeleccionadas = [];
            this.listaDeProcesosSeleccionadas = [];
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
    return this.form.get('nombreRol')?.invalid && this.form.get('nombreRol')?.touched;
  }
  get direccionesVacio(){
    return this.form.get('direcciones')?.invalid && this.form.get('direcciones')?.touched;
  }
  get procesosVacio(){
    return this.form.get('procesos')?.invalid && this.form.get('procesos')?.touched;
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
