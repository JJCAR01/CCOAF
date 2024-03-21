import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { TipoGEService } from '../services/tipoGE.service';
import { PatService } from 'src/app/pat/services/pat.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TareaService } from 'src/app/tarea/services/tarea.service';
import { EEstado } from 'src/enums/eestado';
import { EPeriodicidad } from 'src/enums/eperiodicidad';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.development';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Pat } from 'src/app/modelo/pat';
import { Usuario } from 'src/app/modelo/usuario';
import { ActividadEstrategica } from 'src/app/modelo/actividadestrategica';
import { ActividadGestion } from 'src/app/modelo/actividadgestion';
import { Tarea } from 'src/app/modelo/tarea';
import { ProyectoArea } from 'src/app/modelo/proyectoarea';
import { EModalidad } from 'src/enums/emodalidad';
import { EPlaneacion } from 'src/enums/eplaneacion';
import { EPeriodicidadMeta } from 'src/enums/eperiodicidadmeta';
import { MENSAJE_TITULO } from 'src/app/utilitarios/mensaje/mensajetitulo';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root:not(p)',
  templateUrl: './tipoGE.listar.component.html',
  styleUrls: ['./tipoGE.listar.component.scss']
})

export class TipogeListarComponent implements OnInit {
  title = 'listarTipoGE';
  CAMPO_OBLIGATORIO = MENSAJE_TITULO.CAMPO_OBLIGATORIO;
  DURACION=  MENSAJE_TITULO.DURACION;
  NOMBRE_ACTIVDIDAD_ESTRATEGICA = MENSAJE_TITULO.NOMBRE_ACTIVIDAD_ESTRATEGICA;
  NOMBRE_GESTION_AREA = MENSAJE_TITULO.NOMBRE_GESTION_AREA;
  NOMBRE_PROYECTO_AREA = MENSAJE_TITULO.NOMBRE_PROYECTO_AREA;
  NOMBRE_TAREA = MENSAJE_TITULO.NOMBRE_TAREA_DE_GESTION_AREA;
  FECHA_INICIAL_ACTIVIDAD_ESTRATEGICA = MENSAJE_TITULO.FECHA_INICIAL_ACTIVIDAD_ESTRATEGICA;
  FECHA_INICIAL_GESTION_AREA = MENSAJE_TITULO.FECHA_INICIAL_GESTION_AREA;
  FECHA_INICIAL_PROYECTO_AREA = MENSAJE_TITULO.FECHA_INICIAL_PROYECTO_AREA;
  FECHA_FINAL_ACTIVIDAD_ESTRATEGICA = MENSAJE_TITULO.FECHA_FINAL_ACTIVIDAD_ESTRATEGICA;
  FECHA_FINAL_GESTION_AREA = MENSAJE_TITULO.FECHA_FINAL_GESTION_AREA;
  FECHA_FINAL_PROYECTO_AREA = MENSAJE_TITULO.FECHA_FINAL_PROYECTO_AREA;
  AVANCE_REAL_ACTIVIDAD_ESTRATEGICA = MENSAJE_TITULO.AVANCE_REAL_ACTIVIDAD_ESTRATEGICA;
  AVANCE_REAL_GESTION_AREA = MENSAJE_TITULO.AVANCE_REAL_TAREA;
  AVANCE_REAL_PROYECTO_AREA = MENSAJE_TITULO.AVANCE_REAL_PROYECTO_AREA;
  AVANCE_REAL_TAREA = MENSAJE_TITULO.AVANCE_REAL_TAREA;
  DIAS_RESTANTES=  MENSAJE_TITULO.DIAS_RESTANTES;
  AVANCE_ESPERADO=  MENSAJE_TITULO.AVANCE_ESPERADO;
  CUMPLIMIENTO=  MENSAJE_TITULO.CUMPLIMIENTO;
  ACCIONES =  MENSAJE_TITULO.ACCIONES;
  RESPONSABLE_ACTIVIDAD_ESTRATEGICA = MENSAJE_TITULO.RESPONSABLE_ACTIVIDAD_ESTRATEGICA;
  RESPONSABLE_GESTION_AREA = MENSAJE_TITULO.RESPONSABLE_GESTION_AREA;
  RESPONSABLE_PROYECTO_AREA = MENSAJE_TITULO.RESPONSABLE_PROYECTO_AREA;
  RESPONSABLE_TAREA = MENSAJE_TITULO.RESPONSABLE_TAREA;
  META = MENSAJE_TITULO.META_KPI;
  RESULTADO_META = MENSAJE_TITULO.RESULTADO_META_KPI;
  PORCENTAJE_META = MENSAJE_TITULO.PROMEDIO_META_KPI;
  ENTREGABLE = MENSAJE_TITULO.ENTREGABLE;
  PORCENTAJE_PAT = MENSAJE_TITULO.PORCENTAJE_PAT;
  PERIODICIDAD = MENSAJE_TITULO.PERIODICIDAD_TAREA;
  ESTADO = MENSAJE_TITULO.ESTADO_TAREA;
  DESCRIPCION = MENSAJE_TITULO.DESCRIPCION_TAREA;
  PRESUPUESTO = MENSAJE_TITULO.PRESUPUESTO_PROYECTO_AREA;
  MODALIDAD = MENSAJE_TITULO.MODALIDAD_PROYECTO_AREA;
  VALOR_EJECUTADO = MENSAJE_TITULO.VALOR_EJECUTADO_PROYECTO_AREA;
  PLANEACION = MENSAJE_TITULO.PLANEACION_PROYECTO_AREA;
  TOTAL_SPRINT = MENSAJE_TITULO.TOTAL_SPRINT_PROYECTO_AREA;

  esAdmin: boolean = false; 
  esDirector: boolean = false; 
  esOperador: boolean = false;
  esOperadorEditor: boolean = false;
  esConsultor: boolean = false;

