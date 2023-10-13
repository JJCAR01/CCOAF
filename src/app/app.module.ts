import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { RouterModule } from '@angular/router';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent} from './login/login.component'
import { UsuarioCrearComponent } from './usuario/crear/usuario.crear.component';
import { UsuarioListarComponent } from './usuario/listar/usuario.listar.component';
import { PanelAdminComponent } from './panel.admin/panel.admin.component';
import { PanelUsuarioComponent } from './panel.usuario/panel.usuario.component';
import { CargoCrearComponent } from './cargo/crear/cargo.crear.component';
import { CargoListarComponent } from './cargo/listar/cargo.listar.component';
import { AreaCrearComponent } from './area/crear/area.crear.component';
import { AreaListarComponent } from './area/listar/area.listar.component';
import { PatListarComponent } from './pat/listar/pat.listar.component';
import { PatCrearComponent } from './pat/crear/pat.crear.component';
import { TipogeListarComponent } from './gestion/listar/tipoGE.listar.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { BuscarPipe } from 'src/pipes/buscar.pipes';
import { EnumPipe } from 'src/pipes/enum.pipes';
import swal from 'sweetalert';
import { ActividadCrearComponent } from './actividad/crear/actividad.crear.component';
import { ActividadListarComponent } from './actividad/listar/actividad.listar.component';
import { EpicaCrearComponent } from './gestion/crear/epica/epica.crear.component';
import { GestionCrearComponent } from './gestion/crear/gestion/gestion.crear.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { ProyectoListarComponent } from './proyecto/listar/proyecto.listar/proyecto.listar.component';
import { ProyectoCrearComponent } from './proyecto/crear/proyecto.crear/proyecto.crear.component';


@NgModule({
  declarations: [
    AppComponent,LoginComponent,PanelAdminComponent,AreaCrearComponent,AreaListarComponent,PanelUsuarioComponent,
    CargoCrearComponent,CargoListarComponent,UsuarioCrearComponent,UsuarioListarComponent, BuscarPipe,EnumPipe,PatListarComponent,
    PatCrearComponent,TipogeListarComponent,ActividadCrearComponent, ActividadListarComponent, EpicaCrearComponent, GestionCrearComponent, ProyectoListarComponent, ProyectoCrearComponent  
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,GoogleSigninButtonModule,
    OAuthModule.forRoot(),
    ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '659612202917-95lnaql5oq526cg8cd18li7gksjlduap.apps.googleusercontent.com'
            )
          },
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
