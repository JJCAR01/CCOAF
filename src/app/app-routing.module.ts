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



const routes: Routes = [
  { path: "login", component: LoginComponent, pathMatch: "full" },
  { path: "crearUsuario", component: UsuarioCrearComponent, pathMatch: "full" },
  { path: "listarUsuario", component: UsuarioListarComponent, pathMatch: "full" },
  { path: "crearCargo", component: CargoCrearComponent, pathMatch: "full" },
  { path: "listarCargo", component: CargoListarComponent, pathMatch: "full" },
  { path: "crearArea", component: AreaCrearComponent, pathMatch: "full" },
  { path: "listarArea", component: AreaListarComponent, pathMatch: "full" },
  { path: "panelAdmin", component: PanelAdminComponent, pathMatch: "full" },
  { path: "panelUsuario", component: PanelUsuarioComponent, pathMatch: "full" }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
