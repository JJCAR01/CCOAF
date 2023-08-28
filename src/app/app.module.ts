import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent} from './login/login.component'
import { UsuarioComponent } from './usuario/usuario.component';
import { PanelComponent } from './panel/panel.component';
import { CargoComponent } from './cargo/cargo.component';
import { AreaComponent } from './area/area.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoginComponent,UsuarioComponent,PanelComponent,CargoComponent,AreaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [LoginComponent]
})
export class AppModule { }
