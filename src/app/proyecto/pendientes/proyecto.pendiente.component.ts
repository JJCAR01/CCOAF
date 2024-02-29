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
  proyectos: any[] = [];
  usuarios: any[] = [];
  proyectosPendientes: any[] = [];
  actividadesEstrategicas: any[] = [];
  busqueda: any;

  constructor(private actividadService: ActividadService,
    private auth: AuthService,
    private patService:PatService,
    private tipoService: TipoGEService,
    ){ }

  ngOnInit(): void {
    this.patService.getPatsData().subscribe((patsData: any[]) => {
      if (patsData && patsData.length > 0) {
          // Obtener los IDs de los Pats
          const idsPats = patsData.map(pat => pat.idPat);
  
          // Lista acumulativa para almacenar todas las actividades estratégicas
          const allActividades: any[] = [];
          const todosProyectosPendientes: any[] = []; // Lista para almacenar proyectos pendientes
  
          // Promesas de carga de proyectos
          const promesasProyectos: Promise<any>[] = [];
  
          // Iterar sobre los IDs de Pats y cargar las actividades estratégicas
          for (const idPat of idsPats) {
              this.tipoService.listarActividadEstrategicaPorIdPat(idPat, this.auth.obtenerHeader())
                  .toPromise()
                  .then((data: any) => {
                      // Concatenar las actividades estratégicas obtenidas a la lista acumulativa
                      allActividades.push(...data);
  
                      // Obtener los IDs de las actividades estratégicas
                      const idActividades = data.map((actividad: any) => actividad.idActividadEstrategica);
  
                      // Iterar sobre los IDs de actividades para obtener los proyectos
                      for (const idActividad of idActividades) {
                          const promesaProyecto = this.actividadService.listarProyectoPorIdActividadEstrategica(idActividad, this.auth.obtenerHeader())
                              .toPromise()
                              .then((proyectos: any) => {
                                  // Filtrar los proyectos pendientes (con porcentaje real < 100)
                                  const proyectosPendientesActividad = proyectos.filter((proyecto: any) => proyecto.porcentajeReal < 100);
                                  // Agregar los proyectos pendientes a la lista acumulativa
                                  todosProyectosPendientes.push(...proyectosPendientesActividad);
                              });
                          promesasProyectos.push(promesaProyecto);
                      }
                  });
          }
  
          // Esperar a que todas las promesas de carga de proyectos se resuelvan
          Promise.all(promesasProyectos).then(() => {
              // Asignar los proyectos pendientes una vez que todas las promesas se han resuelto
              this.proyectosPendientes = todosProyectosPendientes;
          });
      }
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
