import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule,FormGroup,Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AreaService } from '../services/area.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { EDireccion } from '../edireccion';


@Component({
  selector: 'app-root',
  templateUrl: './area.crear.component.html',
  styleUrls: ['./area.crear.component.scss']
})
export class AreaCrearComponent implements OnInit {
  title = 'crearArea';
  direccionEnumList: string[] = [];
  form:FormGroup;

  constructor(private areaService: AreaService,private auth: AuthService,
    private formBuilder: FormBuilder) 
    { 
      this.form = this.formBuilder.group({
        nombre: ['', Validators.required],
        direccion: ['', Validators.required],
      });
    }
  ngOnInit(): void {
    this.direccionEnumList = Object.values(EDireccion);
  }
  crearArea(){
    const nombre = this.form.get('nombre')?.value;
    const direccion = this.form.value.direccion.toUpperCase().replace(/\s+/g, '_');
    const body = {
      nombre: nombre,
      direccion:direccion
    };
    this.areaService.crear(body,this.auth.obtenerHeader()).toPromise().then(response =>{
      Swal.fire({
        title:"Creado!!!",
        text:'El área se ha creado.', 
        icon:"success",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        confirmButtonColor: '#0E823F',
        reverseButtons: true, 
      });
      this.form.reset();
    },error =>{
      Swal.fire(
        {
          title:"Error!!!",
          text:error.error.mensajeHumano, 
          icon:"error",
        }
      );
    } )
  }
}
