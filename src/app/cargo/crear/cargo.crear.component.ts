import { Component } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { CargoService } from '../services/cargo.service';  
import { AreaService } from 'src/app/area/services/area.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { Area } from 'src/app/modelo/area';


@Component({
  selector: 'app-root',
  templateUrl: './cargo.crear.component.html',
  styleUrls: ['./cargo.crear.component.scss']
})

export class CargoCrearComponent {
  title = 'crearCargo';
  ESTE_CAMPO_ES_OBLIGARORIO: string = 'Este campo es obligatorio*';
  areas: Area[] = [];
  form:FormGroup;
  
  constructor(private cargoService: CargoService,private formBuilder: FormBuilder,
    private areaService:AreaService, private auth:AuthService) 
  { this.form = this.formBuilder.group({
    nombre: ['', Validators.required],
    idArea: ['', Validators.required], 
  }); }

  ngOnInit(): void {
    this.cargarAreas();
  }

  cargarAreas() {
    this.areaService.listar(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.areas = data;
    });
  }

  crearCargo() { 
    if (this.form.valid) {
      const nombre = this.form.get('nombre')?.value;
      const idAreaSeleccionado = parseFloat(this.form.get('idArea')?.value);

      const areaSeleccionada = this.areas.find(area =>  area.idArea === idAreaSeleccionado);

      if (nombre !== null && areaSeleccionada) {
        const cargo = {
          nombre: nombre,
          idArea: areaSeleccionada.idArea,
        };
        // Luego, envía 'cargo' al backend usando tu servicio.
        this.cargoService.crear(cargo,this.auth.obtenerHeader()).subscribe(
          (response) => {
            Swal.fire(
              {
                title:"Creado!!!",
                text:'El cargo se ha creado.', 
                icon:'success',
                position: "center",
                showConfirmButton: false,
                timer: 1500,
              }
            );
            this.form.reset();
          },
          (error) => {
            Swal.fire(
              {
                title:"Error!!!",
                text:error.error.mensajeTecnico, 
                icon:"error",
                confirmButtonColor: '#0E823F',
              }
            );
          }
        );
      }
    } else {
      return Object.values(this.form.controls).forEach(control =>{
        control.markAllAsTouched();
      })
    }
  }
  get nombreVacio(){
    return this.form.get('nombre')?.invalid && this.form.get('nombre')?.touched;
  }
  get areaVacio(){
    return this.form.get('idArea')?.invalid && this.form.get('idArea')?.touched;
  }
}