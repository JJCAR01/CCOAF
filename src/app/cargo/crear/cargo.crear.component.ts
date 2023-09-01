import { Component } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule,FormGroup,Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { CargoCrearService } from './services/cargo.crear.service'; 
import { CookieService } from 'ngx-cookie-service';
import { AreaListarService } from 'src/app/area/listar/sevices/area.listar.sevice.service'; 


@Component({
  selector: 'app-root',
  templateUrl: './cargo.crear.component.html',
  styleUrls: ['./cargo.crear.component.scss']
})
export class CargoCrearComponent {
  title = 'crearCargo';
  areas: any[] = [];
  constructor(private cargoService: CargoCrearService,private cookieService:CookieService,
    private areaListarService:AreaListarService) 
  {  }

  form = new FormGroup({
    nombre: new FormControl('', Validators.required),
    idArea: new FormControl(null, Validators.required),
  });
  ngOnInit(): void {
    this.cargarAreas();
  }

  cargarAreas() {
    this.areaListarService.listarArea().subscribe(
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
      const nombre = this.form.get('nombre')?.value; // Agregar '?'
      const idArea = this.form.get('idArea')?.value; 

      if (nombre !== null && idArea !== undefined && idArea !== null) {
        const cargo = {
          nombre: nombre,
          idArea: +idArea, // Convertir a número
        };
  
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
    // Obtener los valores del formulario (usuario y contraseña) desde las propiedades del componente
    


}