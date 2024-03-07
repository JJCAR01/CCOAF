import { Component } from '@angular/core';
import { CargoService } from '../services/cargo.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { AreaService } from 'src/app/area/services/area.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Area } from 'src/app/modelo/area';
import { Cargo } from 'src/app/modelo/cargo';

@Component({
  selector: 'app-root:not(c)',
  templateUrl: './cargo.listar.component.html',
  styleUrls: ['./cargo.listar.component.scss']
})
export class CargoListarComponent {
  title = 'listarCargo';
    cargos: Cargo[] = [];
    areas: Area[] = [];

    idCargoSeleccionado:number = 0;

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
      });
    }

    cargarCargos() {
      this.cargoService.listar(this.auth.obtenerHeader()).toPromise().then(
        (data: any) => {
          this.cargos = data;
      });
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
            this.swalSatisfactorio('eliminado','cargo')
              this.cargarCargos()
          },
          (error) => {this.swalError(error);}
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
        idArea:idArea
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
                this.swalSatisfactorio('modificado','cargo')
                    this.cargarCargos()
              },
              (error) => {this.swalError(error);}
            );
          }
        }
      });
    } 
  }
  cargoSeleccionado(idCargo: number,cargo:any) {
    this.idCargoSeleccionado = idCargo;

    this.form.patchValue({
      nombre: cargo.nombre,
      idArea: cargo.idArea
    });
  }

  obtenerNombreArea(idArea: number) {
    const area = this.areas.find((u) => u.idArea === idArea);
    return area ? area.nombre : '';
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