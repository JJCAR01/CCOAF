import { Component  } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { LoginService } from './services/login.service';
import { GoogleLoginProvider, SocialAuthService } from "@abacritt/angularx-social-login";

import {  Validators,FormGroup,FormControl,ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router'; 



@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
  private loginService: LoginService, 
    private cookieService:CookieService,
    private router: Router 
  ) {}

  form = new FormGroup({
    correo: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

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

        //const jwt = this.cookieService.get('jwt');


        this.router.navigate([`/panelAdmin`]);
      } else {
        console.log("No se recibió una respuesta válida del servidor.");
      }
    },error =>{
      console.log(error);
    } )
  }
}
