import { Component, OnInit } from '@angular/core';
import { AreaService } from '../services/area.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root:not(p)',
  templateUrl: './area.listar.component.html',
  styleUrls: ['./area.listar.component.scss']
})
export class AreaListarComponent implements OnInit {
  title = 'listarArea';
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
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no podrás recuperar este elemento.",
      icon: "question",
      confirmButtonText: "Confirmar",
      confirmButtonColor: "#3085d6",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    })
    .then((confirmacion) => {
      if (confirmacion.isConfirmed) {
      this.areaService.eliminar(idArea, this.auth.obtenerHeader()).subscribe(
        (response) => {
          Swal.fire("Eliminado!!!", "El area se ha eliminado." , "success").then(() => {
            window.location.reload();
          });
          console.log(response);
        },
        (error) => {
          Swal.fire("Solicitud no válida", error.error.mensajeHumano, "error");
        }
      );
    }
  });
  }
}
