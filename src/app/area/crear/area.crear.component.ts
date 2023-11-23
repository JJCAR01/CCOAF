import { Component } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule,FormGroup,Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AreaService } from '../services/area.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-root',
  templateUrl: './area.crear.component.html',
  styleUrls: ['./area.crear.component.scss']
})
export class AreaCrearComponent {
  title = 'crearArea';
  constructor(private areaService: AreaService
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
      Swal.fire("Creado!!!", 'El area con el nombre ' +this.form.value.nombre + ',  se ha creado!!', "success");
      this.form.reset();
    },error =>{
      Swal.fire("Error al Crear " + this.form.value.nombre , error.error.mensajeTecnico , "error");
    } )
  }
}
