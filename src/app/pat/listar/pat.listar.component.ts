import { Component, OnInit } from '@angular/core';
import { PatService } from '../services/pat.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoGEService } from 'src/app/gestion/services/tipoGE.service';
import { ActividadService } from 'src/app/actividad/services/actividad.service';
import { ProcesoService } from 'src/app/proceso/services/proceso.service';
import { DireccionService } from 'src/app/direccion/services/direccion.service';
import { Direccion } from '../../modelo/direccion';
import { Proceso } from '../../modelo/proceso';
import { Usuario } from 'src/app/modelo/usuario';
import { ObservacionPat } from 'src/app/modelo/observacionpat';
import { Pat } from 'src/app/modelo/pat';
import { MENSAJE_TITULO } from 'src/app/utilitarios/mensaje/mensajetitulo';


@Component({
  selector: 'app-root',
  templateUrl: './pat.listar.component.html',
  styleUrls: ['./pat.listar.component.scss']
})
export class PatListarComponent implements OnInit{
  title = 'listarPat';
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
  esConsultor: boolean = false;

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
  form: FormGroup;
  formObservacion: FormGroup;

    constructor(
      private patService: PatService,private auth:AuthService,
      private usuarioService:UsuarioService, private formBuilder: FormBuilder,
      private tipoService:TipoGEService, private actividadService:ActividadService,
      private direccionService:DireccionService) 
      {
        this.form = this.formBuilder.group({
          nombre:['', Validators.required],
          fechaAnual: ['', Validators.required],
          direccion: ['', Validators.required],
          porcentajeReal: ['', Validators.required],
          porcentajeEsperado: ['', Validators.required],
          porcentajeCumplimiento : ['', Validators.required],
          idUsuario: ['', Validators.required],
        });
        this.formObservacion = this.formBuilder.group({
          idPat: ['', Validators.required],
          fecha: [this.obtenerFechaActual(), Validators.required],
          nombre: ['', Validators.required],
        }); 
    }  

