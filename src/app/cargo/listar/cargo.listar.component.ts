import { Component } from '@angular/core';
import { CargoService } from '../services/cargo.service';
import { AuthService } from 'src/app/login/auth/auth.service';

@Component({
  selector: 'app-root:not(c)',
  templateUrl: './cargo.listar.component.html',
  styleUrls: ['./cargo.listar.component.scss']
})
export class CargoListarComponent {
  title = 'listarCargo';
    cargos: any[] = [];
    busqueda: any;
  
    constructor(private cargoService: CargoService, private auth:AuthService) { }  

    ngOnInit() {
      this.cargarCargos();
    }

    cargarCargos() {
      this.cargoService.listarCargo(this.auth.obtenerHeader()).toPromise().then(
        (data: any) => {
          this.cargos = data;
        },
        (error) => {
          console.error(error);
        }
      );
    }


}