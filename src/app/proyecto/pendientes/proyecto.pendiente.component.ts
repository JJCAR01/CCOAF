import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActividadService } from 'src/app/actividad/services/actividad.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proyecto.listar',
  templateUrl: './proyecto.pendiente.component.html',
  styleUrls: ['./proyecto.pendiente.component.scss']
})
export class ProyectoPendienteListarComponent implements OnInit {
  title = 'listarProyectosPendiente';
  proyectos: any[] = [];
  proyectosPendientes: any[] = [];

  constructor(private actividadService: ActividadService,
    private auth: AuthService,
    ){ }

  ngOnInit(): void {
    this.cargarProyectosPendientes();
  }


  cargarProyectosPendientes(){
    this.actividadService.listarProyecto(this.auth.obtenerHeader()).toPromise().then((data:any)=>{
      if(data.avance < 100){
        this.proyectosPendientes = data;
      }
    })
  }

  colorPorcentaje(porcentaje: number): string {
    if (porcentaje < 30) {
      return 'porcentaje-bajo'; // Define las clases CSS para porcentajes bajos en tu archivo de estilos.
    } else if (porcentaje >= 30 && porcentaje < 100){
      return 'porcentaje-medio'; // Define las clases CSS para porcentajes normales en tu archivo de estilos.
    } else {
      return 'porcentaje-cien';
    }
  }
  colorDias(diasRestantes: number): string {
    if (diasRestantes < 10) {
      return 'porcentaje-bajo'; // Define las clases CSS para porcentajes bajos en tu archivo de estilos.
    } else {
      return 'porcentaje-normal';
    }
  }



}
