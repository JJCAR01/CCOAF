import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { RouterModule, Routes } from '@angular/router';


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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { BuscarPipe } from 'src/pipes/buscar.pipes';

import swal from 'sweetalert';
import { ActividadCrearComponent } from './actividad/crear/actividad.crear.component';
import { ActividadListarComponent } from './actividad/listar/actividad.listar.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { SprintListarComponent } from './sprint/listar/sprint.listar.component';
import { SprintCrearComponent } from './sprint/crear/sprint.crear.component';
import { TareaListarComponent } from './tarea/listar/tarea.listar.component';
import { TareaCrearComponent } from './tarea/crear/tarea.crear.component';

import { EnumPipe } from 'src/pipes/enum.pipes';
import { TipoGECrearComponent } from './gestion/crear/tipoGE.crear.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment.development';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/compat/storage';



@NgModule({
  declarations: [
    AppComponent,LoginComponent,PanelAdminComponent,AreaCrearComponent,AreaListarComponent,PanelUsuarioComponent,
    CargoCrearComponent,CargoListarComponent,UsuarioCrearComponent,UsuarioListarComponent, BuscarPipe,EnumPipe,PatListarComponent,
    PatCrearComponent,TipogeListarComponent,ActividadCrearComponent, ActividadListarComponent,TipoGECrearComponent,
    SprintListarComponent,SprintCrearComponent, TareaListarComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
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
    AngularFireStorage,
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
