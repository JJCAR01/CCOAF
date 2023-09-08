import { Component } from '@angular/core';
import { ProgramaService } from '../services/programa.service';

@Component({
  selector: 'app-programa.listar',
  templateUrl: './programa.component.html',
  styleUrls: ['./programa.component.scss']
})
export class ProgramaListarComponent {
  title = 'listarPrograma';
  programas: any[] = [];
  busqueda: any;
  
    constructor(private programaService: ProgramaService) { }  

    ngOnInit() {
      this.cargarPats();
    }

    cargarPats() {
      this.programaService.listarPrograma().toPromise().then(
        (data: any) => {
          this.programas = data; // Asigna la respuesta del servicio al arreglo de áreas
          console.log('Progrmas cargados:', this.programas);
          alert("Programas")
        },
        (error) => {
          console.error(error);
        }
      );
    }
}