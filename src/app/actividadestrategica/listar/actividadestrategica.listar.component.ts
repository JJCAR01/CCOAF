import { Component, OnInit} from '@angular/core';
import { AuthService } from 'src/app/login/auth/auth.service';
import { TipoGEService } from 'src/app/gestion/services/tipoGE.service';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { PatService } from 'src/app/pat/services/pat.service';
import { Router } from '@angular/router';
import { Pat } from 'src/app/modelo/pat';
import { Usuario } from 'src/app/modelo/usuario';

@Component({
  selector: 'app-actividadestrategica.listar',
  templateUrl: './actividadestrategica.listar.component.html',
  styleUrls: ['./actividadestrategica.listar.component.scss']
})
export class ActividadestrategicaListarComponent implements OnInit{
  title = 'listarActividadesEstrategicas';
  actividadesEstrategicas: any[] = [];
  actividadesEstrategicasPendientes: any[] = [];
  usuarios:Usuario[] =[];
  pats : Pat[] = [];
  nombresPatPorId: {[id: string]: string} = {};
  totalActividadesEstrategicas : number = 0;
  totalActividadesEstrategicasPendintes: number =0;
  busqueda: any;
  busquedaUsuario:any;

  constructor(private tipoService: TipoGEService,
    private auth: AuthService,
    private usuarioService :UsuarioService,
    private patService:PatService,
    private router:Router){}

  ngOnInit(): void {
    this.cargarUsuario();
    this.patService.getPatsAsociados().subscribe((patsData: any[]) => {
      if (patsData && patsData.length > 0) {
        // Obtener los IDs de los Pats
        const idsPats = patsData.map(pat => pat.idPat);

        // Obtener los nombres de los PATs junto con sus IDs
        for (const pat of patsData) {
          this.nombresPatPorId[pat.idPat] = pat.nombre; // Suponiendo que el nombre del PAT se encuentra en pat.nombre
        }
        // Lista acumulativa para almacenar todas las actividades estratégicas
        const allActividades: any[] = [];
        const allActividadesPendientes: any[] = [];
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
                }
                // Filtrar las actividades estratégicas pendientes
                const actividadesPendientes = data.filter((pendiente: any) => pendiente.porcentajeReal < 100);
                // Agregar las actividades pendientes a la lista acumulativa
                allActividadesPendientes.push(...actividadesPendientes);
                // Si es la última iteración, asignar las actividades acumuladas a this.actividadesEstrategicasPendientes
                if (idPat === idsPats[idsPats.length - 1]) {
                  this.actividadesEstrategicasPendientes = allActividadesPendientes;
                }
              }
            );
        }
      }
    });  
    this.patService.getActividadesEstrategicasPendientes().subscribe(actividad => {
      this.totalActividadesEstrategicasPendintes = actividad;
    });
    this.patService.getActividadesEstrategicas().subscribe(actividad => {
      this.totalActividadesEstrategicas = actividad;
    });
    
    
  }
  cargarUsuario() {
    this.usuarioService.listarUsuario(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.usuarios = data;
    })
  }
 
  irADetalles(actividad: any) {
    // Obtén el nombre del PAT antes de navegar
    this.patService.listarPatPorId(actividad.idPat, this.auth.obtenerHeader()).subscribe(
      (data:any) => {
        const patNombre = data.nombre;
        // Navega a la página de detalles con el nombre asociado al idPat
        this.router.navigate(['/panel', { outlets: { 'OutletAdmin': ['listarActividad', actividad.idActividadEstrategica, 'pat', patNombre] } }]);
      }
    );
  }

  obtenerNombreUsuario(idUsuario: number) {
    const usuario = this.usuarios.find((u) => u.idUsuario === idUsuario);
    return usuario ? usuario.nombre + " " + usuario.apellidos : '';
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
