import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { TipoGEService } from '../../services/tipoGE.service';  
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/login/auth/auth.service';
import swal from 'sweetalert';
import { PatService } from 'src/app/pat/services/pat.service';

@Component({
  selector: 'app-gestion.crear',
  templateUrl: './gestion.crear.component.html',
  styleUrls: ['./gestion.crear.component.scss'],
})
export class GestionCrearComponent {
  title = 'crearGestion';
  pats: any[] = [];
  patSeleccionado: string | null = null;
  idPatSeleccionado: number | null = null;
  form: FormGroup;
  
  constructor(private tipoService: TipoGEService, private formBuilder: FormBuilder,
    private patService: PatService, private auth: AuthService,
    private route: ActivatedRoute,) {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const idPat = params['idPat'];
      const patSeleccionado = this.pats.find(pat => pat.idPat === idPat);
      this.patSeleccionado = patSeleccionado ? patSeleccionado.nombre : null;
      if (idPat) {
        this.cargarPats(idPat);
      }
    });
  }


  cargarPats(idPat: number) {
    this.patService.listarPatPorId(idPat, this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.patSeleccionado = data.nombre;
        this.idPatSeleccionado = data.idPat;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  crearGestion() { 
    if (this.form.valid && this.patSeleccionado !== null) {
      const nombre = this.form.get('nombre')?.value;
  
      if (nombre !== null && this.idPatSeleccionado !== null) {
        const gestion = {
          nombre: nombre,
          idPat: this.idPatSeleccionado,
        };
        // Luego, envía 'gestion' al backend usando tu servicio.
        this.tipoService.crearGestion(gestion, this.auth.obtenerHeader()).subscribe(
          (response) => {
            swal("Creado Satisfactoriamente", 'El área con el nombre ' + nombre + ', se ha creado!!', "success");
            this.form.reset();
            console.log(response);
          },
          (error) => {
            swal("Error en la solicitud al backend:", error.error.mensajeTecnico);
          }
        );
      }
    }
  }
}