  tipoFormulario: 'ACTIVIDAD_ESTRATEGICA' | 'ACTIVIDAD_GESTION' | 'TAREA' | 'PROYECTO_AREA' = 'ACTIVIDAD_ESTRATEGICA'; // Por defecto, muestra el formulario para actividad estratégica
  pesoDeArchivo = 300 * 1024 * 1024; // 300 MB
  extencionesPermitidas = /\.(doc|docx|xls|xlsx|ppt|pptx|zip|pdf)$/i;
  nombreArchivoSeleccionado: string = '';
  modalidadEnumList = Object.values(EModalidad);
  planeacionEnumList = Object.values(EPlaneacion);
  archivoSeleccionado: File | null = null;
  documentoObtenido: any [] = [];
  idObservacionProyectoAreaSeleccionado: number = 0;
  idObservacionActividadGestionSeleccionado: number = 0;
  idObservacionActividadEstrategicaSeleccionado: number = 0;
  idObservacionTareaSeleccionado: number = 0;
  usuarioPat:number | 0 = 0;
  porcentajeRealPat:number = 0;
  porcentajeRealActividadesEstrategica:number = 0;
  porcentajeEsperadoActividadesEstrategica:number = 0;
  porcentajeCumplimientoActividadesEstrategica:number = 0;
  porcentajePATActividadesEstrategica:number = 0;
  porcentajeRealActividadesGestion:number = 0;
  porcentajeEsperadoActividadesGestion:number = 0;
  porcentajeCumplimientoActividadesGestion:number = 0;
  porcentajeRealActividadesYProyectos:number = 0;
  porcentajeEsperadoActividadesYProyectos:number = 0;
  porcentajeCumplimientoActividadesYProyectos:number = 0;
  porcentajeRealProyectosArea:number = 0;
  porcentajeEsperadoProyectosArea:number = 0;
  porcentajeCumplimientoProyectosArea:number = 0;
  nombrePat:string | undefined = '';
  fechaAnualPat:number | undefined;
  idPat:number = 0;
  idUsuarioSeleccionado: any | 0 = 0;
  idActividadGestionSeleccionado: number | 0 = 0;
  idActividadEstrategicaSeleccionado: number | 0 = 0;
  idDocumentoActividadEstrategicaSeleccionado: number | 0 = 0;
  idDocumentoActividadGestionSeleccionado: number | 0 = 0;
  idDocumentoProyectoAreaSeleccionado: number | 0 = 0;
  idDocumentoTareaSeleccionado: number | 0 = 0;
  idProyectoSeleccionado: number | 0 = 0;
  planeacionProyecto = EPlaneacion;
  idTareaSeleccionado: number | 0 = 0;
  idTareaTipo: number | 0 = 0;
  nombreTarea: string | undefined = '';
  estadoTarea: string | undefined = '';
  porcentajeTarea: number | 0 = 0;
  periodicidadTarea: string | undefined = '';
  descripcionTarea: string | undefined = '';
  estadoEnumList: string[] = [];
  periodiciadLista: string[] = [];
  periodiciadMetaLista: string[] = [];
  collapseSeleccionado : number | null = null;
  gestiones: ActividadGestion[] = [];
  proyectosarea: ProyectoArea[] = [];
  actividades: ActividadEstrategica[] = [];
  pats: Pat[] = [];
  usuarios: Usuario[] = [];
  tareas:Tarea[] =[];
  observaciones:any[] =[];
  formGestion:FormGroup;
  formEstrategica:FormGroup;
  formModificarEstadoTarea:FormGroup;
  formModificarPorcentaje:FormGroup;
  formModificarTarea:FormGroup
  formTarea:FormGroup;
  formObservacion:FormGroup;
  formAgregarEntregable:FormGroup;
  formAgregarResultadoMeta:FormGroup;
  formProyecto:FormGroup;
  formModificarValorEjecutado:FormGroup;
  formModificarObservacion:FormGroup;

  constructor(
    private gestionService: TipoGEService,private auth: AuthService,
    private patService: PatService,private route: ActivatedRoute,
    private usuarioService :UsuarioService,private formBuilder: FormBuilder,
    private tareaService:TareaService,  
  ) 
  
