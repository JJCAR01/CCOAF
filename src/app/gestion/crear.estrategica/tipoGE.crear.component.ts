import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { TipoGEService } from '../services/tipoGE.service';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/modelo/usuario';
import { EPeriodicidadMeta } from 'src/enums/eperiodicidadmeta';


@Component({
  selector: 'app-tipo-ge.crear',
  templateUrl: './tipoGE.crear.component.html',
  styleUrls: ['./tipoGE.crear.component.scss']
})
export class TipoGECrearComponent implements OnInit {
  title = 'crearActividadEstrategica';
  ESTE_CAMPO_ES_OBLIGARORIO: string = 'Este campo es obligatorio*';
  usuarios: Usuario[] = [];
  periodiciadEnumLista = Object.values(EPeriodicidadMeta);
  patNombre:string | undefined ;
  idPat:number | 0=0;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private auth: AuthService,
    private tipoService:TipoGEService, private usuarioService:UsuarioService,
    private route: ActivatedRoute) {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      unidad:['',Validators.required],
      meta: ['', Validators.required],
      entregable: ['',Validators.required],
      periodicidadMeta: ['', Validators.required],
      resultadoMeta: [0, Validators.required],
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
      const unidad = this.form.get('unidad')?.value;
      const meta = this.form.get('meta')?.value;
      const entregable = this.form.get('entregable')?.value;
      const periodicidadMeta = this.form.get('periodicidadMeta')?.value;
      const resultadoMeta = this.form.get('resultadoMeta')?.value;
      const idUsuario = this.form.get('idUsuario')?.value;
      const idPat = this.idPat

        const actividad = {
          nombre: nombre,
          fechaInicial: fechaInicial,
          fechaFinal: fechaFinal,
          resultadoMeta:resultadoMeta,
          unidad:unidad,
          meta:meta,
          entregable:entregable,
          periodicidadMeta:periodicidadMeta,
          idPat:idPat, 
          idUsuario: idUsuario,
        };
          this.tipoService.crearActividadEstrategica(actividad,this.auth.obtenerHeader()).subscribe(
            (response) => {
              Swal.fire({
                title:"Creado!!!",
                text: 'La actividad estratégica se ha creado!!',
                icon:'success',
                position: "center",
                showConfirmButton: false,
                timer: 1500
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
    } else {
      return Object.values(this.form.controls).forEach(control =>{
        control.markAllAsTouched();
      })
    }
  }

  get nombreVacio(){
    return this.form.get('nombre')?.invalid && this.form.get('nombre')?.touched;
  }
  get fechaInicialVacio(){
    return this.form.get('fechaInicial')?.invalid && this.form.get('fechaInicial')?.touched;
  }
  get fechaFinalVacio(){
    return this.form.get('fechaFinal')?.invalid && this.form.get('fechaFinal')?.touched;
  }
  get metaVacio(){
    return this.form.get('meta')?.invalid && this.form.get('meta')?.touched;
  }
  get entregableVacio(){
    return this.form.get('entregable')?.invalid && this.form.get('entregable')?.touched;
  }
  get idUsuarioVacio(){
    return this.form.get('idUsuario')?.invalid && this.form.get('idUsuario')?.touched;
  }
  get periodicidadVacio(){
    return this.form.get('periodicidadMeta')?.invalid && this.form.get('periodicidadMeta')?.touched;
  }
  get unidadVacio(){
    return this.form.get('unidad')?.invalid && this.form.get('unidad')?.touched;
  }
}
