import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { TipoGEService } from '../services/tipoGE.service';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tipo-ge.crear',
  templateUrl: './tipoGE.crear.component.html',
  styleUrls: ['./tipoGE.crear.component.scss']
})
export class TipoGECrearComponent implements OnInit {
  title = 'crearActividadEstrategica';
  usuarios: any[] = [];
  form: FormGroup;
  patNombre:any;
  idPat:any;

  constructor(private formBuilder: FormBuilder, private auth: AuthService,
    private tipoService:TipoGEService, private usuarioService:UsuarioService,
    private route: ActivatedRoute) {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      idUsuario: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idPat = params['idPat'];
      this.patNombre = params['patNombre'];
    })
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.listarUsuario(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.usuarios = data;
    });
  }

  crearActividad() {
    if (this.form.valid) {
      const nombre = this.form.get('nombre')?.value;
      const fechaInicial = this.form.get('fechaInicial')?.value;
      const fechaFinal = this.form.get('fechaFinal')?.value;
      const idUsuario = this.form.get('idUsuario')?.value;
      const idPat = this.idPat

        const actividad = {
          nombre: nombre,
          fechaInicial: fechaInicial,
          fechaFinal: fechaFinal,
          idPat:idPat, 
          idUsuario: idUsuario,
        };
          this.tipoService.crearActividadEstrategica(actividad,this.auth.obtenerHeader()).subscribe(
            (response) => {
              Swal.fire({
                title:"Creado!!!",
                text: 'La actividad estratégica se ha creada!!',
                icon: "success",
                confirmButtonColor: '#0E823F',
              });
              this.form.reset();
            },
            (error) => {
              Swal.fire({
                title:'Solicitud no válida!',
                text: error.error.mensajeTecnico,
                icon: "error",
                confirmButtonColor: '#0E823F',
              });
            }
          );
  }
  }
}
