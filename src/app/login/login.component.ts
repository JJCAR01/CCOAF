import { Component ,OnInit,Injectable,AfterContentInit } from '@angular/core';
import { LoginService } from './services/login.service';
import jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';

import {  Validators,FormGroup,FormControl, ValidatorFn, AbstractControl} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router'; 
import { GoogleService } from './google/auth.google.service';
import { AuthService } from './auth/auth.service';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn:'root'
})

@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit{

  loggedIn: boolean = false;

  constructor(
  private loginService: LoginService, 
    private cookieService:CookieService,
    private auth:AuthService,
    private router: Router,
    private authGoogleService:GoogleService,

  ) {}

  form = new FormGroup({
    correo: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  ngOnInit():void {
      this.loggedIn != null;
  }
  

  loginGoogle(){
    this.authGoogleService.googleSignIn().then((response  ) => {
      response.user.getIdToken(true)
      .then((tokenResult) => {
        const body = {
          googleToken: tokenResult  
        };  
        this.loginService.loginGoogle(body).toPromise().then((resp ) => {
          this.router.navigate(["/panelUsuario"]);
        })
        // Enviar el token al backend
        //this.sendTokenToBackend(accessToken);
        })
        .catch((error) => {
          console.error('Error al obtener el token:', error);
        });
    })
    .catch(error => {
      console.log(error)
    })
    
  }

  sendTokenToBackend(token: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  }

  login() {
    const correo = this.form.value.correo;
    const password = this.form.value.password;

    const body = {
      correo: correo,
      password: password  
    };    
    this.loginService.login(body).toPromise().then((response: any) => {
      if (response) {    
        const jwt = response.jwt;
        this.cookieService.set('jwt', jwt);
        const decode:any = jwt_decode(jwt);
        if(decode.type === 'ADMIN')
        { 
          this.loggedIn = response!=null;
          this.router.navigate(["/panelAdmin"]);
        }
        else if (decode.type === 'OPERADOR')
        {
          this.router.navigate(["/panelUsuario"]);
        }
      } 
    },error =>{
      Swal.fire('Por favor intente de nuevo',error.error.mensajeTecnico,'warning')
    } )
  }

  getControl(nombre:any):AbstractControl | null {
    return this.form.get(nombre)
  }

  solicitar(){
    Swal.fire('Solicitar acceso', "Por favor contactese con el administrador, dirigiendose a la mesa de ayuda para generar el Ticket",'warning')
  }
}