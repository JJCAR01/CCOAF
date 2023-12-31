import { Component } from '@angular/core';
import { CargoService } from '../services/cargo.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { AreaListarComponent } from 'src/app/area/listar/area.listar.component';
import { AreaService } from 'src/app/area/services/area.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root:not(c)',
  templateUrl: './cargo.listar.component.html',
  styleUrls: ['./cargo.listar.component.scss']
})
export class CargoListarComponent {
  title = 'listarCargo';
    cargos: any[] = [];
    areas: any[] = [];
    idCargoSeleccionado:number| undefined;
    nombreCargoSeleccionado:any;
    idAreaSeleccionada:number| undefined;
    form:FormGroup;
    busqueda: any;
  
    constructor(private cargoService: CargoService, private auth:AuthService,
      private areaService:AreaService, private formBuilder:FormBuilder) 
      {
        this.form = this.formBuilder.group({
          nombre:['', Validators.required],
          idArea:['', Validators.required],
        });

       }  

    ngOnInit() {
      this.cargarCargos();
      this.cargarAreas()
    }
    cargarAreas() {
      this.areaService.listar(this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.areas = data;
      },
        (error) => {
          console.log(error);
        }
      );
    }

    cargarCargos() {
      this.cargoService.listar(this.auth.obtenerHeader()).toPromise().then(
        (data: any) => {
          this.cargos = data;
        },
        (error) => {
          Swal.fire('Error',error.error.mensajeTecnico,"error");
        }
      );
    }
    eliminarCargo(idCargo: number) {
      const cargoAEliminar = this.cargos.find(cargo => cargo.idCargo === idCargo);
      Swal.fire(
        {
          icon:"question",
          title: "¿Estás seguro?",
          text: "Una vez eliminado  el cargo, no podrás recuperar este elemento.",
          showCancelButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Confirmar",
          confirmButtonColor: '#0E823F',
          reverseButtons: true, 
        }
      )
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
        this.cargoService.eliminar(idCargo, this.auth.obtenerHeader()).subscribe(
          (response) => {
            Swal.fire({
              title:'Eliminado!',
              text: "El cargo se ha eliminado.",
              icon: "success",
              confirmButtonColor: '#0E823F'
            }).then(() => {
              this.cargarCargos()
            });
          },
          (error) => {
            Swal.fire(
              {
                title:'Solicitud no válida!',
                text: error.error.mensajeHumano,
                icon: "error",
              })
          }
        );
      }
    });
  }
  modificarCargo() {
    if (this.form.valid ) {
      const nombre = this.form.get('nombre')?.value;
      const idArea = this.form.get('idArea')?.value;
      const cargo = {
        nombre: nombre,
        idArea:this.idAreaSeleccionada
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
          if (this.idCargoSeleccionado != null) {
              this.cargoService.modificarCargo(cargo, this.idCargoSeleccionado, this.auth.obtenerHeader()).subscribe(
              (response) => {
                Swal.fire({
                  icon : 'success',
                  title : 'Modificado!!!',
                  text : 'El cargo se ha modificado.',
                  confirmButtonColor: '#0E823F',
                  }).then(() => {
                    this.cargarCargos()
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
  cargoSeleccionado(idCargo: number,cargo:any) {
    this.idCargoSeleccionado = idCargo;
    this.nombreCargoSeleccionado = cargo.nombre;
    this.idAreaSeleccionada = cargo.idArea

    this.form.patchValue({
      nombre: this.nombreCargoSeleccionado,
      idArea:this.idAreaSeleccionada
    });
  }

  obtenerNombreArea(idArea: number) {
    const area = this.areas.find((u) => u.idArea === idArea);
    return area ? area.nombre : '';
  }
}