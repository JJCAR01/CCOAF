import { Component, OnInit } from '@angular/core';
import { AreaService } from '../services/area.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DireccionService } from 'src/app/direccion/services/direccion.service';

@Component({
  selector: 'app-root:not(p)',
  templateUrl: './area.listar.component.html',
  styleUrls: ['./area.listar.component.scss']
})
export class AreaListarComponent implements OnInit {
  title = 'listarArea';
  areas: any[] = [];
  idAreaSeleccionada:number|undefined;
  nombreAreaSeleccionada:any;
  direccionSeleccionada:any;
  form:FormGroup
  busqueda: any;
  direcciones:any;

  constructor(
    private areaService: AreaService,
    private auth: AuthService,
    private formBuilder:FormBuilder,
    private direccionService:DireccionService

  ) {this.form = this.formBuilder.group({
    nombre:['', Validators.required],
    direccion: ['', Validators.required],
  }); }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.cargarAreas();
      this.cargarDirecciones()
    }
  }

  cargarAreas() {
    this.areaService
      .listar(this.auth.obtenerHeader()) // Pasa las cabeceras con el token JWT en la solicitud
      .toPromise()
      .then(
        (data: any) => {
          this.areas = data; 
        },
        (error) => {
          Swal.fire('Error',error.error.mensajeTecnico,'error')
        }
      );
  }

  cargarDirecciones() {
    this.direccionService.listar(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.direcciones = data;
    })
  }
  
  eliminarArea(idArea: number) {
      const areaAEliminar = this.areas.find(area => area.idArea === idArea);

      Swal.fire({
        icon:"question",
        title: "¿Estás seguro?",
        text: "Una vez eliminado  el área, no podrás recuperar este elemento.",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true, 
      })
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
        this.areaService.eliminar(idArea, this.auth.obtenerHeader()).subscribe(
          (response) => {
            this.swalSatisfactorio('elimianada','área')
            this.cargarAreas()
          },
          (error) => {this.swalError(error);}
        );
      }
    });
  }
  modificarArea() {
    if (this.form.valid ) {
      const nombre = this.form.get('nombre')?.value;
      const direccion = this.form.get('direccion')?.value;
      const area = {
        nombre: nombre,
        direccion: direccion,
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
          if (this.idAreaSeleccionada != null) {
              this.areaService.modificarArea(area, this.idAreaSeleccionada, this.auth.obtenerHeader()).subscribe(
              (response) => {
                this.swalSatisfactorio('modificado','área')
                    this.cargarAreas()
              },
              (error) => {this.swalError(error);}
            );
          }
        }
      });
    } 
  }

  
  areaSeleccionada(idArea: number,area:any) {
    this.idAreaSeleccionada = idArea;
    this.nombreAreaSeleccionada = area.nombre;
    this.direccionSeleccionada = area.idDireccion;

    this.form.patchValue({
      nombre: this.nombreAreaSeleccionada,
      direccion: this.direccionSeleccionada,
    });
  }

  obtenerDireccion(idDireccion: number) {
    if (this.direcciones) {
      const direccion = this.direcciones.find((u: any) => u.idDireccion === idDireccion);
      return direccion ? direccion.nombre : '';
    }
    return '';
  }
  swalSatisfactorio(metodo: string, tipo:string) {
    Swal.fire({
      title: `Se ha ${metodo}.`,
      text: `El ${tipo} se ha ${metodo}!!`,
      icon:'success',
      confirmButtonColor: '#0E823F',
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
