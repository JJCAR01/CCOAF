import { Component } from '@angular/core';
import { PatService } from '../services/pat.service';

@Component({
  selector: 'app-root',
  templateUrl: './pat.listar.component.html',
  styleUrls: ['./pat.listar.component.scss']
})
export class PatListarComponent {
  title = 'listarPat';
  pats: any[] = [];
  busqueda: any;
  
    constructor(private patService: PatService) { }  

    ngOnInit() {
      this.cargarPats();
    }

    cargarPats() {
      this.patService.listarPat().toPromise().then(
        (data: any) => {
          this.pats = data; // Asigna la respuesta del servicio al arreglo de áreas
          console.log('Pts cargados:', this.pats);
        },
        (error) => {
          console.error(error);
        }
      );
    }
}