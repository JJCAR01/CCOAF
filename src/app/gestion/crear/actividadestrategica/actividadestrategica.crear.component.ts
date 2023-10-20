import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoGEService } from '../../services/tipoGE.service';
import { PatService } from 'src/app/pat/services/pat.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-epica.crear',
  templateUrl: './actividadestrategica.crear.component.html',
  styleUrls: ['./actividadestrategica.crear.component.scss'],
})
export class ActividadEstrategicaCrearComponent implements OnInit{
  title = 'crearActividadEstrategica';
  usuarios: any[] = [];
  pats: any[] = [];
  form:FormGroup;
  
  constructor(private tipoService: TipoGEService, private formBuilder: FormBuilder,
    private usuarioService: UsuarioService, private patService:PatService
    ,private auth:AuthService) 
  { 
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      idPat: ['', Validators.required],
      idUsuario: ['', Validators.required], 
    }); 
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarPats();
  }

  cargarUsuarios() {
    this.usuarioService.listarUsuario(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.usuarios = data;
    },
      (error) => {
        console.log(error);
      }
    );
  }
  cargarPats() {
    this.patService.listarPat(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.pats = data;
    },
      (error) => {
        console.log(error);
      }
    );
  }

  crearActividadEstrategica() {
    if (this.form.valid) {
      const actividadestrategica = {
        nombre: this.form.get('nombre')?.value,
        fechaInicial: this.form.get('fechaInicial'),
        fechaFinal: this.form.get('fechaFinal'),
        idPat: this.form.get('idPat')?.value,
        idUsuario: this.form.get('idUsuario')?.value
        
      };

      this.tipoService.crearActividadEstrategica(actividadestrategica,this.auth.obtenerHeader()).subscribe(
        (response) => {
          swal("Creado Satisfactoriamente", 'El area con el nombre ' + this.form.value.nombre + this.form.value.apellido + ', se ha creado!!', "success");
            this.form.reset();
          console.log(response);
        },
        (error) => {
          swal(error.error.mensajeHumano,"warning");
        }
      );
    }
    this.form.reset();
  }

}
