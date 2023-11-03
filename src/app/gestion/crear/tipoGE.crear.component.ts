import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login/auth/auth.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-tipo-ge.crear',
  templateUrl: './tipoGE.crear.component.html',
  styleUrls: ['./tipoGE.crear.component.scss']
})
export class TipoGECrearComponent implements OnInit {
  title = 'crearTipoGE';
  usuarios: any[] = [];
  form: FormGroup;
  tipoActividad: string = ''; // Variable para rastrear el tipo de actividad

  constructor(private formBuilder: FormBuilder, private auth: AuthService) {
    this.form = this.formBuilder.group({
      nombreActividad: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Puedes cargar los usuarios aquí si es necesario.
  }


  seleccionarTipoActividad(tipo: string) {
    this.tipoActividad = tipo;
  }

  crearActividad() {
    if (this.form.valid && this.tipoActividad) {
      const nombreActividad = this.form.get('nombreActividad')?.value;
      const fechaInicial = this.form.get('fechaInicial')?.value;
      const fechaFinal = this.form.get('fechaFinal')?.value;

      if (nombreActividad) {
        // Aquí puedes enviar los datos al backend según el tipo de actividad
        if (this.tipoActividad === 'estrategica') {
          // Lógica para crear una actividad estratégica
          // Debes implementar esta lógica en tu aplicación
          // Llama a tu servicio para crear una actividad estratégica aquí
        } else if (this.tipoActividad === 'gestion') {
          // Lógica para crear una actividad de gestión
          // Debes implementar esta lógica en tu aplicación
          // Llama a tu servicio para crear una actividad de gestión aquí
        }

        swal("Creado Satisfactoriamente", `La actividad ${this.tipoActividad} con el nombre '${nombreActividad}' se ha creado!!`, "success");
        this.form.reset();
        this.tipoActividad = ''; // Reinicia el tipo de actividad
      }
    }
  }
    
}
