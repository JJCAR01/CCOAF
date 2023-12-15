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
import { PanelUsuarioComponent } from "./panel.usuario/panel.usuario.component";
import { PanelAdminComponent } from "./panel.admin/panel.admin.component";
import { PatCrearComponent } from './pat/crear/pat.crear.component';
import { PatListarComponent } from './pat/listar/pat.listar.component';
import { TipogeListarComponent } from './gestion/listar/tipoGE.listar.component';
import { ActividadCrearComponent } from './actividad/crear/actividad.crear.component';
import { ActividadListarComponent } from './actividad/listar/actividad.listar.component';
import { SprintListarComponent } from './sprint/listar/sprint.listar.component';
import { TareaListarComponent } from './tarea/listar/tarea.listar.component';
import { TipoGECrearComponent } from './gestion/crear/tipoGE.crear.component';
import { SprintCrearComponent } from './sprint/crear/sprint.crear.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProyectoListarComponent } from './proyecto/listar/proyecto.listar.component';
import { ProyectoPendienteListarComponent } from './proyecto/pendientes/proyecto.pendiente.component';
import { ActividadestrategicaListarComponent } from './actividadestrategica/listar/actividadestrategica.listar.component';
import { ActividadEstrategicaPendienteListarComponent } from './actividadestrategica/pendiente/actividadestrategica.pendiente.component';



const routes: Routes = [
  { path: '',redirectTo:'login',pathMatch:"full"},
  { path: "login", component: LoginComponent},

  { path: "panelAdmin", component: PanelAdminComponent,
  children:[
    { path: "crearUsuario", component: UsuarioCrearComponent, outlet:"OutletAdmin" },
    { path: `listarUsuario`, component: UsuarioListarComponent, outlet:"OutletAdmin"},
    { path: "crearCargo", component: CargoCrearComponent, outlet:"OutletAdmin"},
    { path: "listarCargo", component: CargoListarComponent, outlet:"OutletAdmin"},
    { path: "crearArea", component: AreaCrearComponent, outlet:"OutletAdmin"},
    { path: "listarArea", component: AreaListarComponent, outlet:"OutletAdmin"},
    { path: "dashboard", component: DashboardComponent, outlet:"OutletAdmin"},
    { path: "listarProyecto", component: ProyectoListarComponent, outlet:"OutletAdmin"},
    { path: "listarPat", component: PatListarComponent, outlet:"OutletAdmin"},
    { path: "listarActividadesEstrategicas", component: ActividadestrategicaListarComponent, outlet:"OutletAdmin"},
    { path: "listarActividadesEstrategicasPendiente", component: ActividadEstrategicaPendienteListarComponent, outlet:"OutletAdmin"},
  ]},

  { path: "panelUsuario", component: PanelUsuarioComponent, 
  children:[
    { path: "dashboard", component: DashboardComponent, outlet:"OutletUsuario"},
    { path: "listarProyecto", component: ProyectoListarComponent, outlet:"OutletUsuario"},
    { path: "listarProyectosPendiente", component: ProyectoPendienteListarComponent, outlet:"OutletUsuario"},
    { path: "listarActividadesEstrategicas", component: ActividadestrategicaListarComponent, outlet:"OutletUsuario"},
    { path: "listarActividadesEstrategicasPendiente", component: ActividadEstrategicaPendienteListarComponent, outlet:"OutletUsuario"},
    { path: "crearPat", component: PatCrearComponent, outlet:"OutletUsuario"},
    { path: "listarPat", component: PatListarComponent, outlet:"OutletUsuario"},   
    { path: "listarTipoGE/:idPat", component: TipogeListarComponent, outlet:"OutletUsuario" },
    { path: "crearTipoGE", component: TipoGECrearComponent, outlet:"OutletUsuario"}, 
    { path: "crearActividad", component: ActividadCrearComponent, outlet:"OutletUsuario"}, 
    { path: 'listarActividad/:idActividadEstrategica/pat/:patNombre', component: ActividadListarComponent, outlet: 'OutletUsuario' },
    { path: 'listarSprint/:idProyecto/pat/:patNombre', component: SprintListarComponent, outlet: 'OutletUsuario' },
    { path: "crearSprint", component: SprintCrearComponent, outlet:"OutletUsuario"},
    { path: 'listarTarea/:idASE', component: TareaListarComponent, outlet: 'OutletUsuario' }

  ] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
