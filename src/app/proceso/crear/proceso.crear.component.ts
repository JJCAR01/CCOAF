import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProcesoService } from '../services/proceso.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear',
  templateUrl: './proceso.crear.component.html',
  styleUrl: './proceso.crear.component.scss'
})
export class ProcesoCrearComponent implements OnInit {
  title = 'crearProceso';
  form:FormGroup;
  procesos:any;
  busqueda: any;
  idSeleccionado:number | undefined;
  nombreSeleccionado:string | undefined;

  ngOnInit(): void {
    this.cargarProcesos()
  }

  constructor(private auth: AuthService,
    private procesoService: ProcesoService,
    private formBuilder: FormBuilder) 
    { 
      this.form = this.formBuilder.group({
        nombre: ['', Validators.required],
      });
  }

  cargarProcesos() {
    this.procesoService.listar(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.procesos = data;
    })
  }

  crearProceso(){
    if(this.form.valid){
      const nombre = this.form.get('nombre')?.value;
      const proceso = {
        nombre: nombre,
      };
      this.procesoService.crear(proceso,this.auth.obtenerHeader()).toPromise().then(response =>{
        Swal.fire({
          title:"Creado!!!",
          text:'El proceso se ha creado.', 
          icon:"success",
          showCancelButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Confirmar",
          confirmButtonColor: '#0E823F',
          reverseButtons: true, 
        });
        this.form.reset();
        this.cargarProcesos()
      },error =>{
        Swal.fire({
          title:'Solicitud no válida!',
          text: error.error.mensajeHumano,
          icon: "error",
          confirmButtonColor: '#0E823F',
        });
      })
    } else {
      return this.form.markAllAsTouched();
    }
  }

  eliminarProceso(idProceso: number) {
    console.log(idProceso)
    Swal.fire({
      icon:"question",
      title: "¿Estás seguro?",
      text: "Una vez eliminado el proceso, no podrás recuperar este elemento.",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
      confirmButtonColor: '#0E823F',
      reverseButtons: true, 
    })
    .then((confirmacion) => {
      if (confirmacion.isConfirmed) {
      this.procesoService.eliminar(idProceso, this.auth.obtenerHeader()).subscribe(
        (response:any) => {
          Swal.fire({
            title:'Eliminado!',
            text: "El proceso se ha eliminado.",
            icon: "success",
            confirmButtonColor: '#0E823F'
          }).then(() => {
          });
          this.cargarProcesos()
        },
        (error:any) => {
          Swal.fire({
            title:'Solicitud no válida!',
            text: error.error.mensajeTecnico,
            icon: "error",
            confirmButtonColor: '#0E823F',
          });
        }
      );
    }
  });
  }
  modificarProceso() {
    if(this.nombreSeleccionado == "TODOS LOS PROCESOS"){
      Swal.fire({
        title:'Solicitud no válida!',
        text: 'El proceso con el nombre TODOS LOS PROCESOS, no se puede modificar!!!',
        icon: "warning",
        confirmButtonColor: '#0E823F',
      });
    } else if (this.form.valid ) {
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
          if (this.idSeleccionado != null) {
              this.procesoService.modificar(direccion, this.idSeleccionado, this.auth.obtenerHeader()).subscribe(
              (response:any) => {
                Swal.fire({
                  icon : 'success',
                  title : 'Modificado!!!',
                  text : 'El área se ha modificado.',
                  confirmButtonColor: '#0E823F',
                  }).then(() => {
                    this.cargarProcesos()
                });
              },
              (error) => {
                Swal.fire({
                  title:'Solicitud no válida!',
                  text: error.error.mensajeTecnico,
                  icon: "error",
                  confirmButtonColor: '#0E823F',
                });
              }
            );
          }
        }
      });
    } 
  }
  procesoSeleccionado(idProceso: number,proceso:any) {
    this.idSeleccionado = idProceso;
    this.nombreSeleccionado = proceso.nombre;

    this.form.patchValue({
      nombre: this.nombreSeleccionado,
    });
  }

  get nombreVacio(){
    return this.form.get('nombre')?.invalid && this.form.get('nombre')?.touched;
  }
}
