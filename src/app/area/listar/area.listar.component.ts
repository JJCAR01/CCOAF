import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule,FormGroup,Validators } from '@angular/forms';
import { AreaListarService } from './sevices/area.listar.sevice.service';


@Component({
  selector: 'app-root:not(p)',
  templateUrl: './area.listar.component.html',
  styleUrls: ['./area.listar.component.scss']
})
export class AreaListarComponent implements OnInit{
    title = 'listarArea';
    areas: any[] = [];
  
    constructor(private areaListarService: AreaListarService) { }  

    ngOnInit() {
      this.cargarAreas();
    }

    cargarAreas() {
      this.areaListarService.listarArea().toPromise().then(
        (data: any) => {
          this.areas = data; // Asigna la respuesta del servicio al arreglo de áreas
          console.log('Áreas cargadas:', this.areas);
        },
        (error) => {
          console.error(error);
        }
      );
    }
}

  
  
  
  
  