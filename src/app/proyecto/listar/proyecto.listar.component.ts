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
    this.patService.getPatsData().subscribe((patsData: any[]) => {
      if (patsData && patsData.length > 0) {
        // Obtener los IDs de los Pats
        const idsPats = patsData.map(pat => pat.idPat);
        // Lista acumulativa para almacenar todas las actividades estratégicas
        const allActividades: any[] = [];
        // Iterar sobre los IDs de Pats y cargar las actividades estratégicas
        for (const idPat of idsPats) {
          this.tipoService.listarActividadEstrategicaPorIdPat(idPat, this.auth.obtenerHeader())
            .toPromise()
            .then(
              (data: any) => {
                // Concatenar las actividades estratégicas obtenidas a la lista acumulativa
                allActividades.push(...data);
                // Si es la última iteración, asignar las actividades acumuladas a this.actividadesEstrategicas
                if (idPat === idsPats[idsPats.length - 1]) {
                  this.actividadesEstrategicas = allActividades;
  
                  // Lista acumulativa para almacenar todos los proyectos
                  const allProyectos: any[] = [];
                  // Obtener los IDs de las actividades estratégicas
                  const idsActividades = this.actividadesEstrategicas.map((actividad: any) => actividad.idActividadEstrategica);
                  // Iterar sobre los IDs de las actividades estratégicas y cargar los proyectos correspondientes
                  for (const idActividad of idsActividades) {
                    this.actividadService.listarProyectoPorIdActividadEstrategica(idActividad, this.auth.obtenerHeader())
                      .toPromise()
                      .then(
                        (proyectos: any ) => {
                          // Agregar los proyectos obtenidos a la lista acumulativa
                          allProyectos.push(...proyectos);
                          // Asociar los proyectos a la actividad estratégica correspondiente
                          if (idActividad === idsActividades[idsActividades.length - 1]) {
                            this.proyectos = allProyectos;         
                          }
                        }
                      );
                  }
                  // Asignar los proyectos acumulados a this.proyectos
                  this.proyectos = allProyectos;
                }
              }
            );
        }
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
