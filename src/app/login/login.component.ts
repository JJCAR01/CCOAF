import { Component ,OnInit,Injectable } from '@angular/core';
import { LoginService } from './services/login.service';
import jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';

import { Validators,FormGroup,FormControl} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router'; 
import { GoogleService } from './google/auth.google.service';


@Injectable({
  providedIn:'root'
})

@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit{
  ESTE_CAMPO_ES_OBLIGARORIO: string = 'Este campo es obligatorio*';
  siteKey : string = "6LfILVQpAAAAAGO2YpYhNu4z101RVPTqDHW0DbKp";
  loggedIn: boolean = false;
  isAdmin: boolean = false; // Agrega esta línea

  constructor(
  private loginService: LoginService, 
    private cookieService:CookieService,
    private router: Router,
    private authGoogleService:GoogleService,

  ) {}

  form = new FormGroup({
    correo: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    recaptcha: new FormControl('',Validators.required)
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
          this.loginService.loginGoogle(body).toPromise()
          .then((resp ) => {
            if (resp) {    
              const jwt = resp.jwt;
              this.cookieService.set('jwt', jwt);
              const decode:any = jwt_decode(jwt);
              if (decode.type === 'OPERADOR')
              {
                this.loggedIn = response!=null;
                this.router.navigate(['/panel', { outlets: { 'OutletAdmin': ['listarPat'] } }]);
              }
              else if(decode.type === 'ADMIN'){
                this.isAdmin = true;
                this.loggedIn = response!=null;
                this.router.navigate(['/panel', { outlets: { 'OutletAdmin': ['listarArea'] } }]);
              }

            }
          }).catch((error) => {
            Swal.fire({
              title:'Error',
              text: error.error.mensajeHumano,
              icon:'error',
              confirmButtonColor: '#0E823F'
            })
          });
        })
    })
    .catch(error => {
      Swal.fire({
        title:'Error',
        text: error.error.mensajeHumano,
        icon:'error'
      })
    })
    
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
          this.isAdmin = true;
          this.loggedIn = response!=null;
          this.router.navigate(['/panel', { outlets: { 'OutletAdmin': ['listarArea'] } }]);
        }
        else if (decode.type === 'OPERADOR')
        {
          this.loggedIn = response!=null;
          this.router.navigate(['/panel', { outlets: { 'OutletAdmin': ['listarPat'] } }]);
        }
      } 
      },error =>{
        Swal.fire({
          title:'Por favor intente de nuevo',
          text:error.error.mensajeTecnico,
          icon:'warning',
          confirmButtonColor: '#0E823F'
        })
      } 
    )
  }

  solicitar(){
    Swal.fire({
        title:'Solicitar acceso',
        html: "Por favor contáctese con el administrador, dirigiéndose a la mesa de ayuda para generar el Ticket " +
            "<a href='https://mesadeayuda.ccoa.org.co:446/' target='_blank'>https://mesadeayuda.ccoa.org.co:446/</a>",
        icon:'warning',
        confirmButtonColor: '#0E823F'
    });
  }

  get correoVacio(){
    return this.form.get('correo')?.invalid && this.form.get('correo')?.touched;
  }
  get passwordVacio(){
    return this.form.get('password')?.invalid && this.form.get('password')?.touched;
  }
  get recaptchaVacio(){
    return this.form.get('recaptcha')?.invalid && this.form.get('recaptcha')?.touched;
  }
}