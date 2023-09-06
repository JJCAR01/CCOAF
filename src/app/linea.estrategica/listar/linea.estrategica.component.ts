import { Component } from '@angular/core';
import { LineaEstrategicaService } from '../services/linea.estrategica.service';

@Component({
  selector: 'app-linea.estrategica',
  templateUrl: './linea.estrategica.component.html',
  styleUrls: ['./linea.estrategica.component.scss']
})
export class LineaEstrategicaComponent {
  title = 'listarPat';
  lineasEstrategicas: any[] = [];
  busqueda: any;
  
    constructor(private lineaEstrategicaService: LineaEstrategicaService) { }  

    ngOnInit() {
      this.cargarPats();
    }

    cargarPats() {
      this.lineaEstrategicaService.listarLineaEstrategica().toPromise().then(
        (data: any) => {
          this.lineasEstrategicas = data; // Asigna la respuesta del servicio al arreglo de áreas
          console.log('Lineas cargados:', this.lineasEstrategicas);
        },
        (error) => {
          console.error(error);
        }
      );
    }
}