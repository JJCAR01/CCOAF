import { Component, OnInit } from '@angular/core';
import { AreaService } from '../services/area.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { HttpHeaders } from '@angular/common/http';
import swal from 'sweetalert';

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
      .listarArea(this.auth.obtenerHeader()) // Pasa las cabeceras con el token JWT en la solicitud
      .toPromise()
      .then(
        (data: any) => {
          this.areas = data; 
        },
        (error) => {
          console.error(error);
        }
      );
  }
  eliminarArea(idArea: number) {
    this.areaService.eliminarPat(idArea,this.auth.obtenerHeader()).subscribe(
      (response) => {
        swal("Eliminado Satisfactoriamente", "El area con el nombre " + response + ", se ha eliminado!", "success");
      },
      (error) => {
        console.error('Error al eliminar el usuario', error);
      }
    );
  }
}
