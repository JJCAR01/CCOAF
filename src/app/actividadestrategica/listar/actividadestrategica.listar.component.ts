import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/login/auth/auth.service';
import { TipoGEService } from 'src/app/gestion/services/tipoGE.service';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { PatService } from 'src/app/pat/services/pat.service';
import { Router } from '@angular/router';
import { Pat } from 'src/app/modelo/pat';

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
  nombrePat: string | null = '';
  usuarios:any[] =[];
  pats : Pat[] = [];

  constructor(private tipoService: TipoGEService,
    private auth: AuthService,
    private usuarioService :UsuarioService,
    private patService:PatService,
    private router:Router){}

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarPats();
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
                }
              }
            );
        }
      }
    });
    
  }
  cargarUsuario() {
    this.usuarioService.listarUsuario(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.usuarios = data;
    })
  }
  cargarPats() {
    this.patService.listarPat(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.pats = data;
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
  obtenerNombrePat(idPat: number) {
    const pat = this.pats.find((u) => u.idPat === idPat);
    return pat ? pat.nombre : '';
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
