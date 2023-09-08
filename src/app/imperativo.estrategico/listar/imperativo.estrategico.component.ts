import { Component } from '@angular/core';
import { ImperativoEstrategicoService } from '../services/imperativo.estrategico.service';

@Component({
  selector: 'app-imperativo-estrategico.listar',
  templateUrl: './imperativo.estrategico.component.html',
  styleUrls: ['./imperativo.estrategico.component.scss']
})
export class ImperativoEstrategicoListarComponent {
  title = 'listarImperativo';
  imperativoEstrategicos: any[] = [];
  busqueda: any;
  
    constructor(private imperativoEstrategicoService: ImperativoEstrategicoService) { }  

    ngOnInit() {
      this.cargarPats();
    }

    cargarPats() {
      this.imperativoEstrategicoService.listarImperativoEstrategico().toPromise().then(
        (data: any) => {
          this.imperativoEstrategicos = data; // Asigna la respuesta del servicio al arreglo de áreas
          console.log('Imperativos cargados:', this.imperativoEstrategicos);
        },
        (error) => {
          console.error(error);
        }
      );
    }
}