import { Component, OnInit } from '@angular/core';
import { PatService } from '../services/pat.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoGEService } from 'src/app/gestion/services/tipoGE.service';
import { ActividadService } from 'src/app/actividad/services/actividad.service';
import { NgbModal, NgbModalRef  } from '@ng-bootstrap/ng-bootstrap';
import { ProcesoService } from 'src/app/proceso/services/proceso.service';

@Component({
  selector: 'app-root',
  templateUrl: './pat.listar.component.html',
  styleUrls: ['./pat.listar.component.scss']
})
export class PatListarComponent implements OnInit{
  private modalRef: NgbModalRef | undefined;
  title = 'listarPat';

  pats: any[] = [];
  usuarios:any[] =[];
  direccion:any;
  busqueda: any;
  selectedPatId: number | null = null;
  nombrePatSeleccionado:any;
  fechaAnualSeleccionada:any;
  procesoSeleccionado:any;
  usuario:any;
  actividadesFiltradas:any;
  proyectosFiltrados:any;
  actividadesGestionFiltradas:any;
  cantidadPats:any;
  cantidadProyectos:any;
  cantidadGestiones:any;
  cantidadGestionesActividadEstrategica:any;
  cantidadEstrategicas:any;
  sumadorProyectosTerminados=0;
  sumadorProyectosAbiertos=0;
  sumadorActividadGestionTerminados=0;
  sumadorActividadGestionAbiertos=0;
  sumadorActividadEstrategicasTerminados=0;
  sumadorActividadEstrategicasAbiertos=0;
  procesos:any;
  form:FormGroup;
  
    constructor(
      private patService: PatService,private auth:AuthService,
      private usuarioService:UsuarioService, private formBuilder: FormBuilder,
      private tipoService:TipoGEService, private actividadService:ActividadService,
      private procesoService:ProcesoService) 
      {
        this.form = this.formBuilder.group({
          nombre:['', Validators.required],
          fechaAnual: ['', Validators.required],
          proceso: ['', Validators.required],
        }); 
       }  

    ngOnInit() {
      this.cargarPats();
      this.cargarUsuario();
      this.cargarProcesos()
    }
    cargarUsuario() {
      this.usuarioService.listarUsuario(this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.usuarios = data;
      },
        (error) => {
          Swal.fire(error.error.mensajeTecnico);
        }
      );
    }

    cargarProcesos() {
      this.procesoService.listar(this.auth.obtenerHeader()).subscribe(
        (data: any) => {
          this.procesos = data;
      })
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

          // Convertir las cadenas de direcciones y procesos a arrays
          const direccionesArray = decodedPayload.direccion.split(',').map((direccion: string) => direccion.trim());
          const procesosArray = decodedPayload.proceso.split(',').map((proceso: string) => proceso.trim());

    
          // Verificar si son todas las direcciones y todos los procesos
          const sonTodasLasDirecciones = direccionesArray.includes('TODAS LAS DIRECCIONES');
          const sonTodosLosProcesos = procesosArray.includes('TODOS LOS PROCESOS');
          

          // Filtrar los datos según las direcciones y procesos del payload
          const patsFiltrados = data.filter((d: any) => {
            if (sonTodasLasDirecciones && sonTodosLosProcesos) {
              return true;
            } else if (sonTodasLasDirecciones && procesosArray.includes(d.proceso)) {
              return true;
            } else if (direccionesArray.includes(d.direccion.nombre) && procesosArray.includes(d.proceso.nombre)) {
              return true;
            } else {
              return false;
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
          Swal.fire(error.error.mensajeTecnico);
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
          Swal.fire(error.error.mensajeTecnico);
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
          Swal.fire(error.error.mensajeTecnico);
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
          Swal.fire(error.error.mensajeTecnico);
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
          const numeroDeListas = Object.keys(data).length;
          this.cantidadProyectos = numeroDeListas;
        },
        (error) => {
          Swal.fire(error.error.mensajeTecnico);
        }
      );
    }

    modificarPat() {
      if (this.form.valid && this.selectedPatId) {
        const nombre = this.form.get('nombre')?.value;
        const fechaAnual = this.form.get('fechaAnual')?.value;
        const proceso = this.form.get('proceso')?.value;
        const idUsuario = this.usuario;
        const pat = {
          nombre: nombre,
          fechaAnual: fechaAnual,
          proceso: proceso,
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
            if (this.selectedPatId != null) {
                this.patService.modificarPat(pat, this.selectedPatId, this.auth.obtenerHeader()).subscribe(
                (response) => {
                  Swal.fire({
                    icon : 'success',
                    title : 'Modificado!!!',
                    text : 'El plan anual se ha modificado.',
                    confirmButtonColor: '#0E823F',
                    }).then(() => {
                      this.cargarPats()
                  });
                },
                (error) => {
                  Swal.fire("Solicitud no válida", error.error.mensajeHumano, "error");
                }
              );
            }
          }
        });
      } 
    }
    
    eliminarPat(idPat: number) {
      const patAEliminar = this.pats.find(pat => pat.idPat === idPat);

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
            (response) => {
              Swal.fire({
                title:'Eliminado!',
                text: "El pat se ha eliminado.",
                icon: "success",
                confirmButtonColor: '#0E823F'
              }).then(() => {
                  this.cargarPats()
              });
            },
            (error) => {
              Swal.fire({
                title:'Solicitud no válida!',
                text: error.error.mensajeHumano,
                icon: "error",
              });
            }
          );
        }
      });
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

    setSelectedPat(idPat: number,pat:any) {
      this.selectedPatId = idPat;
      this.nombrePatSeleccionado = pat.nombre;
      this.fechaAnualSeleccionada = pat.fechaAnual;
      this.procesoSeleccionado = pat.proceso.nombre;
      this.usuario = pat.idUsuario

      this.form.patchValue({
        nombre: this.nombrePatSeleccionado,
        fechaAnual: this.fechaAnualSeleccionada,
        proceso: this.procesoSeleccionado,
      });
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