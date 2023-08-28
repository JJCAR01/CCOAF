import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  correo: string = ''; // Variable para almacenar el usuario
  password: string = ''; // Variable para almacenar la contraseña

  constructor(private http: HttpClient) {}

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

    // Realizar la solicitud POST al servidor
    this.http.post('http://localhost:8081/ccoa/auth/login', body, { headers })
      .subscribe(
        (response) => {
          // Manejar la respuesta exitosa del servidor aquí
          console.log('Respuesta del servidor:', response);
        },
        (error) => {
          // Manejar errores de la solicitud aquí
          console.error('Error en la solicitud:', error);
        }
      );
  }
}