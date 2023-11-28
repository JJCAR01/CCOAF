import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/login/auth/auth.service';
import { TipoGEService } from 'src/app/gestion/services/tipoGE.service';

@Component({
  selector: 'app-actividadestrategica.listar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './actividadestrategica.listar.component.html',
  styleUrls: ['./actividadestrategica.listar.component.scss']
})
export class ActividadestrategicaListarComponent implements OnInit{
  title = 'listarActividadesEstrategicas';
  actividadesEstrategicas: any[] = [];

  constructor(private tipoService: TipoGEService,
    private auth: AuthService,){}

  ngOnInit(): void {
    this.cargarActividadesEstrategicas();
    throw new Error('Method not implemented.');
  }

  cargarActividadesEstrategicas(){
    this.tipoService
      .listarActividadEstrategica(this.auth.obtenerHeader()) 
      .toPromise()
      .then(
        (data: any) => {
          this.actividadesEstrategicas = data;
        },
        (error) => {
          Swal.fire(error.error.mensajeTecnico,'', 'error');
        }
      );
  }

}
