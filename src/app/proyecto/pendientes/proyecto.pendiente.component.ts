import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActividadService } from 'src/app/actividad/services/actividad.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
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

  constructor(private actividadService: ActividadService,
    private auth: AuthService,
    private usuarioService :UsuarioService,
    private patService:PatService,
    private tipoService: TipoGEService,
    ){ }

  ngOnInit(): void {
    this.patService.getPatsData().subscribe((patsData: any[]) => {
      if (patsData && patsData.length > 0) {
        // Obtener los IDs de los Pats
        const idsPats = patsData.map(pat => pat.idPat);

        // Iterar sobre los IDs de Pats y cargar las actividades estratégicas
        for (const idPat of idsPats) {
          this.tipoService.listarActividadEstrategicaPorIdPat(idPat, this.auth.obtenerHeader())
            .toPromise()
            .then(
              (data: any) => {
                // Concatenar las actividades estratégicas obtenidas para todos los Pats
                this.actividadesEstrategicas = data;
                const idActividadEstrategicas = this.actividadesEstrategicas.map((act:any) => act.idActividadEstrategica);

                for (const idActividad of idActividadEstrategicas) {
                this.actividadService
                    .listarProyectoPorIdActividadEstrategica(idActividad,this.auth.obtenerHeader()) 
                    .toPromise()
                    .then(
                      (data: any) => {
                        this.proyectosPendientes = data.filter((pendiente: any) => pendiente.avance < 100);
                      },
                      (error) => {
                        Swal.fire(error.error.mensajeTecnico,'', 'error');
                      }
                    );
                  }
              },
              (error) => {
                Swal.fire(error.error.mensajeTecnico, '', 'error');
              }
            );
        }
      }
    })
  }


  cargarUsuario() {
    this.usuarioService.listarUsuario(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.usuarios = data;
    },
      (error) => {
        console.log(error);
      }
    );
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
