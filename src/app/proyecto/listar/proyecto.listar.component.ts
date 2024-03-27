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
  totalProyectos: number=0;
  totalProyectosArea: number=0;
  proyectosArea: any[] = [];
  actividadesEstrategicas:any[] = [];
  nombresPatPorId: {[id: string]: string} = {};
  busqueda: any;

  constructor(private actividadService: ActividadService,
    private auth: AuthService,
    private patService: PatService,
    private tipoService: TipoGEService
    ){ }

    ngOnInit(): void {
      this.patService.getPatsAsociados().subscribe((patsData: any[]) => {
          if (patsData && patsData.length > 0) {
              // Obtener los IDs de los Pats
              const idsPats = patsData.map(pat => pat.idPat);
  
              // Lista acumulativa para almacenar todas las actividades estratégicas
              const todasLasActividadesEstrategicasRelacionadas: any[] = [];
              const todosLosProyecto: any[] = []; // Lista para almacenar todos los proyectos relacionados con las actividades
              const todosLosProyectoArea: any[] = [];
              // Iterar sobre los IDs de Pats y cargar las actividades estratégicas
              for (const idPat of idsPats) {
                  this.tipoService.listarActividadEstrategicaPorIdPat(idPat, this.auth.obtenerHeader())
                      .toPromise()
                      .then(
                          (data: any) => {
                              // Concatenar las actividades estratégicas obtenidas a la lista acumulativa
                              todasLasActividadesEstrategicasRelacionadas.push(...data);
  
                              // Obtener los IDs de las actividades estratégicas
                              const idActividades = data.map((actividad:any) => actividad.idActividadEstrategica);
  
                              // Iterar sobre los IDs de actividades para obtener los proyectos
                              for (const idActividad of idActividades) {
                                  this.actividadService.listarProyectoPorIdActividadEstrategica(idActividad, this.auth.obtenerHeader())
                                      .toPromise()
                                      .then(
                                          (proyectos: any) => {
                                              // Concatenar los proyectos obtenidos a la lista acumulativa
                                              // Agregar el nombre del Pat asociado a cada proyecto
                                              proyectos.forEach((proyecto: any) => {
                                                  proyecto.nombrePat = patsData.find(pat => pat.idPat === idPat).nombre;
                                              });
                                              todosLosProyecto.push(...proyectos);
                                          });
                              }
                          }
                      );
                  this.tipoService.listarProyectoAreaPorIdPat(idPat, this.auth.obtenerHeader())
                      .toPromise()
                      .then(
                          (data: any) => {
                              data.forEach((proyecto: any) => {
                                  proyecto.nombrePat = patsData.find(pat => pat.idPat === idPat).nombre;
                              });
                              // Concatenar las actividades estratégicas obtenidas a la lista acumulativa
                              todosLosProyectoArea.push(...data);
                              // Si es la última iteración, asignar las actividades acumuladas a this.actividadesEstrategicas
                              if (idPat === idsPats[idsPats.length - 1]) {
                                  this.proyectosArea = todosLosProyectoArea;
                              }
                              this.patService.setProyectosArea(this.proyectosArea.length);
                          }
                      );
              }
              // Almacenar todas las actividades estratégicas y proyectos obtenidos
              this.actividadesEstrategicas = todasLasActividadesEstrategicasRelacionadas;
              this.proyectos = todosLosProyecto;
  
          }
  
      });
      this.patService.getProyectos().subscribe(actividad => {
          this.totalProyectos = actividad;
      });
      this.patService.getProyectosArea().subscribe(actividad => {
          this.totalProyectosArea = actividad;
      });
  }
  

  colorPorcentaje(porcentaje: number): string {
    if (porcentaje < 80 ) {
      return 'porcentaje-bajo'; // Define las clases CSS para porcentajes bajos en tu archivo de estilos.
    } else if (porcentaje >= 80 && porcentaje < 100) {
      return 'porcentaje-medio'; // Define las clases CSS para porcentajes normales en tu archivo de estilos.
    } else {
      return 'porcentaje-cien';
    }
  }

}
