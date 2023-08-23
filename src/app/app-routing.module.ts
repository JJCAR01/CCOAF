import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { UsuarioComponent } from "./usuario/usuario.component";
import { CargoComponent } from "./cargo/cargo.component";
import { AreaComponent } from "./area/area.component";

const routes: Routes = [
  { path: "login", component: LoginComponent, pathMatch: "full" },
  { path: "usuario", component: UsuarioComponent, pathMatch: "full" },
  { path: "cargo", component: CargoComponent, pathMatch: "full" },
  { path: "area", component: AreaComponent, pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
