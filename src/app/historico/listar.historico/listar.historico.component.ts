import { Component } from '@angular/core';
import { DireccionService } from 'src/app/direccion/services/direccion.service';
import { TipoGEService } from 'src/app/gestion/services/tipoGE.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { MENSAJE_TITULO } from 'src/app/utilitarios/mensaje/mensajetitulo';
import { Direccion } from 'src/app/modelo/direccion';
import { ObservacionPat } from 'src/app/modelo/observacionpat';
import { Pat } from 'src/app/modelo/pat';
import { Proceso } from 'src/app/modelo/proceso';
import { Usuario } from 'src/app/modelo/usuario';
import { PatService } from 'src/app/pat/services/pat.service';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';

@Component({
  selector: 'app-listar.historico',
  templateUrl: './listar.historico.component.html',
  styleUrls: ['./listar.historico.component.scss']
})
export class ListarHistoricoComponent {
  title = 'listarHistorico';
  CAMPO_OBLIGATORIO = MENSAJE_TITULO.CAMPO_OBLIGATORIO;
  NOMBRE_PAT = MENSAJE_TITULO.NOMBRE_PROGRAMA;
  FECHA_ANUAL = MENSAJE_TITULO.FECHA_ANUAL_PAT;
  DIRECCION = MENSAJE_TITULO.DIRECCION;
  AVANCE_REAL_PAT = MENSAJE_TITULO.AVANCE_REAL_PAT;
  AVANCE_ESPERADO=  MENSAJE_TITULO.AVANCE_ESPERADO;
  CUMPLIMIENTO=  MENSAJE_TITULO.CUMPLIMIENTO;
  AVANCE_PAT = MENSAJE_TITULO.AVANCE_PAT;
  ACCIONES =  MENSAJE_TITULO.ACCIONES;
  RESPONSABLE = MENSAJE_TITULO.RESPONSABLE_PAT;

  esAdmin: boolean = false; 
  esDirector: boolean = false; 
  esOperador: boolean = false; // Agrega esta línea

  idPatSeleccionado: number | 0 = 0;
  nombrePatSeleccionado: string | undefined;
  fechaAnualSeleccionada: number | 0 = 0;
  procesoSeleccionado: any | undefined;
  direccionSeleccionada: any | undefined;
  idUsuarioSeleccionado: any | 0 = 0;
  cantidadPats: number | 0 = 0;
  cantidadProyectos: number | 0 = 0;
  cantidadGestiones: number | 0 = 0;
  cantidadGestionesActividadEstrategica: number | 0 = 0;
  cantidadEstrategicas: number | 0 = 0;
  sumadorProyectosTerminados: number | 0 = 0;
  sumadorProyectosAbiertos: number | 0 = 0;
  sumadorActividadGestionTerminados: number | 0 = 0;
  sumadorActividadGestionAbiertos: number | 0 = 0;
  sumadorActividadEstrategicasTerminados: number | 0 = 0;
  sumadorActividadEstrategicasAbiertos: number | 0 = 0;
  actividadesFiltradas: string[] = [];
  proyectosFiltrados: string[] = [];
  actividadesGestionFiltradas: string[] = [];
  pats: Pat[] = [];
  usuarios: Usuario[] = [];
  procesos: Proceso[] = [];
  direcciones: Direccion[] = [];
  observaciones: ObservacionPat[] = [];
  busqueda: any;
  busquedaFechaAnual:any;
  busquedaDireccion:any;

    constructor(
      private patService: PatService,private auth:AuthService,
      private usuarioService:UsuarioService,
      private direccionService:DireccionService) 
      {  }  

