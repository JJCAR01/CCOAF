import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent} from './login/login.component'
import { UsuarioCrearComponent } from './usuario/crear/usuario.crear.component';
import { UsuarioListarComponent } from './usuario/listar/usuario.listar.component';
import { PanelAdminComponent } from './panel.admin/panel.admin.component';
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
import { BuscarDireccionPipe } from 'src/pipes/buscardireccion.pipes';
import { BuscarResponsablePipe } from 'src/pipes/buscarresponsable.pipes';

import { ActividadCrearComponent } from './actividad/crear.actividad/actividad.crear.component';
import { ActividadListarComponent } from './actividad/listar/actividad.listar.component';
import { SprintListarComponent } from './sprint/listar/sprint.listar.component';
import { SprintCrearComponent } from './sprint/crear/sprint.crear.component';
import { ProyectoListarComponent } from './proyecto/listar/proyecto.listar.component';
import { ProyectoPendienteListarComponent } from './proyecto/pendientes/proyecto.pendiente.component';
import { ModificarDireccionesComponent } from './usuario/modificar.direcciones/modificar.direcciones.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProcesoCrearComponent } from './proceso/crear/proceso.crear.component';
import { DireccionCrearComponent } from './direccion/crear/direccion.crear.component';
import { CrearProyectoComponent } from './actividad/crear.proyecto/crear.proyecto.component';
import { CrearGestionComponent } from './gestion/crear.gestion/crear.gestion.component';
import { CrearProyectoareaComponent } from './gestion/crear.proyectoarea/crear.proyectoarea.component';
import { ListarSprintproyectoareaComponent } from './sprintproyectoarea/listar.sprintproyectoarea/listar.sprintproyectoarea.component';
import { CrearSprintproyectoareaComponent } from './sprintproyectoarea/crear.sprintproyectoarea/crear.sprintproyectoarea.component';

import { EnumPipe } from 'src/pipes/enum.pipes';
import { ComasPipe } from 'src/pipes/comas.pipes';
import { TipoGECrearComponent } from './gestion/crear.estrategica/tipoGE.crear.component';
import { environment } from 'src/environments/environment.development';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { HttpClientModule } from '@angular/common/http';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideStorage,getStorage } from '@angular/fire/storage';

import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { LoginGuard } from './guards/login.guard';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ActividadestrategicaListarComponent } from './actividadestrategica/listar/actividadestrategica.listar.component';
import { ListarHistoricoComponent } from './historico/listar.historico/listar.historico.component';
import { BuscarFechaAnualPipe } from 'src/pipes/buscarfechaanual.pipes';
import { BuscarUsuarioPipe } from 'src/pipes/buscar.usuario';


@NgModule({
  declarations: [
    AppComponent,LoginComponent,PanelAdminComponent,AreaCrearComponent,AreaListarComponent,
    CargoCrearComponent,CargoListarComponent,UsuarioCrearComponent,UsuarioListarComponent, BuscarPipe,EnumPipe,PatListarComponent,
    PatCrearComponent,TipogeListarComponent,ActividadCrearComponent, ActividadListarComponent,TipoGECrearComponent,
    SprintListarComponent,SprintCrearComponent, ProyectoListarComponent, ProyectoPendienteListarComponent,
    ComasPipe, ModificarDireccionesComponent,DashboardComponent,
    DireccionCrearComponent,ProcesoCrearComponent,CrearProyectoComponent,CrearGestionComponent,CrearProyectoareaComponent,
    ListarSprintproyectoareaComponent,CrearSprintproyectoareaComponent,ActividadestrategicaListarComponent,ListarHistoricoComponent,
    BuscarFechaAnualPipe,BuscarDireccionPipe,BuscarResponsablePipe,BuscarUsuarioPipe
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    AngularFireStorageModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    ReactiveFormsModule,
    NgxCaptchaModule,
    AngularFireAuthModule,
    NgbModule,
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
              '121626008191-osoar9lh9u3il598ae36qfgl2e7fdlr9.apps.googleusercontent.com'
            )
          },
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    CookieService,
    { provide: 'CookieService', useClass: CookieService },
    LoginGuard,
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    {provide: LocationStrategy, useClass: HashLocationStrategy}

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }