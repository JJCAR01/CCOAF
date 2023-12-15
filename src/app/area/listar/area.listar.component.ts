import { Component, OnInit } from '@angular/core';
import { AreaService } from '../services/area.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { EDireccion } from '../edireccion';

@Component({
  selector: 'app-root:not(p)',
  templateUrl: './area.listar.component.html',
  styleUrls: ['./area.listar.component.scss']
})
export class AreaListarComponent implements OnInit {
  title = 'listarArea';
  direccionEnumList: string[] = Object.values(EDireccion);
  areas: any[] = [];
  busqueda: any;

  constructor(
    private areaService: AreaService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.cargarAreas();
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
          Swal.fire({
            title:'Eliminado!',
            text: "El área se ha eliminado.",
            icon: "success",
            confirmButtonColor: '#0E823F'
          }).then(() => {
          });
          this.cargarAreas()
        },
        (error) => {
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

  // Función para convertir entre valores mostrados y valores reales 
  convertirDireccion(valor: string): string {
    const valorMinuscSinTildes = valor.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return valorMinuscSinTildes;
  }
  obtenerProcesoMinuscula(valor: EDireccion): string {
    return valor.replace(/_/g, ' ');
  }
}
