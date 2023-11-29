import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/login/auth/auth.service';
import { TipoGEService } from 'src/app/gestion/services/tipoGE.service';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';

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
  usuarios:any[] =[];

  constructor(private tipoService: TipoGEService,
    private auth: AuthService,
    private usuarioService :UsuarioService){}

  ngOnInit(): void {
    this.cargarActividadesEstrategicas();
    this.cargarUsuario();
    throw new Error('Method not implemented.');
  }

  cargarActividadesEstrategicas(){
    this.tipoService
      .listarActividadEstrategica(this.auth.obtenerHeader()) 
      .toPromise()
      .then(
        (data: any) => {
          this.actividadesEstrategicas = data;
        },
        (error) => {
          Swal.fire(error.error.mensajeTecnico,'', 'error');
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