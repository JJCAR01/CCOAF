import { Component } from '@angular/core';
import { CargoService } from '../services/cargo.service';

@Component({
  selector: 'app-root:not(c)',
  templateUrl: './cargo.listar.component.html',
  styleUrls: ['./cargo.listar.component.scss']
})
export class CargoListarComponent {
  title = 'listarCargo';
    cargos: any[] = [];
    busqueda: any;
  
    constructor(private cargoService: CargoService) { }  

    ngOnInit() {
      this.cargarCargos();
    }

    cargarCargos() {
      this.cargoService.listarCargo().toPromise().then(
        (data: any) => {
          this.cargos = data; // Asigna la respuesta del servicio al arreglo de áreas
          console.log('Cargos0 cargados:', this.cargos);
        },
        (error) => {
          console.error(error);
        }
      );
    }


}