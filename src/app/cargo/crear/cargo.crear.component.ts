import { Component } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule,FormGroup,Validators } from '@angular/forms';
import { CargoService } from '../services/cargo.service';  
import { CookieService } from 'ngx-cookie-service';
import { AreaService } from 'src/app/area/services/area.service';


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
    private areaService:AreaService) 
  { this.form = this.formBuilder.group({
    nombre: ['', Validators.required],
    idArea: [null, Validators.required], 
  }); }

  ngOnInit(): void {
    this.cargarAreas();
  }

  cargarAreas() {
    this.areaService.listarArea().subscribe(
      (data: any) => {
        this.areas = data;
        console.log(this.areas);
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
      console.log('this.areas:', this.areas);
      console.log('idAreaSeleccionado:', idAreaSeleccionado);

      // Busca el objeto de área correspondiente según el idArea seleccionado
      const areaSeleccionada = this.areas.find(area =>  area.idArea === idAreaSeleccionado);
      console.log(areaSeleccionada.idArea);

      if (nombre !== null && areaSeleccionada) {
        console.log(nombre)
        const cargo = {
          nombre: nombre,
          idArea: areaSeleccionada.idArea,
        };
        console.log(this.form.value);
        // Luego, envía 'cargo' al backend usando tu servicio.
        this.cargoService.crearCargo(cargo).subscribe(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.error("Error en la solicitud al backend:", error);
          }
        );
      }
    }
  }
}