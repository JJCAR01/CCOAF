import { Component,OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { PatService } from '../services/pat.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { Pat } from './pat';
import { EProceso } from '../listar/eproceso';

@Component({
  selector: 'app-root',
  templateUrl: './pat.crear.component.html',
  styleUrls: ['./pat.crear.component.scss']
})
export class PatCrearComponent implements OnInit{
  title = 'crearPat';
  procesosEnumList: string[] = [];
  pat:Pat = new Pat();
  usuarios: any[] = [];
  form:FormGroup;
  
  constructor(private patService:PatService,private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,private auth:AuthService) 
  { this.form = this.formBuilder.group({
    nombre: ['', Validators.required],
    fechaAnual: ['', Validators.required],
    proceso: ['', Validators.required],
    idUsuario: ['', Validators.required], 
  }); }

  ngOnInit(): void {
    this.procesosEnumList = Object.values(EProceso);
    this.cargarUsuarios();
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

  crearPat() { 
    this.pat.nombre = this.form.value.nombre;
    this.pat.fechaAnual = this.form.value.fechaAnual;
    this.pat.proceso = this.form.value.proceso.toUpperCase().replace(/\s+/g, '_');
    this.pat.idUsuario = this.form.value.idUsuario;
        // Luego, envía 'cargo' al backend usando tu servicio.
        this.patService.crearPat(this.pat,this.auth.obtenerHeader()).subscribe(
          (response) => {
            Swal.fire("Creado Satisfactoriamente", 'El pat con el nombre ' + this.form.value.nombre + ', se ha creado!!', "success");
            this.form.reset();
            console.log(response);
          },
          (error) => {
            Swal.fire("Error",error.error.mensajeTecnico,"error");
          }
        );
  }
}