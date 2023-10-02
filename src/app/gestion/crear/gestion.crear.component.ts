import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login/auth/auth.service';
import swal from 'sweetalert';
import { TipoGEService } from '../services/tipoGE.service';
import { PatService } from 'src/app/pat/services/pat.service';

@Component({
  selector: 'app-root',
  templateUrl: './gestion.crear.component.html',
  styleUrls: ['./gestion.crear.component.scss']
})
export class GestionCrearComponent {
  title = 'crearGestion';
  pats: any[] = [];
  form:FormGroup;
  
  constructor(private gestionService:TipoGEService,private patService: PatService,
    private formBuilder: FormBuilder,private auth:AuthService) 
  { this.form = this.formBuilder.group({
    nombre: ['', Validators.required],
    idPat: ['', Validators.required], 
  }); }

  ngOnInit(): void {
    this.cargarPats();
  }

  cargarPats() {
    this.patService.listarPat(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.pats = data;
    },
      (error) => {
        swal("Error al cargar PATS", error.error.mensajeTecnico,"error")
      }
    );
  }

  crearGestion() { 
    if (this.form.valid) {
      const nombre = this.form.get('nombre')?.value;
      const idPatSeleccionado = parseInt(this.form.get('idPat')?.value);

      const patSeleccionado = this.pats.find(pat =>  pat.idPat === idPatSeleccionado);

      if (nombre !== null && patSeleccionado) {
        const cargo = {
          nombre: nombre,
          idPat: patSeleccionado.idPat,
        };
        // Luego, envía 'cargo' al backend usando tu servicio.
        this.gestionService.crearGestion(cargo,this.auth.obtenerHeader()).subscribe(
          (response) => {
            swal("Creado Satisfactoriamente", 'La gestión con el nombre ' + this.form.value.nombre + ', se ha creado!!', "success");
            this.form.reset();
            console.log(response);
          },
          (error) => {
            swal("Error al Crear " + this.form.value.nombre, error.error.mensajeHumano,"warning");
          }
        );
      }
    }
  }
}