    ngOnInit() {
      // Usar Promise.all para esperar a que todas las promesas se resuelvan
      Promise.all([
        this.auth.esAdmin(),
        this.auth.esDirector(),
        this.auth.esOperador()
      ]).then(([esAdmin, esDirector, esOperador]) => {
        // Asignar los resultados a las propiedades correspondientes
        this.esAdmin = esAdmin;
        this.esDirector = esDirector;
        this.esOperador = esOperador;

        // Una vez que se hayan obtenido los roles del usuario, cargar los datos
        this.cargarPats();
        this.cargarUsuario();
        this.cargarDirecciones();
      });
    }
    cargarUsuario() {
      this.usuarioService.listarUsuario(this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.usuarios = data;
        }
      );
    }
    cargarDirecciones() {
      this.direccionService.listar(this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.direcciones = data;
        }
      )
    }
    cargarObservaciones(idPat:any) {
      this.patService.listarObservacionPorIdPat(idPat,this.auth.obtenerHeader()).subscribe(
          (data: any) => { 
            this.observaciones = data; 
          }
      )
    } 

    cargarPats() {
      this.patService.listarPat(this.auth.obtenerHeader()).toPromise().then(
        (data: any) => {
          // Obtener el token
          const token: any = this.auth.getToken();
    
          // Decodificar el payload del token
          const payloadBase64 = token.split('.')[1];
          const payloadBytes = new Uint8Array(atob(payloadBase64).split('').map(char => char.charCodeAt(0)));
          const decodedPayload = JSON.parse(new TextDecoder().decode(payloadBytes));

          // Convertir las cadenas de direcciones y pats a arrays
          //const direccionesArray = decodedPayload.direccion.split(',').map((direccion: string) => direccion.trim());
          const idUsuarioLogueado = decodedPayload.idUser;
          const listaDePatsUsuario = decodedPayload.pats.split(',').map((pat: string) => pat.trim());
          const listaDeDireccionesUsuario = decodedPayload.direcciones.split(',').map((direccion: string) => direccion.trim());
          const tipoUsuario = decodedPayload.type;
          // Verificar si son todas las direcciones y todos los procesos
          //const sonTodasLasDirecciones = direccionesArray.includes('TODAS LAS DIRECCIONES');
          

          // Filtrar los datos según las direcciones y procesos del payload
          const patsFiltrados = data.filter((d: any) => {
              if (tipoUsuario === 'ADMIN') {
                return true;
              }  else if (d.idUsuario === idUsuarioLogueado){
                return true;
              } else if (listaDePatsUsuario.includes(d.nombre)) {
                return true;
              } else if (tipoUsuario === 'DIRECTOR' && listaDeDireccionesUsuario.includes(d.direccion.nombre)) {
                return true;
              }  else {
                return false;
              }
            });
    
          // Actualizar la cantidad de pats
          this.cantidadPats = patsFiltrados.length;

          this.patService.setPatsAsociados(patsFiltrados);
          this.pats = patsFiltrados;
        }
      );
    }

    sumarCantidadesGestion(data: any[]) {
      data.forEach((actividad: any) => {
        const terminadas = actividad.avance;
    
        if (terminadas === 100) {
          this.sumadorActividadGestionTerminados += 1;
        } else {
          this.sumadorActividadGestionAbiertos += 1;
        }
      });
    
      const numeroDeListas = data.length;
      this.cantidadGestiones += numeroDeListas;
    }

    obtenerNombreUsuario(idUsuario: number) {
      const usuario = this.usuarios.find((u) => u.idUsuario === idUsuario);
      return usuario ? usuario.nombre + " " + usuario.apellidos : '';
    }

    obtenerPat(idPat: number,pat:any) {
      this.idPatSeleccionado = idPat;
      this.direccionSeleccionada = pat.direccion.nombre;
      this.idUsuarioSeleccionado = pat.idUsuario
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
    finalizado(porcentaje: number): string {
      if (porcentaje == 100) {
        return 'porcentaje-bajo'; // Define las clases CSS para porcentajes bajos en tu archivo de estilos.
      } else if (porcentaje >= 30 && porcentaje < 100){
        return 'porcentaje-medio'; // Define las clases CSS para porcentajes normales en tu archivo de estilos.
      } else {
        return 'porcentaje-cien';
      }
    }

}
