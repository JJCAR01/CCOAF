import { Component ,OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { LoginService } from './services/login.service';
import jwt_decode from "jwt-decode";

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
      console.log(this.socialUser);
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
    // Obtener los valores del formulario (usuario y contraseña) desde las propiedades del componente
    const correo = this.form.value.correo;
    const password = this.form.value.password;

    // Construir el cuerpo de la solicitud
    const body = {
      correo: correo,
      password: password  
    };
    console.log(body);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json' 
    });
    
    this.loginService.login(body).toPromise().then((response: any) => {
      if (response) {
        // Manejar la respuesta del servicio de inicio de sesión
        console.log(response);
    
        const jwt = response.jwt;
        this.cookieService.set('jwt', jwt);
        const decode:any = jwt_decode(jwt);
        console.log(decode.type);
        if(decode.type === 'A')
        { // Navega a la ruta principal
          this.router.navigate(["/panelAdmin"]);


        }
        else if (decode.type === 'O')
        {
          alert("Operador")
          this.router.navigate(["/panelUsuario"]);
        }
        //const jwt = this.cookieService.get('jwt');
        
      } else {
        console.log("No se recibió una respuesta válida del servidor.");
      }
    },error =>{
      console.log(error);
    } )
  }
}
