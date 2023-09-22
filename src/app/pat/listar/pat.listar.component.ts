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
          this.pats = data;
          console.log('Pts cargados:', this.pats);
        },
        (error) => {
          console.error(error);
        }
      );
    }
    eliminarPat(idPat: number) {
      this.patService.eliminarPat(idPat).subscribe(
        (response) => {
          console.log('Usuario eliminado con éxito', response);
        },
        (error) => {
          console.error('Error al eliminar el usuario', error);
        }
      );
    }
}