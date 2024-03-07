import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModalModule } from 'ng-bootstrap-modal';
import { LoginComponent } from "./login/login.component";
import { UsuarioCrearComponent } from "./usuario/crear/usuario.crear.component";
import { UsuarioListarComponent } from "./usuario/listar/usuario.listar.component";
import { CargoCrearComponent } from "./cargo/crear/cargo.crear.component";
import { CargoListarComponent } from "./cargo/listar/cargo.listar.component";
import { AreaCrearComponent } from "./area/crear/area.crear.component";
import { AreaListarComponent } from "./area/listar/area.listar.component";
import { PanelAdminComponent } from "./panel.admin/panel.admin.component";
import { PatCrearComponent } from './pat/crear/pat.crear.component';
import { PatListarComponent } from './pat/listar/pat.listar.component';
import { TipogeListarComponent } from './gestion/listar/tipoGE.listar.component';
import { ActividadCrearComponent } from './actividad/crear.actividad/actividad.crear.component';
import { ActividadListarComponent } from './actividad/listar/actividad.listar.component';
import { SprintListarComponent } from './sprint/listar/sprint.listar.component';
import { TipoGECrearComponent } from './gestion/crear.estrategica/tipoGE.crear.component';
import { SprintCrearComponent } from './sprint/crear/sprint.crear.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProyectoListarComponent } from './proyecto/listar/proyecto.listar.component';
import { ProyectoPendienteListarComponent } from './proyecto/pendientes/proyecto.pendiente.component';
import { ActividadestrategicaListarComponent } from './actividadestrategica/listar/actividadestrategica.listar.component';
import { ModificarDireccionesComponent } from './usuario/modificar.direcciones/modificar.direcciones.component';
import { DireccionCrearComponent } from './direccion/crear/direccion.crear.component';
import { ProcesoCrearComponent } from './proceso/crear/proceso.crear.component';
import { CrearProyectoComponent } from './actividad/crear.proyecto/crear.proyecto.component';
import { LoginGuard} from './guards/login.guard';
import { CrearGestionComponent } from './gestion/crear.gestion/crear.gestion.component';
import { CrearProyectoareaComponent } from './gestion/crear.proyectoarea/crear.proyectoarea.component';
import { ListarSprintproyectoareaComponent } from './sprintproyectoarea/listar.sprintproyectoarea/listar.sprintproyectoarea.component';
import { CrearSprintproyectoareaComponent } from './sprintproyectoarea/crear.sprintproyectoarea/crear.sprintproyectoarea.component';
import { ListarHistoricoComponent } from './historico/listar.historico/listar.historico.component';



const routes: Routes = [
  { path: "login", component: LoginComponent},

  { path: "panel", component: PanelAdminComponent,canActivate:[LoginGuard],
  children:[
    { path: "crearUsuario", component: UsuarioCrearComponent, outlet:"OutletAdmin" },
    { path: `listarUsuario`, component: UsuarioListarComponent, outlet:"OutletAdmin"},
    { path: "crearCargo", component: CargoCrearComponent, outlet:"OutletAdmin"},
    { path: "listarCargo", component: CargoListarComponent, outlet:"OutletAdmin"},
    { path: "crearArea", component: AreaCrearComponent, outlet:"OutletAdmin"},
    { path: "listarArea", component: AreaListarComponent, outlet:"OutletAdmin"},
    { path: "dashboard", component: DashboardComponent, outlet:"OutletAdmin"},
    { path: "listarProyecto", component: ProyectoListarComponent, outlet:"OutletAdmin"},
    { path: 'listarProyectoPendiente', component: ProyectoPendienteListarComponent, outlet:'OutletAdmin'},
    { path: "listarPat", component: PatListarComponent,outlet:"OutletAdmin"},
    { path: "listarHistorico", component: ListarHistoricoComponent, outlet:"OutletAdmin"},
    { path: "listarActividadesEstrategicas", component: ActividadestrategicaListarComponent, outlet:"OutletAdmin"},
    { path: "modificarDirecciones", component: ModificarDireccionesComponent, outlet:"OutletAdmin"},
    { path: "listarProyecto", component: ProyectoListarComponent, outlet:"OutletAdmin"},
    { path: "listarProyectosPendiente", component: ProyectoPendienteListarComponent, outlet:"OutletAdmin"},
    { path: "crearPat", component: PatCrearComponent, outlet:"OutletAdmin"},
    { path: "listarPat", component: PatListarComponent, outlet:"OutletAdmin"},   
    { path: "listarTipoGE/:idPat", component: TipogeListarComponent, outlet:"OutletAdmin" },
    { path: "crearActividadEstrategica", component: TipoGECrearComponent, outlet:"OutletAdmin"}, 
    { path: "crearActividad", component: ActividadCrearComponent, outlet:"OutletAdmin"}, 
    { path: 'listarActividad/:idActividadEstrategica/pat/:patNombre', component: ActividadListarComponent, outlet: 'OutletAdmin' },
    { path: 'listarSprint/:idProyecto/pat/:patNombre', component: SprintListarComponent, outlet: 'OutletAdmin' },
    { path: "crearSprint", component: SprintCrearComponent, outlet:"OutletAdmin"},
    { path: "crearProcesos", component: ProcesoCrearComponent, outlet:"OutletAdmin"},
    { path: "crearDireciones", component: DireccionCrearComponent, outlet:"OutletAdmin"},
    { path: "crearProyecto", component: CrearProyectoComponent, outlet:"OutletAdmin"},
    { path: "crearActividadGestion", component: CrearGestionComponent, outlet:"OutletAdmin"},
    { path: "crearProyectoArea", component: CrearProyectoareaComponent, outlet:"OutletAdmin"},
    { path: "crearSprintProyectoArea", component: CrearSprintproyectoareaComponent, outlet:"OutletAdmin"},
    { path: "listarSprintProyectoArea/:idProyectoArea/pat/:patNombre", component: ListarSprintproyectoareaComponent, outlet:"OutletAdmin"},
  ]},

  { path: '**', redirectTo: 'login' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
