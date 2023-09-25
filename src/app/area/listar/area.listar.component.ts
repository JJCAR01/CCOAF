import { Component, OnInit } from '@angular/core';
import { AreaService } from '../services/area.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { HttpHeaders } from '@angular/common/http';

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
    private areaListarService: AreaService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.cargarAreas();
    }
  }

  cargarAreas() {
    const token = this.authService.getToken(); // Obtiene el token JWT del servicio AuthService
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);

    this.areaListarService
      .listarArea(headers) // Pasa las cabeceras con el token JWT en la solicitud
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
}
