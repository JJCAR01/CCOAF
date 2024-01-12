import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { AreaService } from '../services/area.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { DireccionService } from 'src/app/direccion/services/direccion.service';


@Component({
  selector: 'app-root',
  templateUrl: './area.crear.component.html',
  styleUrls: ['./area.crear.component.scss']
})
export class AreaCrearComponent implements OnInit {
  title = 'crearArea';
  direcciones: any[] = [];
  form:FormGroup;

  constructor(private areaService: AreaService,private auth: AuthService,
    private direccionService: DireccionService,
    private formBuilder: FormBuilder) 
    { 
      this.form = this.formBuilder.group({
        nombre: ['', Validators.required],
        direccion: ['', Validators.required],
      });
  }
  ngOnInit(): void {
    this.cargarDirecciones();
  }

  cargarDirecciones() {
    this.direccionService.listar(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        
        this.direcciones = data;
    })
  }
  crearArea(){
    const nombre = this.form.get('nombre')?.value;
    const direccion = this.form.get('direccion')?.value
    const area = {
      nombre: nombre,
      direccion:direccion
    };
    this.areaService.crear(area,this.auth.obtenerHeader()).toPromise().then(response =>{
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
          confirmButtonColor: '#0E823F',
        }
      );
    } )
  }
}
