import { Component } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule,FormGroup,Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { AreaCrearService } from './services/area.crear.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-root',
  templateUrl: './area.crear.component.html',
  styleUrls: ['./area.crear.component.scss']
})
export class AreaCrearComponent {
  title = 'crearArea';
  constructor(private areaService: AreaCrearService,private cookieService:CookieService) 
  {  }

  form = new FormGroup({
    nombre: new FormControl('', Validators.required),
  });

  crearArea(){
    // Obtener los valores del formulario (usuario y contraseña) desde las propiedades del componente
    const nombre = this.form.value.nombre;

    // Configurar las cabeceras de la solicitud (si es necesario)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json' // Puedes ajustar esto según las necesidades
    });

    // Construir el cuerpo de la solicitud
    const body = {
      nombre: nombre,
    };
    console.log(body);

    
    this.areaService.crearArea(body).toPromise().then(response =>{
      this.cookieService.get('jwt');
      console.log(response);
    },error =>{
      console.log(error);
    } )
  }

}
