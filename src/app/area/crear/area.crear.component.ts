import { Component } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule,FormGroup,Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { AreaService } from '../services/area.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { Observable } from 'rxjs';
import swal from 'sweetalert';


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
    const body = {
      nombre: nombre,
    };
    
    this.areaService.crear(body,this.auth.obtenerHeader()).toPromise().then(response =>{
      swal("Creado Satisfactoriamente", 'El area con el nombre ' +this.form.value.nombre + ', se ha creado!!', "success");
      this.form.reset();
    },error =>{
      swal("Error al Crear " + this.form.value.nombre , error.error.mensajeTecnico , "error");
    } )
  }
  

}