    ngOnInit() {
      // Usar Promise.all para esperar a que todas las promesas se resuelvan
      Promise.all([
        this.auth.esAdmin(),
        this.auth.esDirector(),
        this.auth.esOperador(),
        this.auth.esConsultor()
      ]).then(([admin, director, operador, consultor]) => {
        // Asignar los resultados a las propiedades correspondientes
        this.esAdmin = admin;
        this.esDirector = director;
        this.esOperador = operador;
        this.esConsultor = consultor;

        
      });
      this.cargarPats();
      this.cargarUsuario();
      this.cargarDirecciones();
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
          const patsFiltrados = data.filter((d: any) => {
            if (d.fechaAnual === this.obtenerAnual()) {// Verificar si la fecha anual coincide con el año actual
              if (this.esAdmin) { // Si es administrador, mostrar todos los datos
                return true;
              } else if (this.esDirector && listaDeDireccionesUsuario.includes(d.direccion.nombre)) {
                return true;
              } else if (d.idUsuario === idUsuarioLogueado || listaDePatsUsuario.includes(d.nombre)) {
                return true;
              } else {
                return false;
              }
            } else {
              return false; // No mostrar datos si la fecha anual no coincide con el año actual
            }
          });

          // Actualizar la cantidad de pats
          this.cantidadPats = patsFiltrados.length;

          // Cargar las actividades estratégicas relacionadas con los planes anuales
          this.cargarActividadesEstrategica(patsFiltrados);
          this.cargarPatsActividadGestion(patsFiltrados);
          this.patService.setPatsData(patsFiltrados);
          this.pats = patsFiltrados;
        },
        (error) => {
          this.swalError(error);
        }
      );
    }
    cargarPatsActividadGestion(pats: any[]) {
      // Obtener los IDs de los planes anuales
      const idsPats = pats.map(pat => pat.idPat);
    
      // Filtrar las actividades de gestión por los IDs de los planes anuales
      this.tipoService.listarGestion(this.auth.obtenerHeader()).toPromise().then(
        (data: any) => {
          const actividadesFiltradas = data.filter((actividad: any) =>
            idsPats.includes(actividad.idPat)
          );
    
          actividadesFiltradas.forEach((actividad: any) => {
            const terminadas = actividad.avance;
    
            if (terminadas === 100) {
              this.sumadorActividadGestionTerminados += 1;
            } else {
              this.sumadorActividadGestionAbiertos += 1;
            }
          });
    
          const numeroDeListas = actividadesFiltradas.length;
          this.cantidadGestiones = numeroDeListas;
        },
        (error) => {
          this.swalError(error);
        }
      );
    }
    cargarActividadesEstrategica(pats: any[]) {
      // Obtener los IDs de los planes anuales
      const idsPats = pats.map(pat => pat.idPat);
    
      // Filtrar las actividades estratégicas por los IDs de los planes anuales
      this.tipoService.listarActividadEstrategica(this.auth.obtenerHeader()).toPromise().then(
        (data: any) => {
          this.actividadesFiltradas = data.filter((actividad: any) =>
            idsPats.includes(actividad.idPat)
          );
    
          this.actividadesFiltradas.forEach((actividad: any) => {
            const terminadas = actividad.avance;
            
            if (terminadas === 100) {
              this.sumadorActividadEstrategicasTerminados += 1;
            } else {
              this.sumadorActividadEstrategicasAbiertos += 1;
            }
            
          });
          this.cargarActividadGestionActividadesEstrategica(this.actividadesFiltradas);
          this.cargarPatsProyectos(this.actividadesFiltradas);
          const numeroDeListas = this.actividadesFiltradas.length;
          this.cantidadEstrategicas = numeroDeListas;
          
        },
        (error) => {
          this.swalError(error);
        }
      );
    }
    cargarActividadGestionActividadesEstrategica(actividadesEstrategicas: any[]) {
      // Obtener los IDs de las actividades estratégicas
      const idsActividadesEstrategicas = actividadesEstrategicas.map(actividad => actividad.idActividadEstrategica);
      // Consultar las actividades de gestión relacionadas con las actividades estratégicas
      this.actividadService.listarActividadGestionActividadEstrategica(this.auth.obtenerHeader()).toPromise().then(
        (data: any) => {
          this.actividadesGestionFiltradas = data.filter((actividad: any) =>
            idsActividadesEstrategicas.includes(actividad.idActividadEstrategica)
          );
    
          this.actividadesGestionFiltradas.forEach((actividad: any) => {
            const terminadas = actividad.avance;
    
            if (terminadas === 100) {
              this.sumadorActividadGestionTerminados += 1;
            } else {
              this.sumadorActividadGestionAbiertos += 1;
            }
          });
    
          const numeroDeListas = this.actividadesGestionFiltradas.length;
          this.cantidadGestionesActividadEstrategica = numeroDeListas;
        },
        (error) => {
          this.swalError(error);
        }
      );
    }
    
    cargarPatsProyectos(proyectos: any[]) {
      // Obtener los IDs de las actividades estratégicas
      const idsProyectos = proyectos.map(proyecto => proyecto.idActividadEstrategica);

      this.actividadService.listarProyecto(this.auth.obtenerHeader()).toPromise().then(
        (data: any) => {
          this.proyectosFiltrados = data.filter((proyecto: any) =>
            idsProyectos.includes(proyecto.idActividadEstrategica)
          );
          this.proyectosFiltrados.forEach((proyecto:any) => {
            const terminadas = proyecto.avance;
            if (terminadas === 100) {
              this.sumadorProyectosTerminados += 1;
            } else {
              this.sumadorProyectosAbiertos += 1;
            }
          });
          const numeroDeListas = this.proyectosFiltrados.length;
          this.cantidadProyectos = numeroDeListas;
        },
        (error) => {
          this.swalError(error);
        }
      );
    }

    modificarPat() {
      if (this.form.valid && this.idPatSeleccionado) {
        const nombre = this.form.get('nombre')?.value;
        const fechaAnual = this.form.get('fechaAnual')?.value;
        const direccion = this.form.get('direccion')?.value;
        const porcentajeReal = this.form.get('porcentajeReal')?.value;
        const porcentajeEsperado = this.form.get('porcentajeEsperado')?.value;
        const porcentajeCumplimiento = this.form.get('porcentajeCumplimiento')?.value;
        const idUsuario = this.form.get('idUsuario')?.value;
        const pat = {
          nombre: nombre,
          fechaAnual: fechaAnual,
          direccion:direccion,
          porcentajeReal:porcentajeReal,
          porcentajeEsperado:porcentajeEsperado,
          porcentajeCumplimiento:porcentajeCumplimiento,
          idUsuario: idUsuario
        }
        Swal.fire({
          icon:"question",
          title: "¿Estás seguro de modificar?",
          text: "Una vez modificado no podrás revertir los cambios",
          showCancelButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Confirmar",
          confirmButtonColor: '#0E823F',
          reverseButtons: true, 
        })
        .then((confirmacion) => {
          if (confirmacion.isConfirmed) {
            if (this.idPatSeleccionado != null) {
                this.patService.modificarPat(pat, this.idPatSeleccionado, this.auth.obtenerHeader()).subscribe(
                () => {
                  this.swalSatisfactorio('modificado','plan anual de trabajo')
                  this.cargarPats();
                },
                (error) => {
                  this.swalError(error)
                }
              );
            }
          }
        });
      } 
    }
    
    eliminarPat(idPat: number) {
      Swal.fire({
        icon:"question",
        title: "¿Estás seguro?",
        text: "Una vez eliminado  el pat, no podrás recuperar este elemento.",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true, 
      })
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
          this.patService.eliminarPat(idPat, this.auth.obtenerHeader()).subscribe(
            () => {
              this.swalSatisfactorio('eliminado','plan anual de trabajo');
              this.cargarPats();
            },
            (error) => {
              this.swalError(error);
            }
          );
        }
      });
    }
    crearObservacion() {
      if (this.formObservacion.valid) {
        const fecha = this.formObservacion.get('fecha')?.value;
        const nombre = this.formObservacion.get('nombre')?.value;
        const observacion = {
          idPat: this.idPatSeleccionado,
          nombre: nombre,
          fecha: fecha,
        };
        this.patService
          .crearObservacion(observacion,this.auth.obtenerHeader())
          .subscribe(
            (response) => {
                this.swalSatisfactorio('creado','observación')
                this.formObservacion.reset()
            },
            (error) => {this.swalError(error);}
          );
      }
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

      this.form.patchValue({
        nombre: pat.nombre,
        fechaAnual:  pat.fechaAnual,
        direccion: pat.direccion.nombre,
        porcentajeReal: pat.porcentajeReal,
        porcentajeEsperado: pat.porcentajeEsperado,
        porcentajeCumplimiento: pat.porcentajeCumplimiento,
        idUsuario: pat.idUsuario
      });
      this.formObservacion.patchValue({
        idPat: this.idPatSeleccionado,
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
    get nombreObservacionVacio(){
      return this.formObservacion.get('nombre')?.invalid && this.formObservacion.get('nombre')?.touched;
    }
    get fechaVacio(){
      return this.formObservacion.get('fecha')?.invalid && this.formObservacion.get('fecha')?.touched;
    }

    swalSatisfactorio(metodo: string, tipo:string) {
      Swal.fire({
        title: `Se ha ${metodo}.`,
        text: `El ${tipo} se ha ${metodo}!!`,
        icon:'success',
        position: "center",
        showConfirmButton: false,
        timer: 1000
      }
      );
    }
    swalError(error: any) {
      Swal.fire(
        {
          title:"Error!!!",
          text:error.error.mensajeHumano, 
          icon:"error",
          confirmButtonColor: '#0E823F',
        }
      );
    }
    private obtenerFechaActual(): string {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
      const day = ('0' + currentDate.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    }
    private obtenerAnual(): number {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      return year;
    }
}