import {Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProcesoService } from 'src/app/proceso/services/proceso.service';
import { DireccionService } from 'src/app/direccion/services/direccion.service';

@Component({
  selector: 'app-root',
  templateUrl: './modificar.direcciones.component.html',
  styleUrls: ['./modificar.direcciones.component.scss']
})
export class ModificarDireccionesComponent implements OnInit {
  usuarios: any[] = [];
  busqueda: any;
  direcciones:any;
  procesos:any;
  direccionesLista:any;
  procesosLista:any;
  deshabilitar: boolean = true;
  idUsuario:number = 0;
  nombreUsuarioSeleccionado:string = '';
  direccionesUsuarioSeleccionado:any;
  procesosUsuarioSeleccionado:any;
  listaDeDireccionesSeleccionadas: string[] = [];
  listaDeProcesosSeleccionadas: string[] = [];
  formDireccion:FormGroup;
  formProceso:FormGroup;


  constructor(private usuarioService: UsuarioService, 
    private auth:AuthService,private formBuilder: FormBuilder,
    private direccionService:DireccionService,
    private procesosService:ProcesoService
    ) {
      this.formDireccion = this.formBuilder.group({
        direcciones: ['', Validators.required],
      });
      this.formProceso = this.formBuilder.group({
        procesos: ['', Validators.required],
      });
     } 

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarDirecciones();
    this.cargarProcesos();
  }

  cargarUsuarios() {
    this.usuarioService.listarUsuario(this.auth.obtenerHeader()).toPromise().then(
      (data: any) => {
        this.usuarios = data;
      },
      (error) => {
        Swal.fire('Error', error.error.mensajeTecnico, 'error');
      }
    );
  }
  
  cargarDirecciones() {
    this.direccionService.listar(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.direcciones = data;
    });
  }
  
  cargarProcesos() {
    this.procesosService.listar(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.procesos = data;
    });
  }

  modificarDireccionDeUsuario() {
    if (this.formDireccion.valid && this.idUsuario) {
      const direcciones =this.listaDeDireccionesSeleccionadas;
      
      const usuarioModificarDirecciones = {
        direcciones: direcciones,
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
              this.usuarioService.modificarDireccion(usuarioModificarDirecciones, this.idUsuario, this.auth.obtenerHeader()).subscribe(
              (response) => {
                this.swalSatisfactorio('modificado','direccion del usuario')
                    this.formDireccion.reset()
                    this.cargarUsuarios()
              },
              (error) => {this.swalError(error);}
            );
          }
        }
      });
    } 
  }
  eliminarDireccionUsuario() {
    if (this.formDireccion.valid && this.idUsuario) {
      const direcciones =this.listaDeDireccionesSeleccionadas;
      
      const direccionesAEliminar = {
        direcciones: direcciones,
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
              this.usuarioService.eliminarDireccion(direccionesAEliminar, this.idUsuario, this.auth.obtenerHeader()).subscribe(
              (response) => {
                this.swalSatisfactorio('eliminado','direccion del usuario')
                    this.formDireccion.reset()
                    this.cargarUsuarios()
              },
              (error) => {this.swalError(error);}
            );
          }
        }
      });
    } 
  }

  modificarProcesoDeUsuario() {
    if (this.formProceso.valid && this.idUsuario) {
      const procesos =this.listaDeProcesosSeleccionadas;
      
      const usuarioModificarProcesos = {
        procesos: procesos,
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
              this.usuarioService.modificarProceso(usuarioModificarProcesos, this.idUsuario, this.auth.obtenerHeader()).subscribe(
              (response) => {
                this.swalSatisfactorio('modificado','proceso del usuario')
                    this.formProceso.reset()
                    this.cargarUsuarios()
              },
              (error) => {this.swalError(error);}
            );
          }
        }
      });
    } 
  }


  eliminarProcesoUsuario() {
    if (this.formProceso.valid && this.idUsuario) {
      const procesos =this.listaDeProcesosSeleccionadas;
      
      const procesosAEliminar = {
        procesos: procesos,
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
              this.usuarioService.eliminarProceso(procesosAEliminar, this.idUsuario, this.auth.obtenerHeader()).subscribe(
              (response) => {
                this.swalSatisfactorio('eliminado','proceso del usuario')
                    this.formProceso.reset()
                    this.cargarUsuarios()
              },
              (error) => {this.swalError(error);}
            );
          }
        }
      });
    } 
  }


  seleccionarDireccion() {
    const direccionSeleccionada = this.formDireccion.get('direcciones')?.value;
    if (!this.direcciones.includes(direccionSeleccionada)) {
      this.listaDeDireccionesSeleccionadas.push(direccionSeleccionada);
    }
  }

  seleccionarProceso() {
    const procesoSeleccionada = this.formProceso.get('procesos')?.value;
    if (!this.procesos.includes(procesoSeleccionada)) {
      this.listaDeProcesosSeleccionadas.push(procesoSeleccionada);
    }
  }

  obtengoUsuario(idUsuario: number,usuario:any) {

    this.listaDeDireccionesSeleccionadas = [];
    this.listaDeProcesosSeleccionadas = [];

    if (usuario && usuario.nombre && usuario.apellidos && usuario.direcciones && usuario.procesos) {
      this.idUsuario = idUsuario;
      this.nombreUsuarioSeleccionado = usuario.nombre + ' ' + usuario.apellidos;
      this.direccionesUsuarioSeleccionado = usuario.direcciones;
      this.procesosUsuarioSeleccionado = usuario.procesos;

      this.formDireccion.patchValue({
        direcciones: this.direccionesUsuarioSeleccionado,
      });

      this.formProceso.patchValue({
        procesos: this.procesosUsuarioSeleccionado,
      });
    } 
  }

  swalSatisfactorio(metodo: string, tipo:string) {
    Swal.fire({
      title: `Se ha ${metodo}.`,
      text: `El ${tipo} se ha ${metodo}!!`,
      icon:'success',
      confirmButtonColor: '#0E823F',
    }
    );
    this.formDireccion.reset();
    this.formProceso.reset();

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
 }
