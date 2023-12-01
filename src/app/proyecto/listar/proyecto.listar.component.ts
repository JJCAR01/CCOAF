import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActividadService } from 'src/app/actividad/services/actividad.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proyecto.listar',
  templateUrl: './proyecto.listar.component.html',
  styleUrls: ['./proyecto.listar.component.scss']
})
export class ProyectoListarComponent implements OnInit {
  title = 'listarProyecto';
  proyectos: any[] = [];

  constructor(private actividadService: ActividadService,
    private auth: AuthService,
    ){ }

  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProyectos() {
    this.actividadService
      .listarProyecto(this.auth.obtenerHeader()) 
      .toPromise()
      .then(
        (data: any) => {
          this.proyectos = data;
        },
        (error) => {
          Swal.fire(error.error.mensajeTecnico,'', 'error');
        }
      );
  }



}
