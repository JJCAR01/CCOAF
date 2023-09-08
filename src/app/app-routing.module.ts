import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormBuilder } from '@angular/forms';
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
import { ImperativoEstrategicoListarComponent } from './imperativo.estrategico/listar/imperativo.estrategico.component';
import { ProgramaListarComponent } from './programa/listar/programa.component';
import { LineaEstrategicaComponent } from './linea.estrategica/listar/linea.estrategica.component';



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
  ] },

  { path: "panelUsuario", component: PanelUsuarioComponent, 
  children:[
    { path: "listarPat", component: PatListarComponent, outlet:"OutletUsuario"},
    { path: "listarImperativo", component: ImperativoEstrategicoListarComponent, outlet:"OutletUsuario"},
    { path: "listarPrograma", component: ProgramaListarComponent, outlet:"OutletUsuario"},
    { path: "listarLinea", component: LineaEstrategicaComponent, outlet:"OutletUsuario"},
    
  ] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
