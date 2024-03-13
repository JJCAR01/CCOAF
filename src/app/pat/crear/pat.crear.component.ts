import { Component,OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { PatService } from '../services/pat.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { DireccionService } from 'src/app/direccion/services/direccion.service';
import { Usuario } from 'src/app/modelo/usuario';
import { Direccion } from 'src/app/modelo/direccion';

@Component({
  selector: 'app-root',
  templateUrl: './pat.crear.component.html',
  styleUrls: ['./pat.crear.component.scss']
})
export class PatCrearComponent implements OnInit{
  title = 'crearPat';
  ESTE_CAMPO_ES_OBLIGARORIO: string = 'Este campo es obligatorio*';
  direcciones: Direccion [] = [];
  usuarios: Usuario[] = [];
  form:FormGroup;
  
  constructor(private patService:PatService,private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,private auth:AuthService, private direccionService:DireccionService) 
  { 
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      fechaAnual: [this.obtenerAActual(), Validators.required],
      direccion: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      idUsuario: ['', Validators.required], 
    }); 
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarDirecciones();
  }

  cargarUsuarios() {
    this.usuarioService.listarUsuario(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.usuarios = data.sort((a:any, b:any) => a.nombre.localeCompare(b.nombre));
    });
  }

  cargarDirecciones() {
    this.direccionService.listar(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.direcciones = data.sort((a:any, b:any) => a.nombre.localeCompare(b.nombre));
    })
  }

  crearPat() { 
    if(this.form.valid){
      const nombre = this.form.get('nombre')?.value;
      const fechaAnual = this.form.get('fechaAnual')?.value;
      const direccion = this.form.get('direccion')?.value;
      const fechaInicial = this.form.get('fechaInicial')?.value;
      const fechaFinal = this.form.get('fechaFinal')?.value;
      const idUsuario = this.form.value.idUsuario;
      const pat = {
        nombre: nombre,
        fechaAnual: fechaAnual,
        direccion:direccion,
        fechaInicial:fechaInicial,
        fechaFinal:fechaFinal,
        idUsuario: idUsuario
      }

        this.patService.crearPat(pat,this.auth.obtenerHeader()).subscribe(
          (response) => {
            Swal.fire({
              title:"Creado!!!",
              text:'El PAT se ha creado!!', 
              icon:'success',
              position: "center",
              showConfirmButton: false,
              timer: 1500
            });
            this.form.reset();
          },
          (error) => {
            Swal.fire(
              {
                title:"Error!!!",
                text:error.error.mensajeTecnico, 
                icon:"error",
                confirmButtonColor: '#0E823F',
              }
            );
          }
        );
    } else {
      return Object.values(this.form.controls).forEach(control =>{
        control.markAllAsTouched();
      })
    }
  }

  
  obtenerDireccion(idDireccion: number) {
    const direccion = this.direcciones.find((u:any) => u.idDireccion === idDireccion);
    return direccion ? direccion.nombre : '';
  }

  get nombreVacio(){
    return this.form.get('nombre')?.invalid && this.form.get('nombre')?.touched;
  }
  get fechaAnualVacio(){
    return this.form.get('fechaAnual')?.invalid && this.form.get('fechaAnual')?.touched;
  }
  get direccionVacio(){
    return this.form.get('direccion')?.invalid && this.form.get('direccion')?.touched;
  }
  get fechaInicialVacio(){
    return this.form.get('fechaInicial')?.invalid && this.form.get('fechaInicial')?.touched;
  }
  get fechaFinalVacio(){
    return this.form.get('fechaFinal')?.invalid && this.form.get('fechaFinal')?.touched;
  }
  get idUsuarioVacio(){
    return this.form.get('idUsuario')?.invalid && this.form.get('idUsuario')?.touched;
  }
  private obtenerAActual(): any {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    return `${year}`;
  }
}