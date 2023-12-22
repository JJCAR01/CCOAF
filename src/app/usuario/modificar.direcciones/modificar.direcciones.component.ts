import {Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EDireccion } from 'src/app/area/edireccion';
import { EProceso } from 'src/app/pat/listar/eproceso';

@Component({
  selector: 'app-root',
  templateUrl: './modificar.direcciones.component.html',
  styleUrls: ['./modificar.direcciones.component.scss']
})
export class ModificarDireccionesComponent implements OnInit {
  usuarios: any[] = [];
  busqueda: any;
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
    this.direccionesLista = Object.values(EDireccion);
    this.procesosLista = Object.values(EProceso);
    throw new Error('Method not implemented.');
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
                Swal.fire({
                  icon : 'success',
                  title : 'Modificado!!!',
                  text : 'La dirección del usuario se ha modificado.',
                  confirmButtonColor: '#0E823F',
                  }).then(() => {
                    this.formDireccion.reset()
                    this.cargarUsuarios()
                    
                });
              },
              (error) => {
                Swal.fire("Solicitud no válida", error.error.mensajeHumano, "error");
              }
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
                Swal.fire({
                  icon : 'success',
                  title : 'Modificado!!!',
                  text : 'La dirección asociada al usuario se ha eliminado.',
                  confirmButtonColor: '#0E823F',
                  }).then(() => {
                    this.formDireccion.reset()
                    this.cargarUsuarios()
                    
                });
              },
              (error) => {
                Swal.fire("Solicitud no válida", error.error.mensajeHumano, "error");
              }
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
                Swal.fire({
                  icon : 'success',
                  title : 'Modificado!!!',
                  text : 'El proceso del usuario se ha modificado.',
                  confirmButtonColor: '#0E823F',
                  }).then(() => {
                    this.formProceso.reset()
                    this.cargarUsuarios()
                    
                });
              },
              (error) => {
                Swal.fire("Solicitud no válida", error.error.mensajeHumano, "error");
              }
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
                Swal.fire({
                  icon : 'success',
                  title : 'Modificado!!!',
                  text : 'La dirección asociada al usuario se ha eliminado.',
                  confirmButtonColor: '#0E823F',
                  }).then(() => {
                    this.formProceso.reset()
                    this.cargarUsuarios()
                    
                });
              },
              (error) => {
                Swal.fire("Solicitud no válida", error.error.mensajeHumano, "error");
              }
            );
          }
        }
      });
    } 
  }


  seleccionarDireccion() {
    const direccionSeleccionada = this.formDireccion.get('direcciones')?.value;
    const direccionEnEnum = direccionSeleccionada
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .toUpperCase();

    // Verificar si la dirección ya existe en la lista antes de agregarla
    if (!this.listaDeDireccionesSeleccionadas.includes(direccionEnEnum)) {
      this.listaDeDireccionesSeleccionadas.push(direccionEnEnum);
    }
  }

  seleccionarProceso() {
    const procesoSeleccionada = this.formProceso.get('procesos')?.value;
    const procesoEnEnum = procesoSeleccionada
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .toUpperCase();

    // Verificar si la dirección ya existe en la lista antes de agregarla
    if (!this.listaDeProcesosSeleccionadas.includes(procesoEnEnum)) {
      this.listaDeProcesosSeleccionadas.push(procesoEnEnum);
    }
  }

  obtengoUsuario(idUsuario: number,usuario:any) {
    this.listaDeDireccionesSeleccionadas = [];
    this.listaDeProcesosSeleccionadas = [];
    this.idUsuario = idUsuario;
    this.nombreUsuarioSeleccionado = usuario.nombre +' '+ usuario.apellidos
    this.direccionesUsuarioSeleccionado = usuario.direcciones;
    this.procesosUsuarioSeleccionado = usuario.procesos

    this.formDireccion.patchValue({
      direcciones: this.direccionesUsuarioSeleccionado,
    });

    this.formProceso.patchValue({
      procesos: this.procesosUsuarioSeleccionado,
    });
  }
 }
