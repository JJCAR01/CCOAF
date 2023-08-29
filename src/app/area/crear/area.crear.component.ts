import { Component } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule,FormGroup,Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { AreaCrearService } from './services/area.crear.service';


@Component({
  selector: 'app-root',
  templateUrl: './area.crear.component.html',
  styleUrls: ['./area.crear.component.scss']
})
export class AreaCrearComponent {
  title = 'crearArea';
  formulario: FormGroup; 
  nombre = new FormControl('');

  constructor(private areaService: AreaCrearService, private form: FormBuilder) {
    // Inicializa el FormGroup y define las validaciones si es necesario
    this.formulario = this.form.group({
      nombre: ['', Validators.required], // Puedes agregar más validaciones aquí
    });
  }

  crearArea(){
    // Obtener los valores del formulario (usuario y contraseña) desde las propiedades del componente
    const nombre = this.nombre;

    // Configurar las cabeceras de la solicitud (si es necesario)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json' // Puedes ajustar esto según las necesidades
    });

    // Construir el cuerpo de la solicitud
    const body = {
      nombre: nombre,
    };
    console.log(body);

    // Realizar la solicitud POST al servidor
    this.areaService.crearArea(body).toPromise().then(response =>{
      console.log(response);
    },error =>{
      console.log(error);
    } )
  }

}
