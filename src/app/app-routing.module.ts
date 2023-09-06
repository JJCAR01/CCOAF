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
  { path: "login", component: LoginComponent, pathMatch: "full" },

  { path: "panelAdmin", component: PanelAdminComponent, 
  children:[
    { path: "crearUsuario", component: UsuarioCrearComponent },
    { path: "listarUsuario", component: UsuarioListarComponent},
    { path: "crearCargo", component: CargoCrearComponent},
    { path: "listarCargo", component: CargoListarComponent},
    { path: "crearArea", component: AreaCrearComponent},
    { path: "listarArea", component: AreaListarComponent},
    { path: "patListar", component: PatListarComponent},
    { path: "imperativoListar", component: ImperativoEstrategicoListarComponent},
    { path: "programaListar", component: ProgramaListarComponent},
    { path: "lineaeListar", component: LineaEstrategicaComponent},
  ] },

  { path: "panelUsuario", component: PanelUsuarioComponent, 
  children:[
    { path: "patCrear", component: PatCrearComponent },
    
  ] },
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
