import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActividadService } from 'src/app/actividad/services/actividad.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { TipoGEService } from 'src/app/gestion/services/tipoGE.service';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';

@Component({
  selector: 'app-actividadestrategica.listar',
  templateUrl: './actividadestrategica.pendiente.component.html',
  styleUrls: ['./actividadestrategica.pendiente.component.scss']
})
export class ActividadEstrategicaPendienteListarComponent implements OnInit {
  title = 'listarActividadEstrategicaPendiente';
  proyectos: any[] = [];
  actividadesEstrategicasPendientes: any[] = [];
  usuarios:any[] = [];

  constructor(private tipoService: TipoGEService,
    private auth: AuthService,
    private usuarioService :UsuarioService
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
