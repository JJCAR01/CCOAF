import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { CargoService } from 'src/app/cargo/services/cargo.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { EDireccion } from 'src/app/area/edireccion';
import { EProceso } from 'src/app/pat/listar/eproceso';

@Component({
  selector: 'app-root',
  templateUrl: './usuario.crear.component.html',
  styleUrls: ['./usuario.crear.component.scss']
})
export class UsuarioCrearComponent implements OnInit {
  title = 'crearUsuario';
  procesosLista: any;
  direccionesLista: any;
  listaDeDireccionesSeleccionadas: string[] = [];
  listaDeProcesosSeleccionadas: string[] = [];
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
      nombreRol: ['', Validators.required],
      cpassword: ['', Validators.required],  // Agrega el control para confirmar la contraseña
      direcciones: ['', Validators.required],
      procesos:['',Validators.required]
    }, {
      validators : matchpassword
    });
  }
  ngOnInit(): void {
    this.procesosLista = Object.values(EProceso);
    this.direccionesLista = Object.values(EDireccion);
    this.cargarCargos();
  }

  agregarDirecciones() {
    const direccionSeleccionada = this.form.get('direcciones')?.value;
    const direccionEnEnum = this.formatearProceso(direccionSeleccionada)

    // Verificar si la dirección ya existe en la lista antes de agregarla
    if (!this.listaDeDireccionesSeleccionadas.includes(direccionEnEnum)) {
      this.listaDeDireccionesSeleccionadas.push(direccionEnEnum);
    }
  }

  agregarProcesos() {
    const procesoSeleccionado = this.form.get('procesos')?.value;
    const procesoEnEnum = this.formatearProceso(procesoSeleccionado);
    
    // Verificar si el proceso ya existe en la lista antes de agregarlo
    if (!this.listaDeProcesosSeleccionadas.includes(procesoEnEnum)) {
      this.listaDeProcesosSeleccionadas.push(procesoEnEnum);
    }
    
  }
  
  formatearProceso(proceso: string): string {
    return proceso.normalize('NFD')
                   .replace(/[\u0300-\u036f]/g, '')
                   .replace(/\s+/g, '_')
                   .toUpperCase();
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
    this.listaDeDireccionesSeleccionadas
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
              showCancelButton: true,
              confirmButtonText: "Confirmar",
              confirmButtonColor: '#0E823F',
            }
          );
            this.form.reset();
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
    }
    
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