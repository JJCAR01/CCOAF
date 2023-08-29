import { Component } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  correo: string = ''; // Variable para almacenar el usuario
  password: string = ''; // Variable para almacenar la contraseña

  constructor(private loginService: LoginService) {}

  login() {
    // Obtener los valores del formulario (usuario y contraseña) desde las propiedades del componente
    const correo = this.correo;
    const password = this.password;

    // Configurar las cabeceras de la solicitud (si es necesario)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json' // Puedes ajustar esto según las necesidades
    });

    // Construir el cuerpo de la solicitud
    const body = {
      correo: correo,
      password: password
    };
    console.log(body);

    // Realizar la solicitud POST al servidor
    this.loginService.login(body).toPromise().then(response =>{
      console.log(response);
    },error =>{
      console.log(error);
    } )
  }
}