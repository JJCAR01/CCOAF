import { Component ,OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { LoginService } from './services/login.service';
import jwt_decode from "jwt-decode";
import swal from 'sweetalert';

import { GoogleLoginProvider, SocialAuthService,SocialUser } from '@abacritt/angularx-social-login';

import {  Validators,FormGroup,FormControl,ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router'; 



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
    private router: Router,
    private authService:SocialAuthService, 
  ) {}

  form = new FormGroup({
    correo: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });


  /*ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }*/

  /*signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      user => {
      this.socialUser = user;
      this.loggedIn = true;
      alert('Inició sesión correctamente');
      this.router.navigate(["/panelUsuario"]);

    }).catch((error) => {
      console.log('Error al iniciar sesión con Google:', error);
    });
  }*/
  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.socialUser = user;
      this.loggedIn = user != null;
    });
  }

  loginWithGoogle(): void {
    this.loginService.authenticateWithGoogle().toPromise().then(
      (data: any) => {
        console.log(data)
      });
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  logOut():void{
    this.authService.signOut();
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
          alert("Operador")
          this.router.navigate(["/panelUsuario"]);
        }
      } 
    },error =>{
      swal('Por favor intente de nuevo',error.error.mensajeTecnico,'warning')
    } )
  }

  solicitar(){
    swal('Solicitar acceso', "Por favor contactese con el administrador, dirigiendose a la mesa de ayuda para generar el Ticket")
  }
}
