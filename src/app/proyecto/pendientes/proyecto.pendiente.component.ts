import { Component, OnInit} from '@angular/core';
import { ActividadService } from 'src/app/actividad/services/actividad.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { PatService } from 'src/app/pat/services/pat.service';
import { TipoGEService } from 'src/app/gestion/services/tipoGE.service';

@Component({
  selector: 'app-proyecto.listar',
  templateUrl: './proyecto.pendiente.component.html',
  styleUrls: ['./proyecto.pendiente.component.scss']
})
export class ProyectoPendienteListarComponent implements OnInit {
  title = 'listarProyectosPendiente';
  totalProyectosPendientes:number=0;
  totalProyectosAreaPendientes:number=0;
  proyectosAreaPendientes:any[] = [];
  usuarios: any[] = [];
  proyectosPendientes: any[] = [];
  actividadesEstrategicas: any[] = [];
  nombresPatPorId: {[id: string]: string} = {};
  busqueda: any;

  constructor(private actividadService: ActividadService,
    private auth: AuthService,
    private patService:PatService,
    private tipoService: TipoGEService,
    ){ }

    ngOnInit(): void {
      this.patService.getPatsAsociados().subscribe((patsData: any[]) => {
          if (patsData && patsData.length > 0) {
              const idsPats = patsData.map(pat => pat.idPat);
              const allActividades: any[] = [];
              const todosProyectosPendientes: any[] = [];
              const todosProyectosAreaPendientes: any[] = [];
              const promesasProyectos: Promise<any>[] = [];
  
              // Iterar sobre los IDs de Pats y cargar las actividades estratégicas
              for (const idPat of idsPats) {
                  this.tipoService.listarActividadEstrategicaPorIdPat(idPat, this.auth.obtenerHeader())
                      .subscribe((data: any) => {
                          allActividades.push(...data);
                          const idActividades = data.map((actividad: any) => actividad.idActividadEstrategica);
  
                          for (const idActividad of idActividades) {
                              const promesaProyecto = this.actividadService.listarProyectoPorIdActividadEstrategica(idActividad, this.auth.obtenerHeader())
                                  .toPromise()
                                  .then((proyectos: any) => {
                                        proyectos.forEach((proyecto: any) => {
                                          proyecto.nombrePat = patsData.find(pat => pat.idPat === idPat).nombre;
                                      });
                                      const proyectosPendientesActividad = proyectos.filter((proyecto: any) => proyecto.porcentajeReal < 100);
                                      todosProyectosPendientes.push(...proyectosPendientesActividad);
                                  });
                              promesasProyectos.push(promesaProyecto);
                          }
                      });
  
                  this.tipoService.listarProyectoAreaPorIdPat(idPat, this.auth.obtenerHeader())
                      .toPromise()
                      .then((dataProyectosArea: any) => {
                          dataProyectosArea.forEach((proyecto: any) => {
                              proyecto.nombrePat = patsData.find(pat => pat.idPat === idPat).nombre;
                          });
                          const proyectosPendientes = dataProyectosArea.filter((pendiente: any) => pendiente.porcentajeReal < 100);
                          todosProyectosAreaPendientes.push(...proyectosPendientes);
                          this.patService.setProyectosPendientesArea(this.proyectosAreaPendientes.length);
                      });
                      this.proyectosAreaPendientes = todosProyectosAreaPendientes;
              }
  
              Promise.all(promesasProyectos).then(() => {
                  this.proyectosPendientes = todosProyectosPendientes;


              });
          }
      });
  
      this.patService.getProyectosPendientes().subscribe(actividad => {
          this.totalProyectosPendientes = actividad;
      });
  
      this.patService.getProyectosPendientesArea().subscribe(actividad => {
          this.totalProyectosAreaPendientes = actividad;
      });
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
