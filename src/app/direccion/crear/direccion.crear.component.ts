import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login/auth/auth.service';
import { DireccionService } from '../services/direccion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear',
  templateUrl: './direccion.crear.component.html',
  styleUrl: './direccion.crear.component.scss'
})
export class DireccionCrearComponent implements OnInit {
  title = 'crearDireccion';
  form:FormGroup;
  direcciones:any;
  busqueda: any;
  idSeleccionada:number | undefined;
  nombreSeleccionado:string | undefined;

  ngOnInit(): void {
    this.cargarDireciones()
  }

  constructor(private auth: AuthService,
    private direccionService: DireccionService,
    private formBuilder: FormBuilder) 
    { 
      this.form = this.formBuilder.group({
        nombre: ['', Validators.required],
      });
  }

  cargarDireciones() {
    this.direccionService.listar(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.direcciones = data;
    })
  }

  crearDireccion(){
    const nombre = this.form.get('nombre')?.value;
    const proceso = {
      nombre: nombre,
    };
    this.direccionService.crear(proceso,this.auth.obtenerHeader()).toPromise().then(response =>{
      Swal.fire({
        title:"Creado!!!",
        text:'La dirección se ha creado.', 
        icon:"success",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true, 
      });
      this.form.reset();
      this.cargarDireciones()
    },error =>{
      Swal.fire(
        {
          title:"Error!!!",
          text:error.error.mensajeHumano, 
          icon:"error",
        }
      );
    } )
  }
  eliminarDireccion(idDireccion: number) {

    Swal.fire({
      icon:"question",
      title: "¿Estás seguro?",
      text: "Una vez eliminado  la dirección, no podrás recuperar este elemento.",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
      confirmButtonColor: '#0E823F',
      reverseButtons: true, 
    })
    .then((confirmacion) => {
      if (confirmacion.isConfirmed) {
      this.direccionService.eliminar(idDireccion, this.auth.obtenerHeader()).subscribe(
        (response:any) => {
          Swal.fire({
            title:'Eliminado!',
            text: "La dirección se ha eliminado.",
            icon: "success",
            confirmButtonColor: '#0E823F'
          }).then(() => {
          });
          this.cargarDireciones()
        },
        (error:any) => {
          Swal.fire({
            title:'Solicitud no válida!',
            text: error.error.mensajeHumano,
            icon: "error",
          });
        }
      );
    }
  });
  }
  modificarDireccion() {
    if (this.form.valid ) {
      const nombre = this.form.get('nombre')?.value;
      const direccion = {
        nombre: nombre,
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
          if (this.idSeleccionada != null) {
              this.direccionService.modificar(direccion, this.idSeleccionada, this.auth.obtenerHeader()).subscribe(
              (response) => {
                Swal.fire({
                  icon : 'success',
                  title : 'Modificado!!!',
                  text : 'El área se ha modificado.',
                  confirmButtonColor: '#0E823F',
                  }).then(() => {
                    this.cargarDireciones()
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
  direccionSeleccionado(idDireccion: number,direccion:any) {
    this.idSeleccionada = idDireccion;
    this.nombreSeleccionado = direccion.nombre;

    this.form.patchValue({
      nombre: this.nombreSeleccionado,
    });
  }
}
