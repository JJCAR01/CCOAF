import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent} from './login/login.component'
import { UsuarioComponent } from './usuario/usuario.component';
import { PanelComponent } from './panel/panel.component';

@NgModule({
  declarations: [
    LoginComponent,UsuarioComponent,PanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [UsuarioComponent,PanelComponent]
})
export class AppModule { }
