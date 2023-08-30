import { Component ,  } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { LoginService } from './services/login.service';
import { GoogleLoginProvider, SocialAuthService } from "@abacritt/angularx-social-login";

import {  Validators,FormGroup,FormControl,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(
  private loginService: LoginService,
    private router: Router
  ) {}

  form = new FormGroup({
    correo: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  /*onSubmit() {
    if (this.form.valid) {
      const correo = this.form.get('correo')?.value;
      const password = this.form.get('password')?.value;
      //const { correo, password } = this.form.getRawValue();
      if (correo && typeof correo === 'string' && password && typeof password === 'string') {
        this.loginService.login(body).toPromise().then(
          (response) => {
            console.log(response); // Handle success, e.g., store token, navigate, etc.
            this.router.navigate(['/panelAdmin']);
          },
          (error) => {
            console.error(error); // Handle error, e.g., show an error message.
          }
        );
      }

      
    } else {
      this.form.markAllAsTouched();
    }
  }
  */
  

  //correo: string = ''; // Variable para almacenar el usuario
  //password: string = ''; // Variable para almacenar la contraseñ

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

    this.loginService.login(body).toPromise().then(response =>{
       console.log(response);
    },error =>{
      console.log(error);
    } )
  }
  
  
}
