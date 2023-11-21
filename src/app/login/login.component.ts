import { Component ,OnInit,Injectable } from '@angular/core';
import { LoginService } from './services/login.service';
import jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';

import { SocialAuthService,SocialUser } from '@abacritt/angularx-social-login';

import {  Validators,FormGroup,FormControl} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service/public-api';
import { Router } from '@angular/router'; 
import { GoogleService } from './google/auth.google.service';
import { AuthService } from './auth/auth.service';


@Injectable({
  providedIn:'root'
})

@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  socialUser : SocialUser | null = null;
  user: SocialUser | null = null;
  loggedIn: boolean = false;

  constructor(
  private loginService: LoginService, 
    private cookieService:CookieService,
    private auth:AuthService,
    private router: Router,
    private authService:SocialAuthService,
    private authGoogleService:GoogleService,

  ) {}

  form = new FormGroup({
    correo: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.socialUser = user;
      this.loggedIn = user != null;
    });
  }

  loginGoogle(){
    this.authGoogleService.loging();
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

  solicitar(){
    Swal.fire('Solicitar acceso', "Por favor contactese con el administrador, dirigiendose a la mesa de ayuda para generar el Ticket",'warning')
  }
}
