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
import { GestionCrearComponent } from './gestion/crear/gestion/gestion.crear.component';
import { ProyectoListarComponent } from './proyecto/listar/proyecto.listar/proyecto.listar.component';



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
  ]},

  { path: "panelUsuario", component: PanelUsuarioComponent, 
  children:[
    { path: "crearPat", component: PatCrearComponent, outlet:"OutletUsuario"},
    { path: "listarPat", component: PatListarComponent, outlet:"OutletUsuario"},   
    { path: "listarTipoGE/:idPat", component: TipogeListarComponent, outlet:"OutletUsuario" },
    { path: "crearGestion", component: GestionCrearComponent, outlet:"OutletUsuario" },
    { path: "crearActividad", component: ActividadCrearComponent, outlet:"OutletUsuario"}, 
    { path: "listarActvidad", component: ActividadListarComponent , outlet:"OutletUsuario"}, 
    { path: "listarProyecto/:idActividadEstrategica", component: ProyectoListarComponent, outlet:"OutletUsuario" },
   
  ] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
