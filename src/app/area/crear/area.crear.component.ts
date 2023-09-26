import { Component } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule,FormGroup,Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { AreaService } from '../services/area.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/login/auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './area.crear.component.html',
  styleUrls: ['./area.crear.component.scss']
})
export class AreaCrearComponent {
  title = 'crearArea';
  constructor(private areaService: AreaService,private cookieService:CookieService
    ,private auth: AuthService) 
  {  }

  form = new FormGroup({
    nombre: new FormControl('', Validators.required),
  });

  crearArea(){
    const nombre = this.form.value.nombre;

    // Construir el cuerpo de la solicitud
    const body = {
      nombre: nombre,
    };
    
    this.areaService.crearArea(body,this.auth.obtenerHeader()).toPromise().then(response =>{
      alert("Creado!!!!!!!!!!!!!!!")
    },error =>{
      console.log(error);
    } )
  }

}
