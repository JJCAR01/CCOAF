import { Component,OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { CargoService } from 'src/app/cargo/services/cargo.service';
import { DireccionService } from 'src/app/direccion/services/direccion.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './usuario.listar.component.html',
  styleUrls: ['./usuario.listar.component.scss']
})
export class UsuarioListarComponent implements OnInit{
  title = 'listarUsuario';
  ESTE_CAMPO_ES_OBLIGARORIO: string = 'Este campo es obligatorio*';
  usuarios: any[] = [];
  cargos: any[] = [];
  direcciones: any[] = [];
  busqueda: any;
  idUsuario:any;
  nombreUsuario:string | undefined;
  nombreSeleccionado:any;
  apellidoSeleccionado:any;
  correoSeleccionado:any;
  idCargoUsuario:any;
  formContrasena:FormGroup;
  form:FormGroup;
  passwordVisible: boolean = false;
  cpasswordVisible: boolean = false;
  
    constructor(private usuarioService: UsuarioService, 
      private auth:AuthService,
      private cargoService:CargoService,
      private formBuilder: FormBuilder

      ) {
        this.form = this.formBuilder.group({
          nombre: ['', Validators.required],
          apellido: ['', Validators.required],  // Agrega el control para confirmar la contraseña
          correo: ['', Validators.required],
          idCargo: ['', Validators.required],
        }),

        this.formContrasena = this.formBuilder.group({
          password: ['', Validators.required],
          cpassword: ['', Validators.required],  // Agrega el control para confirmar la contraseña
        }, 
        {
          validators : matchpassword
        });
        
       }  

    ngOnInit() {
      this.cargarCargos();
      this.cargarUsuarios();
    }

    cargarCargos() {
      this.cargoService.listar(this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.cargos = data;
      });
    }
  

    cargarUsuarios() {
      this.usuarioService.listarUsuario(this.auth.obtenerHeader()).toPromise().then(
        (data: any) => {
          this.usuarios = data;
        });
    }

    eliminarUsuario(idUsuario: number) {
      
      Swal.fire(
        {
          icon:"question",
          title: "¿Estás seguro?",
          text: "Una vez eliminado el usuario, no podrás recuperar este elemento.",
          showCancelButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Confirmar",
          confirmButtonColor: '#0E823F',
          reverseButtons: true, 
        }
      )
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
        this.usuarioService.eliminarUsuario(idUsuario, this.auth.obtenerHeader()).subscribe(
          (response) => {
            this.swalSatisfactorio('eliminado','usuario')
              this.cargarUsuarios()

          },
          (error) => {this.swalError(error);}
        );
      }
    });
  }
  agregarPass() {
    if (this.formContrasena.valid) {
      const pass = {
        password: this.formContrasena.get('password')?.value,
      };
      
      this.usuarioService.modificarAgregarPass(pass,this.idUsuario,this.auth.obtenerHeader()).subscribe(
        (response) => {
          this.swalSatisfactorio('modificado','contrseña')
            this.formContrasena.reset();
        },
        (error) => {this.swalError(error);}
      );
    } else {
      return Object.values(this.formContrasena.controls).forEach(control =>{
        control.markAllAsTouched();
      })
    }
  }

  modificarUsuario() {
    if (this.form.valid) {
        const nombre = this.form.get('nombre')?.value;
        const apellido = this.form.get('apellido')?.value;
        const correo = this.form.get('correo')?.value;
        const idCargo = this.form.get('idCargo')?.value;
        const pat = {
          nombre: nombre,
          apellido: apellido,
          correo: correo,
          idCargo: idCargo
        }
      Swal.fire({
        icon:"question",
        title: "¿Estás seguro de modificar?",
        text: "Una vez modificado no podrás revertir los cambios",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true, 
      })
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
          if (this.idUsuario != null) {
              this.usuarioService.modificar(pat, this.idUsuario, this.auth.obtenerHeader()).subscribe(
              (response) => {
                this.swalSatisfactorio('modificado','usuario')
                    this.form.reset()
                    this.cargarUsuarios()

              },
              (error) => {this.swalError(error);}
            );
          }
        }
      });
    } 
  }

  obtengoUsuario(idUsuario: number,usuario:any) {
      this.idUsuario = idUsuario;
      this.nombreUsuario = usuario.nombre + ' ' + usuario.apellidos;
      this.nombreSeleccionado = usuario.nombre
      this.apellidoSeleccionado = usuario.apellidos
      this.correoSeleccionado = usuario.correo
      this.idCargoUsuario = usuario.idCargo

      this.form.patchValue({
        nombre: this.nombreSeleccionado,
        apellido: this.apellidoSeleccionado,
        correo: this.correoSeleccionado,
        idCargo :this.idCargoUsuario
      });
  }

  obtenerNombreCargo(idCargo: number) {
    const ncargo = this.cargos.find((u) => u.idCargo === idCargo);
    return ncargo ? ncargo.nombre : '';
  }
  swalSatisfactorio(metodo: string, tipo:string) {
    Swal.fire({
      title: `Se ha ${metodo}.`,
      text: `El ${tipo} se ha ${metodo}!!`,
      icon:'success',
      position: "center",
      showConfirmButton: false,
      timer: 1500,
    }
    );
    this.form.reset();
    this.formContrasena.reset();

  }
  swalError(error: any) {
    Swal.fire(
      {
        title:"Error!!!",
        text:error.error.mensajeHumano, 
        icon:"error",
        confirmButtonColor: '#0E823F',
      }
    );
  } 

  get passwordVacio(){
    return this.formContrasena.get('password')?.invalid && this.formContrasena.get('password')?.touched;
  }
  get cpasswordVacio(){
    return this.formContrasena.get('cpassword')?.invalid && this.formContrasena.get('cpassword')?.touched;
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