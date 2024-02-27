import { Component, OnInit} from '@angular/core';
import { ActividadService } from 'src/app/actividad/services/actividad.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { PatService } from 'src/app/pat/services/pat.service';
import { TipoGEService } from 'src/app/gestion/services/tipoGE.service';

@Component({
  selector: 'app-proyecto.listar',
  templateUrl: './proyecto.listar.component.html',
  styleUrls: ['./proyecto.listar.component.scss']
})
export class ProyectoListarComponent implements OnInit {
  title = 'listarProyecto';
  proyectos: any[] = [];
  proyectosPendientes: any[] = [];
  actividadesEstrategicas:any[] = []

  constructor(private actividadService: ActividadService,
    private auth: AuthService,
    private patService: PatService,
    private tipoService: TipoGEService
    ){ }

  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProyectos() {
        
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