  { this.formEstrategica = this.formBuilder.group({
      nombre: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      unidad: ['', Validators.required],
      periodicidadMeta: ['', Validators.required],
      meta: ['', Validators.required],
      entregable:['', Validators.required],
      idUsuario:['',Validators.required]
    });
    this.formGestion = this.formBuilder.group({
      nombre: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      idUsuario:['',Validators.required]
    });
    this.formProyecto = this.formBuilder.group({
      nombre:['',Validators.required],
      presupuesto: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      modalidad: ['', Validators.required],
      planeacionSprint:['', Validators.required],
      idUsuario:['', Validators.required],
    });
    this.formModificarEstadoTarea = this.formBuilder.group({
      estado: ['', Validators.required],
    });
    this.formModificarPorcentaje = this.formBuilder.group({
      porcentajeReal: ['', Validators.required],
    });
    this.formModificarValorEjecutado = this.formBuilder.group({
      valorEjecutado: ['', Validators.required],
    });
    this.formObservacion = this.formBuilder.group({
      id: ['', Validators.required],
      fecha: [this.obtenerFechaActual(), Validators.required],
      descripcion: ['', Validators.required],
    });
    this.formAgregarEntregable = this.formBuilder.group({
      entregable: ['', Validators.required],
    });
    this.formAgregarResultadoMeta = this.formBuilder.group({
      meta: ['', Validators.required],
      resultadoMeta: ['', Validators.required],
    });
    this.formModificarTarea = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      periodicidad: ['', Validators.required],
      idUsuario: ['', Validators.required],
    });
    this.formTarea = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      periodicidad: ['', Validators.required],
      idUsuario: ['', Validators.required],
    });
    this.formModificarObservacion = this.formBuilder.group({
      descripcion: ['', Validators.required],
    }); 
  }
  

  ngOnInit() {

    // Usar Promise.all para esperar a que todas las promesas se resuelvan
    Promise.all([
      this.auth.esAdmin(),
      this.auth.esDirector(),
      this.auth.esOperador(),
      this.auth.esOperadorEditor(),
      this.auth.esConsultor()
    ]).then(([esAdmin, esDirector, esOperador,esOperadorEditor, esConsultor]) => {
      // Asignar los resultados a las propiedades correspondientes
      this.esAdmin = esAdmin;
      this.esDirector = esDirector;
      this.esOperador = esOperador;
      this.esOperadorEditor = esOperadorEditor;
      this.esConsultor = esConsultor;
    });
        // Obtén el valor de idPat de la URL
    this.route.params.subscribe(params => {
      const idPat = params['idPat'];
      this.patService.listarPatPorId(idPat,this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.nombrePat = data.nombre;
          this.idPat = data.idPat; // Asignar el nombre del Pat a patNombre
          this.porcentajeRealPat = data.porcentajeReal;
          this.fechaAnualPat = data.fechaAnual;
          this.usuarioPat = data.idUsuario;
        }
      );
      this.cargarGestiones(idPat);
      this.cargarActividadesEstrategicas(idPat);
      this.cargarProyectosArea(idPat);
      this.cargarUsuario();
    });

    this.crearTarea();

    this.estadoEnumList = Object.values(EEstado);
    this.periodiciadLista = Object.values(EPeriodicidad);
    this.periodiciadMetaLista = Object.values(EPeriodicidadMeta);
    this.porcentajeRealActividadesYProyectos += (this.porcentajeRealActividadesGestion + this.porcentajeRealProyectosArea) / 2;
    this.porcentajeEsperadoActividadesYProyectos += (this.porcentajeEsperadoActividadesGestion + this.porcentajeEsperadoProyectosArea) / 2;
    this.porcentajeCumplimientoActividadesYProyectos += (this.porcentajeCumplimientoActividadesGestion + this.porcentajeCumplimientoProyectosArea) / 2;
  }
  siguienteRuta(idActividadEstrategica: number, nombrePat : string){
    return ['/panel', { outlets: { 'OutletAdmin': ['listarActividad', idActividadEstrategica,'pat', nombrePat] } }];
  }

  cargarUsuario() {
    this.usuarioService.listarUsuario(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.usuarios = data.sort((a:any, b:any) => a.nombre.localeCompare(b.nombre));
    });
  }
  cargarActividadesEstrategicas(idPat: number) {
    // Utiliza idPat en tu solicitud para cargar las epicas relacionadas
    this.gestionService
      .listarActividadEstrategicaPorIdPat(idPat, this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.actividades = data;
          this.porcentajeRealActividadesEstrategica += this.actividades.reduce((total, actividad) => total + actividad.porcentajeReal, 0) / this.actividades.length;
          this.porcentajeEsperadoActividadesEstrategica += this.actividades.reduce((total, actividad) => total + actividad.porcentajeEsperado, 0) / this.actividades.length ;
          this.porcentajeCumplimientoActividadesEstrategica += this.actividades.reduce((total, actividad) => total + actividad.porcentajeCumplimiento, 0) / this.actividades.length;        
          // Primero, obten la fecha actual
          const fechaActual = new Date();

          // Luego, filtra las actividades basándote en si la fecha inicial es menor a la fecha actual
          const actividadesFiltradas = this.actividades.filter(actividad => new Date(actividad.fechaInicial) < fechaActual);

          // Calcula el promedio solo para las actividades filtradas
          if (actividadesFiltradas.length > 0) {
              this.porcentajePATActividadesEstrategica += actividadesFiltradas.reduce((total, actividad) => total + actividad.porcentajePat, 0) / actividadesFiltradas.length;
            }
        }
      ); 
  }
  cargarProyectosArea(idPat: number) {
    // Utiliza idPat en tu solicitud para cargar las gestiones relacionadas
    this.gestionService
      .listarProyectoAreaPorIdPat(idPat, this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.proyectosarea = data;
          this.porcentajeRealProyectosArea += this.proyectosarea.reduce((total, actividad) => total + actividad.porcentajeReal, 0) / this.proyectosarea.length;
          this.porcentajeEsperadoProyectosArea += this.proyectosarea.reduce((total, actividad) => total + actividad.porcentajeEsperado, 0) / this.proyectosarea.length ;
          this.porcentajeCumplimientoProyectosArea += this.proyectosarea.reduce((total, actividad) => total + actividad.porcentajeCumplimiento, 0) / this.proyectosarea.length;
        });
  }
  cargarGestiones(idPat: number) {
    // Utiliza idPat en tu solicitud para cargar las gestiones relacionadas
    this.gestionService
      .listarGestionPorIdPat(idPat, this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.gestiones = data;
          this.porcentajeRealActividadesGestion += this.gestiones.reduce((total, actividad) => total + actividad.porcentajeReal, 0) / this.gestiones.length;
          this.porcentajeEsperadoActividadesGestion += this.gestiones.reduce((total, actividad) => total + actividad.porcentajeEsperado, 0) / this.gestiones.length;
          this.porcentajeCumplimientoActividadesGestion += this.gestiones.reduce((total, actividad) => total + actividad.porcentajeCumplimiento, 0) / this.gestiones.length;
        });
  }
  cargarObservaciones(id:any,tipo:string) {
    const obtenerObservaciones = (observable: Observable<any>) => {
      observable.subscribe((data: any) => {
        this.observaciones = data;
      });
    };
    
    switch (tipo) {
      case 'TAREA':
        obtenerObservaciones(this.tareaService.listarPorIdTarea(id, this.auth.obtenerHeader()));
        this.tipoFormulario = 'TAREA';
        break;    
      case 'ACTIVIDAD_GESTION':
        obtenerObservaciones(this.gestionService.listarObservacionPorIdActividadGestion(id, this.auth.obtenerHeader()));
        this.tipoFormulario = 'ACTIVIDAD_GESTION';
        break;
      case 'ACTIVIDAD_ESTRATEGICA':
        obtenerObservaciones(this.gestionService.listarObservacionPorIdActividadEstrategica(id, this.auth.obtenerHeader()));
        this.tipoFormulario = 'ACTIVIDAD_ESTRATEGICA';
        break;
      case 'PROYECTO_AREA':
        obtenerObservaciones(this.gestionService.listarObservacionPorIdProyectoArea(id, this.auth.obtenerHeader()));
        this.tipoFormulario = 'PROYECTO_AREA';
        break;
      default:
        // Manejar caso no reconocido o error
        break;
    }
  }
  eliminarObservacion(observacion: any, tipo:string) {
    Swal.fire({
      icon:"question",
      title: "¿Estás seguro?",
      text: "Una vez eliminado la observación, no podrás recuperar este elemento.",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
      confirmButtonColor: '#0E823F',
      reverseButtons: true, 
    })
    .then((confirmacion) => {
      if (confirmacion.isConfirmed) {
        if(tipo === 'TAREA'){
          const idTarea = observacion.idTarea;
          this.tareaService.eliminarObservacionTarea(observacion.idObservacionTarea, this.auth.obtenerHeader()).subscribe(
            () => {
              this.swalSatisfactorio('eliminado','la observación');
              this.cargarObservaciones(idTarea, 'TAREA')
            },
            (error) => {
              this.swalError(error.mensajeHumano);
            }
          );
        } else if( tipo === 'ACTIVIDAD_GESTION'){
          const idActividadGestion = observacion.idActividadGestion;
          this.gestionService
            .eliminarObservacionActividadGestion(observacion.idObservacionActividadGestion,this.auth.obtenerHeader()) .subscribe(
                () => {
                  this.swalSatisfactorio('eliminado','la observación');
                  this.cargarObservaciones(idActividadGestion, 'ACTIVIDAD_GESTION')
                },
                (error) => {
                  this.swalError(error.mensajeHumano);
                }
            );
        } else if (tipo === 'ACTIVIDAD_ESTRATEGICA'){
          const idActividadEstrategica = observacion.idActividadEstrategica;
          this.gestionService
            .eliminarObservacionActividadEstrategica(observacion.idObservacionActividadEstrategica,this.auth.obtenerHeader()) .subscribe(
              () => {
                this.swalSatisfactorio('eliminado','la observación');
                this.cargarObservaciones(idActividadEstrategica, 'ACTIVIDAD_ESTRATEGICA');
              },
              (error) => {
                this.swalError(error.mensajeHumano);
              }
          );
        } else if (tipo === 'PROYECTO_AREA'){
          const idProyectoArea = observacion.idProyectoArea;
          this.gestionService
            .eliminarObservacionProyectoArea(observacion.idObservacionProyectoArea,this.auth.obtenerHeader()) .subscribe(
              () => {
                this.swalSatisfactorio('eliminado','la observación');
                this.cargarObservaciones(idProyectoArea, 'PROYECTO_AREA')
              },
              (error) => {
                this.swalError(error.mensajeHumano);
              }
          );
        }
        
      }
    });
  } 
  eliminarGestion(idActividadGestion: number) {
    Swal.fire({
      icon:"question",
      title: "¿Estás seguro?",
      text: "Una vez eliminada la actividad de gestión, no podrás recuperar este elemento.",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
      confirmButtonColor: '#0E823F',
      reverseButtons: true, 
    })
    .then((confirmacion) => {
      if (confirmacion.isConfirmed) {
        this.gestionService.eliminarGestion(idActividadGestion, this.auth.obtenerHeader()).subscribe(
          () => {
            this.swalSatisfactorio('eliminado','actividad del área')
              this.cargarGestiones(this.idPat)
          },
          (error) => {this.swalError(error);}
        );
      }
    });
  }
  eliminarActividadesEstrategica(idActividadEstrategica: number) {
    Swal.fire({
      icon:"question",
      title: "¿Estás seguro?",
      text: "Una vez eliminado la actividad estratégica, NO podrás recuperarlo.",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
      confirmButtonColor: '#0E823F',
      reverseButtons: true, 
    })
    .then((confirmacion) => {
      if (confirmacion.isConfirmed) {
        this.gestionService.eliminarActividadEstrategica(idActividadEstrategica, this.auth.obtenerHeader()).subscribe(
          () => {
              this.swalSatisfactorio('eliminado','actividad estratégica')
              this.cargarActividadesEstrategicas(this.idPat)
          },
          (error) => {this.swalError(error);}
        );
      }
    });
  }
  eliminarProyectoArea(idProyectoArea: number) {
    Swal.fire({
      icon:"question",
      title: "¿Estás seguro?",
      text: "Una vez eliminado el proyecto del área, NO podrás recuperarlo.",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
      confirmButtonColor: '#0E823F',
      reverseButtons: true, 
    })
    .then((confirmacion) => {
      if (confirmacion.isConfirmed) {
        this.gestionService.eliminarProyectoArea(idProyectoArea, this.auth.obtenerHeader()).subscribe(
          () => {
              this.swalSatisfactorio('eliminado','proyecto del área')
              this.cargarProyectosArea(this.idPat)
          },
          (error) => {this.swalError(error);}
        );
      }
    });
  }

  modificarActividadGestion() {
    if (this.formGestion.valid && this.idActividadGestionSeleccionado) {
      const nombre = this.formGestion.get('nombre')?.value;
      const fechaInicial = this.formGestion.get('fechaInicial')?.value;
      const fechaFinal = this.formGestion.get('fechaFinal')?.value;
      const idUsuario = this.formGestion.get('idUsuario')?.value;
      const idPat = this.idPat
      const actividadGestion = {
        nombre: nombre,
        fechaInicial: fechaInicial,
        fechaFinal: fechaFinal,
        idUsuario :idUsuario,
        idPat : idPat
      };
      Swal.fire({
        title: "¿Estás seguro de modificar?",
        icon: "question",
        text: "Una vez modificado no podrás revertir los cambios",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true, 
      }).then((confirmacion) => {
        if (confirmacion.isConfirmed) {
          this.gestionService
        .modificarActividadGestión(actividadGestion, this.idActividadGestionSeleccionado, this.auth.obtenerHeader())
        .subscribe(
          (response) => {
            this.swalSatisfactorio('modificado','actividad del área')
              this.cargarGestiones(this.idPat)
          },
          (error) => {this.swalError(error);}
        );
        }
      }) 
    }
  }
  modificarActividadEstrategica() {
    if (this.formEstrategica.valid) {
      const nombre = this.formEstrategica.get('nombre')?.value;
      const fechaInicial = this.formEstrategica.get('fechaInicial')?.value;
      const fechaFinal = this.formEstrategica.get('fechaFinal')?.value;
      const meta = this.formEstrategica.get('meta')?.value;
      const entregable = this.formEstrategica.get('entregable')?.value;
      const unidad = this.formEstrategica.get('unidad')?.value;
      const periodicidadMeta = this.formEstrategica.get('periodicidadMeta')?.value;
      const idUsuario = this.formEstrategica.get('idUsuario')?.value;
      const idPat = this.idPat
      const actividadEstrategica = {
        nombre: nombre,
        fechaInicial: fechaInicial,
        fechaFinal: fechaFinal,
        meta:meta,
        entregable:entregable,
        periodicidadMeta:periodicidadMeta,
        unidad:unidad,
        idUsuario :idUsuario,
        idPat : idPat
      };
      
      Swal.fire({
        title: "¿Estás seguro de modificar?",
        icon:"question",
        text: "Una vez modificado no podrás revertir los cambios",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true, 
      }).then((confirmacion) => {
        if (confirmacion.isConfirmed) {
          if (this.idActividadEstrategicaSeleccionado != null) {
          this.gestionService.modificarActividadEstrategica(actividadEstrategica, this.idActividadEstrategicaSeleccionado, this.auth.obtenerHeader())
          .subscribe(
            () => {
                this.swalSatisfactorio('modificado','actividad estratégica');
                this.cargarActividadesEstrategicas(this.idPat);
            },
            (error) => {this.swalError(error);}
            );
            }
          }
        }) 
    }
  }
  modificarProyecto() {
    if (this.formProyecto.valid) {
      const nombre = this.formProyecto.get('nombre')?.value;
      const presupuesto = this.formProyecto.get('presupuesto')?.value;
      const fechaInicial = this.formProyecto.get('fechaInicial')?.value;
      const fechaFinal = this.formProyecto.get('fechaFinal')?.value;
      const modalidad = this.formProyecto.get('modalidad')?.value;
      const planeacionSprint = this.formProyecto.get('planeacionSprint')?.value;
      const idUsuario = this.formProyecto.get('idUsuario')?.value;
      const idPat = this.idPat;

      const proyecto = {
        nombre:nombre,
        presupuesto:presupuesto,
        fechaInicial: fechaInicial,
        fechaFinal: fechaFinal,
        modalidad:modalidad,
        planeacionSprint: planeacionSprint,
        idUsuario : idUsuario,
        idActividadEstrategica : idPat
      };

      Swal.fire({
        title: "¿Estás seguro de modificar?",
        icon:"question",
        text: "Una vez modificado no podrás revertir los cambios",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true, 
      }).then((confirmacion) => {
        if (confirmacion.isConfirmed) {
        this.gestionService
          .modificarProyectoArea(proyecto, this.idProyectoSeleccionado, this.auth.obtenerHeader())
          .subscribe(
            (response) => {
              this.swalSatisfactorio('modificado','proyecto')
                this.cargarProyectosArea(idPat)
            },
            (error) => {this.swalError(error);}
          );
        }
      })
    }
  }
  modificarValorEjecutado() {
    if (this.formModificarValorEjecutado.valid) {
     const valorEjecutado = this.formModificarValorEjecutado.get('valorEjecutado')?.value;
     const proyectoValorEjecutado = {
       valorEjecutado: valorEjecutado,
     };
     console.log(proyectoValorEjecutado)
     Swal.fire({
       title: "¿Deseas modificarlo?",
       icon: "question",
       showCancelButton: true,
       cancelButtonText: "Cancelar",
       confirmButtonText: "Confirmar",
       confirmButtonColor: '#0E823F',
       reverseButtons: true, 
     })
     .then((confirmacion) => {
       if (confirmacion.isConfirmed) {
         this.gestionService.modificarValorEjecutado(proyectoValorEjecutado, this.idProyectoSeleccionado,this.auth.obtenerHeader()).subscribe(
             (response) => {
               this.swalSatisfactorio('modificado','valor ejecutado')
                 this.cargarProyectosArea(this.idPat);
                 this.formModificarValorEjecutado.reset();              
             },
             (error) => {this.swalError(error);}
           );
       } 
     });
   }
 }
 cargarTareas(idASE: any, tipoASE: any) {
    // Si se hace clic en la misma gestión, la cerramos
    if (this.collapseSeleccionado === idASE) {
    this.collapseSeleccionado = null;
    } else {
      this.collapseSeleccionado = idASE;
      if(tipoASE === 'ACTIVIDAD_GESTION'){
        this.tareaService
        .listarTareaPorActvidadGestion(idASE,this.auth.obtenerHeader()) 
          .toPromise()
          .then(
            (data: any) => {
              this.tareas = data;
              this.nombreTarea = data.descripcion;
            },
            (error) => {
              Swal.fire('Error', error.error.mensajeTecnico, 'error');
            }
          );
      }
    }
  }

  crearTarea() {
    if (this.formTarea.valid) {
      const nombre = this.formTarea.get('nombre')?.value;
      const descripcion = this.formTarea.get('descripcion')?.value;
      const periodicidad = this.formTarea.get('periodicidad')?.value;
      const idUsuario = this.formTarea.get('idUsuario')?.value;
      
      const tarea = {
        nombre: nombre,
        descripcion: descripcion,
        estado: EEstado.EN_BACKLOG,
        periodicidad: periodicidad,
        tipoASE: 'ACTIVIDAD_GESTION',
        idASE: this.idActividadGestionSeleccionado,
        idUsuario: idUsuario,
      };
      this.tareaService
        .crearTarea(tarea,this.auth.obtenerHeader())
        .subscribe(
          (response) => {
              this.swalSatisfactorio('creado','tarea')
              this.cargarTareas(this.idActividadGestionSeleccionado,'ACTIVIDAD_GESTION')
              this.formTarea.reset()
          },
          (error) => {this.swalError(error);}
        );
    } else {
      return this.formTarea.markAllAsTouched();
    }
  }
  crearObservacion() {

    if (this.formObservacion.valid) {
      const fecha = this.formObservacion.get('fecha')?.value;
      const descripcion = this.formObservacion.get('descripcion')?.value;

      if(this.tipoFormulario === 'TAREA'){
        const observacion = {
          idTarea: this.idTareaSeleccionado,
          descripcion: descripcion,
          fecha: fecha,
        };

        this.tareaService
          .crearObservacion(observacion,this.auth.obtenerHeader())
          .subscribe(
            (response) => {
                this.swalSatisfactorio('creado','observación')
                this.formObservacion.reset()
            },
            (error) => {this.swalError(error);}
          );
      } else if( this.tipoFormulario === 'ACTIVIDAD_GESTION'){
        const observacion = {
          idActividadGestion: this.idActividadGestionSeleccionado,
          descripcion: descripcion,
          fecha: fecha,
        };
        this.gestionService
          .crearObservacionActividadGestion(observacion,this.auth.obtenerHeader())
          .subscribe(
            (response) => {
                this.swalSatisfactorio('creado','observación')
                this.formObservacion.reset()
            },
            (error) => {this.swalError(error);}
          );
      } else if (this.tipoFormulario === 'ACTIVIDAD_ESTRATEGICA'){
        const observacion = {
          idActividadEstrategica: this.idActividadEstrategicaSeleccionado,
          descripcion: descripcion,
          fecha: fecha,
        };
        this.gestionService
          .crearObservacionActividadEstrategica(observacion,this.auth.obtenerHeader())
          .subscribe(
            (response) => {
                this.swalSatisfactorio('creado','observación')
                this.formObservacion.reset()
            },
            (error) => {this.swalError(error);}
          );
        } else if (this.tipoFormulario === 'PROYECTO_AREA') {
          const observacion = {
            idProyectoArea: this.idProyectoSeleccionado,
            descripcion: descripcion,
            fecha: fecha,
          };
          this.gestionService
            .crearObservacionProyectoArea(observacion,this.auth.obtenerHeader())
            .subscribe(
              (response) => {
                  this.swalSatisfactorio('creado','observación')
                  this.formObservacion.reset()
              },
              (error) => {this.swalError(error);}
            );
    
        } 
    } else {
      return this.formObservacion.markAllAsTouched();
    }    
  }
  modificarObservacion(tipo: string) {
    if (this.formModificarObservacion.valid) {
      const descripcion = this.formModificarObservacion.get('descripcion')?.value;
      const observacion = {
        descripcion: descripcion,
      }
      Swal.fire({
        icon: "question",
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
          switch (tipo) {
            case 'TAREA':
              this.tareaService.modificarObservacionTarea(observacion, this.idObservacionTareaSeleccionado, this.auth.obtenerHeader()).subscribe(
                () => {
                  this.swalSatisfactorio('modificado', 'tarea');
                },
                (error) => {
                  this.swalError(error);
                }
              );
              break;
            case 'ACTIVIDAD_ESTRATEGICA':
              this.gestionService.modificarObservacionActividadEstrategica(observacion, this.idObservacionActividadEstrategicaSeleccionado, this.auth.obtenerHeader()).subscribe(
                () => {
                  this.swalSatisfactorio('modificado', 'actividad estratégica');
                },
                (error) => {
                  this.swalError(error);
                }
              );
              break;
            case 'ACTIVIDAD_GESTION':
              this.gestionService.modificarObservacionActividadGestion(observacion, this.idObservacionActividadGestionSeleccionado, this.auth.obtenerHeader()).subscribe(
                () => {
                  this.swalSatisfactorio('modificado', 'actividad de gestión');
                },
                (error) => {
                  this.swalError(error);
                }
              );
              break;
            case 'PROYECTO_AREA':
              this.gestionService.modificarObservacionProyectoArea(observacion, this.idObservacionProyectoAreaSeleccionado, this.auth.obtenerHeader()).subscribe(
                () => {
                  this.swalSatisfactorio('modificado', 'proyecto de área');
                },
                (error) => {
                  this.swalError(error);
                }
              );
              break;
          }
        }
      });
    }
  }
  
  agregarResultadoMeta() {
    if (this.formAgregarResultadoMeta.valid) {
      const resultadoMeta = this.formAgregarResultadoMeta.get('resultadoMeta')?.value;
      const meta = this.formAgregarResultadoMeta.get('meta')?.value;
      const actividad = {
        meta: meta,
        resultadoMeta: resultadoMeta,
      };
      this.gestionService.modificarResultadoMetaActividadEstrategica(actividad, this.idActividadEstrategicaSeleccionado,this.auth.obtenerHeader()).subscribe(
              () => {
                  this.swalSatisfactorio('Agregado!','resultado de la meta')
                  this.cargarActividadesEstrategicas(this.idPat);
                  this.formAgregarEntregable.reset();           
              },
              (error) => {this.swalError(error);}
            );
    }
  }
  modificarEstado() {
    if (this.formModificarEstadoTarea.valid) {
      const estado = this.formModificarEstadoTarea.get('estado')?.value;
      const tareaModificar = {
        estado: estado,
      };
      Swal.fire({
        title: "¿Deseas modificarlo?",
        text: "Una vez modificado no podrás revertir los cambios",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true, 
      })
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
          this.tareaService.modificarEstadoTarea(tareaModificar, this.idTareaSeleccionado,this.auth.obtenerHeader()).subscribe(
              () => {
                  this.swalSatisfactorio('modificado','estado de la tarea')
                  this.cargarTareas(this.idTareaTipo,'ACTIVIDAD_GESTION');
                  this.formModificarEstadoTarea.reset();           
              },
              (error) => {this.swalError(error);}
            );
        } 
      });
    }
  }
  modificarPorcentaje() {
    if(this.periodicidadTarea == "UNICA_VEZ"){
      Swal.fire({
        title:'Solicitud no válida!',
        text: 'La tarea a editar no se puede modificar, porque su periodicidad es única.',
        icon: "warning",
        confirmButtonColor: '#0E823F',
      });
    } else if (this.formModificarPorcentaje.valid) {
      const porcentajeReal = this.formModificarPorcentaje.get('porcentajeReal')?.value;
      const tareaModificar = {
        porcentajeReal: porcentajeReal,
      };
      Swal.fire({
        title: "¿Deseas modificarlo?",
        text: "Una vez modificado no podrás revertir los cambios",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true, 
      })
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
          this.tareaService.modificarPorcentajeTarea(tareaModificar, this.idTareaSeleccionado,this.auth.obtenerHeader()).subscribe(
              () => {
                  this.swalSatisfactorio('modificado','porcentaje de la actividad');
                  this.cargarTareas(this.idTareaTipo,'ACTIVIDAD_GESTION')
                  this.formModificarPorcentaje.reset()              
              },
              (error) => {this.swalError(error);}
            );
        } 
      });
    }
  }
  modificarTarea() {
    if (this.formModificarTarea.valid) {
      const nombre = this.formModificarTarea.get('nombre')?.value;
      const periodicidad = this.formModificarTarea.get('periodicidad')?.value;
      const descripcion = this.formModificarTarea.get('descripcion')?.value;
      const idUsuario = this.formModificarTarea.get('idUsuario')?.value;
      const tareaModificar = {
        nombre: nombre,
        periodicidad: periodicidad,
        descripcion: descripcion,
        idUsuario: idUsuario,
      };
      Swal.fire({
        title: "¿Deseas modificarlo?",
        text: "La gestión del área se ha modificado",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true, 
      })
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
          this.tareaService.modificarTarea(tareaModificar, this.idTareaSeleccionado,this.auth.obtenerHeader()).subscribe(
              () => {
                this.swalSatisfactorio('modificado','tarea')
                  this.cargarTareas(this.idTareaTipo,'ACTIVIDAD_GESTION')
                  this.formModificarEstadoTarea.reset()              
              },
              (error) => {this.swalError(error);}
            );
        } 
      });
    }
  }
  eliminarTarea(idTarea: number,idActividadGestion: number) {
    
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar este elemento.",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true, 
      })
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
        this.tareaService.eliminarTarea(idTarea, this.auth.obtenerHeader()).subscribe(
          (response) => {
            this.swalSatisfactorio('eliminado','tarea')
              this.cargarTareas(idActividadGestion,'ACTIVIDAD_GESTION')
          },
          (error) => {this.swalError(error);}
        );
      }
      }); 
  }
  async documento(event: any, tipo: string): Promise<void> {
    if(tipo === 'ACTIVIDAD_ESTRATEGICA'){
      this.idActividadEstrategicaSeleccionado;
    } else if (tipo === 'ACTIVIDAD_GESTION'){
      this.idActividadGestionSeleccionado ;
    } else if (tipo === 'PROYECTO_AREA'){
      this.idProyectoSeleccionado;
    }
    this.archivoSeleccionado = event.target.files[0];
  
    try {
      await this.validarArchivo();
      // Actualizar el nombre del archivo seleccionado
      this.nombreArchivoSeleccionado = this.archivoSeleccionado ? this.archivoSeleccionado.name : '';
      // Resto del código si la validación es exitosa
    } catch (error) {
      this.archivoSeleccionado = null;
      this.nombreArchivoSeleccionado = '';
    }
  }
  abrirModalAgregarDocumento(idRecibido: number,tipo:string): void {
    if(tipo === 'ACTIVIDAD_ESTRATEGICA'){
      this.idActividadEstrategicaSeleccionado = idRecibido;
    } else if (tipo === 'ACTIVIDAD_GESTION'){
      this.idActividadGestionSeleccionado = idRecibido;
    } else if (tipo === 'PROYECTO_AREA'){
      this.idProyectoSeleccionado = idRecibido;
    }
  }
  async subirDocumento(formulario: any, id: number, tipo: string) {
    try {
        if (!this.archivoSeleccionado) {
            throw new Error('No se ha seleccionado ningún archivo.');
        }

        const app = initializeApp(environment.firebase);
        const storage = getStorage(app);
        const storageRef = ref(storage, `${tipo}/${id}/${this.archivoSeleccionado.name}`);
        const snapshot = await uploadBytes(storageRef, this.archivoSeleccionado);
        const downloadURL = await getDownloadURL(storageRef);

        const documento = {
            fecha: this.obtenerFechaActual(),
            rutaDocumento: downloadURL,
        };

        let guardarDocumentoObservable;

        switch (tipo) {
            case 'actividadGestion':
                guardarDocumentoObservable = this.gestionService.guardarDocumento(documento, this.idActividadGestionSeleccionado, this.auth.obtenerHeaderDocumento());
                break;
            case 'actividadEstrategica':
                guardarDocumentoObservable = this.gestionService.guardarDocumentoAcividadEstrategica(documento, this.idActividadEstrategicaSeleccionado, this.auth.obtenerHeaderDocumento());
                break;
            case 'proyectoArea':
                guardarDocumentoObservable = this.gestionService.guardarDocumentoProyectoArea(documento, this.idProyectoSeleccionado, this.auth.obtenerHeaderDocumento());
                break;
            default:
                throw new Error(`Tipo de documento no válido: ${tipo}`);
        }

        guardarDocumentoObservable.subscribe(
            () => {
                this.mostrarMensaje('Archivo cargado correctamente', 'success');
                this.archivoSeleccionado = null; // Limpiar el archivo seleccionado
                this.nombreArchivoSeleccionado = ''; // Limpiar el nombre del archivo seleccionado
                // Restablecer otros estados relevantes si es necesario
            },
            error => this.mostrarMensaje('Hubo un error: ' + error.error.mensajeTecnico, 'error')
        );

    } catch (error) {
        this.mostrarMensaje('Hubo un error durante al cargar el archivo', 'error');
    }
  }
  async modificarDocumento(formulario: any, id: number, tipo: string) {
    try {
        if (!this.archivoSeleccionado) {
            throw new Error('No se ha seleccionado ningún archivo.');
        }

        const app = initializeApp(environment.firebase);
        const storage = getStorage(app);
        const storageRef = ref(storage, `${tipo}/${id}/${this.archivoSeleccionado.name}`);
        const snapshot = await uploadBytes(storageRef, this.archivoSeleccionado);
        const downloadURL = await getDownloadURL(storageRef);

        const documento = {
            fecha: this.obtenerFechaActual(),
            rutaDocumento: downloadURL,
        };

        let guardarDocumentoObservable;

        switch (tipo) {
            case 'actividadGestion':
                guardarDocumentoObservable = this.gestionService.guardarDocumento(documento, this.idActividadGestionSeleccionado, this.auth.obtenerHeaderDocumento());
                break;
            case 'actividadEstrategica':
                guardarDocumentoObservable = this.gestionService.modificarDocumentoActividadEstrategica(documento, this.idDocumentoActividadEstrategicaSeleccionado, this.auth.obtenerHeaderDocumento());
                break;
            case 'proyectoArea':
                guardarDocumentoObservable = this.gestionService.guardarDocumentoProyectoArea(documento, this.idProyectoSeleccionado, this.auth.obtenerHeaderDocumento());
                break;
            case 'tarea':
                guardarDocumentoObservable = this.tareaService.guardarDocumentoTarea(documento, this.idTareaSeleccionado, this.auth.obtenerHeaderDocumento());
                break;
            default:
                throw new Error(`Tipo de documento no válido: ${tipo}`);
        }

        guardarDocumentoObservable.subscribe(
            () => {
                this.mostrarMensaje('Archivo cargado correctamente', 'success');
                this.archivoSeleccionado = null; // Limpiar el archivo seleccionado
                this.nombreArchivoSeleccionado = ''; // Limpiar el nombre del archivo seleccionado
                // Restablecer otros estados relevantes si es necesario
            },
            error => this.mostrarMensaje('Hubo un error: ' + error.error.mensajeTecnico, 'error')
        );

    } catch (error) {
        this.mostrarMensaje('Hubo un error durante al cargar el archivo', 'error');
    }
  }


  mostrarMensaje(mensaje: string, tipo: 'success' | 'error') {
      Swal.fire({
          title: tipo === 'success' ? 'Archivo cargado!' : 'Hubo un error!!!',
          text: mensaje,
          icon: tipo,
          confirmButtonColor: '#0E823F',
      });
  }
  verDocumentos(id: number,tipo: string) {
    if(tipo === 'ACTIVIDAD_GESTION'){
      this.gestionService.obtenerDocumento(id, this.auth.obtenerHeaderDocumento()).subscribe(
        (data: any) => {
          this.documentoObtenido = data;
        },
        (error: any) => {
          Swal.fire({
            title: 'La actividad no tiene documentos adjuntos',
            text: 'Cargue un documento para visualizarlo',
            icon: 'info',
            confirmButtonColor: '#0E823F',
          });
        }
      );
    } else if (tipo === 'ACTIVIDAD_ESTRATEGICA') {
      this.gestionService.obtenerDocumentoActividadEstrategica(id, this.auth.obtenerHeaderDocumento()).subscribe(
        (data: any) => {
          this.documentoObtenido = data;
        },
        (error: any) => {
          Swal.fire({
            title: 'La actividad no tiene documentos adjuntos',
            text: 'Cargue un documento para visualizarlo',
            icon: 'info',
            confirmButtonColor: '#0E823F',
          });
        }
      );
    } else if (tipo === 'PROYECTO_AREA') {
      this.gestionService.obtenerDocumentoProyectoArea(id, this.auth.obtenerHeaderDocumento()).subscribe(
        (data: any) => {
          this.documentoObtenido = data;
        },
        (error: any) => {
          Swal.fire({
            title: 'La actividad no tiene documentos adjuntos',
            text: 'Cargue un documento para visualizarlo',
            icon: 'info',
            confirmButtonColor: '#0E823F',
          });
        }
      );
    }
  }
  
  extraerNombreArchivo(rutaArchivo: string): string {
    // Decodificar la URL para manejar códigos de escape
    const nombreArchivoDecodificado = decodeURIComponent(rutaArchivo);
  
    // Buscar la posición de la última '/'
    const posicionUltimaBarra = nombreArchivoDecodificado.lastIndexOf('/');
  
    // Buscar la posición del primer '?' después de la extensión
    const posicionInterrogante = nombreArchivoDecodificado.indexOf('?', posicionUltimaBarra);
  
    // Verificar si se encontró la posición adecuada
    if (posicionUltimaBarra !== -1 && posicionInterrogante !== -1) {
      // Extraer el nombre del archivo
      const nombreArchivo = nombreArchivoDecodificado.substring(posicionUltimaBarra + 1, posicionInterrogante);
      return nombreArchivo;
    } else {
      console.error('No se pudo determinar el nombre del archivo desde la URL:', rutaArchivo);
      return '';
    }
  }
  

  obtenerActividadGestion(idActividadGestion: number,actividadGestion:any) {
    this.tipoFormulario = 'ACTIVIDAD_GESTION';
    this.idActividadGestionSeleccionado = idActividadGestion;

    this.formGestion.patchValue({
      nombre: actividadGestion.nombre,
      fechaInicial: actividadGestion.fechaInicial,
      fechaFinal: actividadGestion.fechaFinal,
      idUsuario: actividadGestion.idUsuario,
    });
    this.formObservacion.patchValue({
      id: idActividadGestion,
      fecha: this.obtenerFechaActual(),
    });
  }
  obtenerDocumento(documento:any, tipo:string){
    switch (tipo) {
      case 'ACTIVIDAD_GESTION':
        this.idDocumentoActividadGestionSeleccionado = documento.idDocumentoActividadGestion;
          break;
      case 'ACTIVIDAD_ESTRATEGICA':
        this.idDocumentoActividadEstrategicaSeleccionado = documento.idDocumentoActividadEstrategica;
          break;
      case 'PROYECTO_AREA':
        this.idDocumentoProyectoAreaSeleccionado = documento.idDocumentoProyectoArea;
          break;
      case 'TAREA':
        this.idDocumentoTareaSeleccionado = documento.idDocumentoTarea;
          break;
      default:
          throw new Error(`No se obtuvo el documento: ${tipo}`);
    }
  this.nombreArchivoSeleccionado =  documento.rutaDocumento;

  }
  obtenerTarea(idTarea: number,tarea:any) {
    this.idTareaSeleccionado = idTarea;
    this.nombreTarea = tarea.nombre;
    this.idTareaTipo = tarea.idASE;
    this.periodicidadTarea = tarea.periodicidad;
    this.tipoFormulario = 'TAREA';

    this.formModificarEstadoTarea.patchValue({
      estado: tarea.estado,
    });
    this.formModificarPorcentaje.patchValue({
      porcentajeReal: tarea.porcentajeReal,
    });

    this.formObservacion.patchValue({
      id: idTarea,
      fecha: this.obtenerFechaActual(),
    });
  }
  obtenerTareaAModificar(idTarea: number,tarea:any) {
    this.idTareaSeleccionado = idTarea;
    this.nombreTarea = tarea.nombre;
    this.idTareaTipo = tarea.idASE;

    this.formModificarTarea.patchValue({
      nombre : tarea.nombre,
      descripcion : tarea.descripcion,
      periodicidad : tarea.periodicidad,
      idUsuario : tarea.idUsuario,
    });
  }
  obtenerActividadEstrategica(idActividadEstrategica: number,actividadEstrategica:any) {
    this.tipoFormulario = 'ACTIVIDAD_ESTRATEGICA'; 
    this.idActividadEstrategicaSeleccionado = idActividadEstrategica;

    this.formEstrategica.patchValue({
      nombre: actividadEstrategica.nombre,
      fechaInicial: actividadEstrategica.fechaInicial,
      fechaFinal: actividadEstrategica.fechaFinal,
      meta: actividadEstrategica.meta,
      entregable:actividadEstrategica.entregable,
      periodicidadMeta : actividadEstrategica.periodicidadMeta,
      unidad: actividadEstrategica.unidad,
      idUsuario: actividadEstrategica.idUsuario,
    });
    this.formObservacion.patchValue({
      id: idActividadEstrategica,
      fecha: this.obtenerFechaActual(),
    });
    this.formAgregarEntregable.patchValue({
      entregable: actividadEstrategica.entregable,
    });
    this.formAgregarResultadoMeta.patchValue({
      meta: actividadEstrategica.meta,
      resultadoMeta: actividadEstrategica.resultadoMeta,
    });
  }


  obtenerProyectoArea(idProyectoArea: number,proyectoArea:any) {
    this.tipoFormulario = 'PROYECTO_AREA'; 
    this.idProyectoSeleccionado = idProyectoArea;

    this.formProyecto.patchValue({
      nombre: proyectoArea.nombre,
      presupuesto: proyectoArea.presupuesto,
      fechaInicial: proyectoArea.fechaInicial,
      fechaFinal: proyectoArea.fechaFinal,
      modalidad: proyectoArea.modalidad,
      planeacionSprint: proyectoArea.planeacionSprint,
      idUsuario:proyectoArea.idUsuario
    });
    this.formModificarValorEjecutado.patchValue({
      valorEjecutado:  proyectoArea.valorEjecutado,
    });
    this.formObservacion.patchValue({
      id: idProyectoArea,
      fecha: this.obtenerFechaActual(),
    });
  }

    obtenerObservacion(tipo : string,observacion:any) {
    
      switch (tipo) {
        case 'TAREA':
          this.tipoFormulario = 'TAREA';
          this.idObservacionTareaSeleccionado = observacion.idObservacionTarea;
          this.formModificarObservacion.patchValue({
            descripcion: observacion.descripcion,
          });
          break;
        case 'ACTIVIDAD_ESTRATEGICA':
          this.tipoFormulario = 'ACTIVIDAD_ESTRATEGICA'; 
          this.idObservacionActividadEstrategicaSeleccionado = observacion.idObservacionActividadEstrategica;
          this.formModificarObservacion.patchValue({
            descripcion: observacion.descripcion,
          });
          break;
        case 'ACTIVIDAD_GESTION':
          this.tipoFormulario = 'ACTIVIDAD_GESTION';
          this.idObservacionActividadGestionSeleccionado = observacion.idObservacionActividadGestion;
          this.formModificarObservacion.patchValue({
            descripcion: observacion.descripcion,
          });
          break;
        case 'PROYECTO_AREA':
          this.tipoFormulario = 'PROYECTO_AREA';
          this.idObservacionProyectoAreaSeleccionado = observacion.idObservacionProyectoArea;
          this.formModificarObservacion.patchValue({
            descripcion: observacion.descripcion,
          });
          break;
      }
  }  

  obtenerNombreUsuario(idUsuario: number) {
    const usuario = this.usuarios.find((u) => u.idUsuario === idUsuario);
    return usuario ? usuario.nombre + " " + usuario.apellidos : '';
  }
  colorPorcentaje(porcentaje: number): string {
    if (porcentaje < 30 ) {
      return 'porcentaje-bajo'; // Define las clases CSS para porcentajes bajos en tu archivo de estilos.
    } else if (porcentaje >= 30 && porcentaje < 100){
      return 'porcentaje-medio'; // Define las clases CSS para porcentajes normales en tu archivo de estilos.
    } else if (porcentaje >= 100 ){
      return 'porcentaje-cien';
    } else{
      return '';
    }
  }
  colorPorcentajeDependiendoFechaInicial(porcentaje: number, fechaInicial: Date): string {
    const fechaActual = new Date();
    const fechaInicioActividad = new Date(fechaInicial);
    if (fechaInicioActividad  > fechaActual) {
      return 'porcentaje-negro'; // Define las clases CSS para cuando la fecha es posterior a la fecha actual.
    } else {
      if (porcentaje < 80 ) {
        return 'porcentaje-bajo'; // Define las clases CSS para porcentajes bajos en tu archivo de estilos.
      } else if (porcentaje >= 80 && porcentaje < 100) {
        return 'porcentaje-medio'; // Define las clases CSS para porcentajes normales en tu archivo de estilos.
      } else {
        return 'porcentaje-cien';
      }
    }
  }
  colorDias(diasRestantes: number): string {
    if (diasRestantes < 10) {
      return 'porcentaje-bajo'; // Define las clases CSS para porcentajes bajos en tu archivo de estilos.
    } else {
      return 'porcentaje-normal';
    }
  }
  signoParaMeta(unidad: string, meta: number): string {
    if (unidad === 'PORCENTAJE') {
      return meta + '%'; // Formatea el número a dos decimales y agrega el símbolo de porcentaje
    } else if (unidad === 'PESOS') {
      return '$' + meta.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return meta.toString(); // Si la unidad no es PORCENTAJE ni PESOS, simplemente devuelve el número como una cadena
    }
  }
  
  isEstado(tareaEstado:any, estado:any) {
    return tareaEstado === estado;
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
        text:error.error.mensajeTecnico, 
        icon:"error",
        confirmButtonColor: '#0E823F',
      }
    );
  } 
  get nombreVacio(){
    return this.formTarea.get('nombre')?.invalid && this.formTarea.get('nombre')?.touched;
  }
  get descripcionVacio(){
    return this.formTarea.get('descripcion')?.invalid && this.formTarea.get('descripcion')?.touched;
  }
  get periodicidadVacio(){
    return this.formTarea.get('periodicidad')?.invalid && this.formTarea.get('periodicidad')?.touched;
  }
  get idUsuarioVacio(){
    return this.formTarea.get('idUsuario')?.invalid && this.formTarea.get('idUsuario')?.touched;
  }
  get descripcionObservacionVacio(){
    return (this.formObservacion.get('descripcion')?.invalid && this.formObservacion.get('descripcion')?.touched);
  }
  get fechaVacio(){
    return this.formObservacion.get('fecha')?.invalid && this.formObservacion.get('fecha')?.touched;
  }

  private validarArchivo(): boolean {
    if (!this.archivoSeleccionado) {
      // Puedes mostrar un mensaje de error o manejarlo de otra manera
      return false;
    }
    const fileSize = this.archivoSeleccionado.size;
    const fileName = this.archivoSeleccionado.name;

    if (fileSize > this.pesoDeArchivo) {
      alert('El archivo supera el límite de tamaño permitido (300MB).');
      return false;
    } else if (!this.extencionesPermitidas.test(fileName)) {
      alert('Formato de archivo no permitido. Por favor, elija un archivo con una de las siguientes extensiones: .doc, .docx, .xls, .xlsx, .ppt, .pptx, .zip');
      return false;
    }
    return true;
  }

  private obtenerFechaActual(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

}
