import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActividadService } from 'src/app/actividad/services/actividad.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';

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

  constructor(private actividadService: ActividadService,
    private auth: AuthService,
    private usuarioService :UsuarioService
    ){ }

  ngOnInit(): void {
    this.cargarProyectosPendientes();
  }

  cargarProyectosPendientes() {
    this.actividadService.listarProyecto(this.auth.obtenerHeader()).subscribe((data: any) => {
      this.proyectosPendientes = data.filter((pendiente: any) => pendiente.avance < 100);
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
