import { Component ,OnInit,Injectable,AfterContentInit } from '@angular/core';
import { LoginService } from './services/login.service';
import jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';

import { GoogleLoginProvider, SocialAuthService,SocialUser } from '@abacritt/angularx-social-login';

import {  Validators,FormGroup,FormControl, ValidatorFn, AbstractControl} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router'; 
import { GoogleService } from './google/auth.google.service';
import { AuthService } from './auth/auth.service';

declare var  google:any;


@Injectable({
  providedIn:'root'
})

@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit,AfterContentInit{

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
  ngAfterContentInit(): void {
    google.accounts.id.initialize({
      client_id: "659612202917-3akn48ut0kpn8ojmneoml5ka2mp909et.apps.googleusercontent.com",
      callback: this.handleCredentialResponse
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }  // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
  }

  form = new FormGroup({
    correo: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  ngOnInit():void {
    this.authService.authState.subscribe((user) => {
      this.socialUser = user;
      this.loggedIn = user != null;
    });
  }

  handleCredentialResponse(response:any){
    if(response.credential){

      const jwt = response.credential;
      const decodedToken: any = jwt_decode(jwt);
      const googleUserId = decodedToken.email; // El ID del usuario proporcionado por Google
      this.loginService.loginGoogle(googleUserId).toPromise().then(
        (validationResponse: any) => {
          
          // Aquí manejas la respuesta del servidor después de validar el usuario
          if (validationResponse.isValid) {
            document.location.href = "/panelUsuario";
          } else {
          // El usuario no es válido según tu lógica de servidor
            console.log("Usuario no válido");
          }
          },
        (error) => {
        // Manejar errores de la solicitud HTTP
          console.error("Error al validar el usuario en el servidor", error);
      }
    );
    }
  }

  
  logOut(): void {
    this.authService.signOut();
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

  getControl(nombre:any):AbstractControl | null {
    return this.form.get(nombre)
  }

  solicitar(){
    Swal.fire('Solicitar acceso', "Por favor contactese con el administrador, dirigiendose a la mesa de ayuda para generar el Ticket",'warning')
  }
}