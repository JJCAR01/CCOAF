import { Component } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule,FormGroup,Validators } from '@angular/forms';
import { CargoService } from '../services/cargo.service';  
import { CookieService } from 'ngx-cookie-service';
import { AreaService } from 'src/app/area/services/area.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-root',
  templateUrl: './cargo.crear.component.html',
  styleUrls: ['./cargo.crear.component.scss']
})

export class CargoCrearComponent {
  title = 'crearCargo';
  areas: any[] = [];
  form:FormGroup;
  
  constructor(private cargoService: CargoService,private formBuilder: FormBuilder,
    private areaService:AreaService, private auth:AuthService) 
  { this.form = this.formBuilder.group({
    nombre: ['', Validators.required],
    idArea: [null, Validators.required], 
  }); }

  ngOnInit(): void {
    this.cargarAreas();
  }

  cargarAreas() {
    this.areaService.listar(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.areas = data;
    },
      (error) => {
        console.log(error);
      }
    );
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
                text:'El área se ha creado.', 
                icon:"success",
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonText: "Confirmar",
                confirmButtonColor: '#0E823F',
                reverseButtons: true, 
              }
            );
            this.form.reset();
            console.log(response);
          },
          (error) => {
            Swal.fire(
              {
                title:"Error!!!",
                text:error.error.mensajeHumano, 
                icon:"error",
              }
            );
          }
        );
      }
    }
  }
}