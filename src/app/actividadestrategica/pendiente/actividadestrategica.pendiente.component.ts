import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActividadService } from 'src/app/actividad/services/actividad.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { TipoGEService } from 'src/app/gestion/services/tipoGE.service';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { PatService } from 'src/app/pat/services/pat.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-actividadestrategica.listar',
  templateUrl: './actividadestrategica.pendiente.component.html',
  styleUrls: ['./actividadestrategica.pendiente.component.scss']
})
export class ActividadEstrategicaPendienteListarComponent implements OnInit {
  title = 'listarActividadEstrategicaPendiente';
  proyectos: any[] = [];
  patNombre:string|undefined;
  actividadesEstrategicasPendientes: any[] = [];
  usuarios:any[] = [];

  constructor(private tipoService: TipoGEService,
    private auth: AuthService,
    private usuarioService :UsuarioService,
    private patService:PatService,
    private route: ActivatedRoute, // Agrega ActivatedRoute
    private router:Router
    ){ }

  ngOnInit(): void {
    this.cargarActividadesEstrategicaPendientes();
    this.cargarUsuario()
  }


  cargarActividadesEstrategicaPendientes() {
    this.tipoService.listarActividadEstrategica(this.auth.obtenerHeader()).subscribe((data: any) => {
      this.actividadesEstrategicasPendientes = data.filter((pendiente: any) => pendiente.avance < 100);

    });
  }

  irADetalles(actividad: any) {
    // Obtén el nombre del PAT antes de navegar
    this.patService.listarPatPorId(actividad.idPat, this.auth.obtenerHeader()).subscribe(
      (data:any) => {
        const patNombre = data.nombre;
        // Navega a la página de detalles con el nombre asociado al idPat
        this.router.navigate(['/panel', { outlets: { 'OutletAdmin': ['listarActividad', actividad.idActividadEstrategica, 'pat', patNombre] } }]);
      },
      (error) => {
        console.error('Error al obtener el nombre del PAT:', error);
      }
    );
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
