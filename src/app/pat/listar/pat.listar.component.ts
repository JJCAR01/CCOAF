import { Component } from '@angular/core';
import { PatService } from '../services/pat.service';
import { AuthService } from 'src/app/login/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './pat.listar.component.html',
  styleUrls: ['./pat.listar.component.scss']
})
export class PatListarComponent {
  title = 'listarPat';
  pats: any[] = [];
  busqueda: any;
  
    constructor(private patService: PatService,private auth:AuthService) { }  

    ngOnInit() {
      this.cargarPats();
    }

    cargarPats() {
      this.patService.listarPat(this.auth.obtenerHeader()).toPromise().then(
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
      this.patService.eliminarPat(idPat,this.auth.obtenerHeader()).subscribe(
        (response) => {
          console.log('Usuario eliminado con éxito', response);
        },
        (error) => {
          console.error('Error al eliminar el usuario', error);
        }
      );
    }
}