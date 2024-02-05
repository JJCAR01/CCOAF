import { Component,OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';
import { PatService } from '../services/pat.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';
import { Pat } from './pat';
import { ProcesoService } from 'src/app/proceso/services/proceso.service';
import { DireccionService } from 'src/app/direccion/services/direccion.service';

@Component({
  selector: 'app-root',
  templateUrl: './pat.crear.component.html',
  styleUrls: ['./pat.crear.component.scss']
})
export class PatCrearComponent implements OnInit{
  title = 'crearPat';
  procesos: any;
  direcciones: any;
  pat:Pat = new Pat();
  usuarios: any[] = [];
  form:FormGroup;
  
  constructor(private patService:PatService,private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,private auth:AuthService,
    private procesoService:ProcesoService, private direccionService:DireccionService) 
  { this.form = this.formBuilder.group({
    nombre: ['', Validators.required],
    fechaAnual: ['', Validators.required],
    direccion: ['', Validators.required],
    proceso: ['', Validators.required],
    idUsuario: ['', Validators.required], 
    }); 
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarDirecciones()
    this.cargarProcesos()
  }

  cargarUsuarios() {
    this.usuarioService.listarUsuario(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.usuarios = data;
    });
  }

  cargarProcesos() {
    this.procesoService.listar(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.procesos = data;
    })
  }
  cargarDirecciones() {
    this.direccionService.listar(this.auth.obtenerHeader()).subscribe(
      (data: any) => {
        this.direcciones = data;
    })
  }

  crearPat() { 
    if(this.form.valid){
    this.pat.nombre = this.form.value.nombre;
    this.pat.fechaAnual = this.form.value.fechaAnual;
    this.pat.direccion = this.form.value.direccion;
    this.pat.proceso = this.form.value.proceso;
    this.pat.idUsuario = this.form.value.idUsuario;
        this.patService.crearPat(this.pat,this.auth.obtenerHeader()).subscribe(
          (response) => {
            Swal.fire({
              title:"Creado!!!",
              text:'El pat se ha creado!!', 
              icon:"success",
              showCancelButton: true,
              cancelButtonText: "Cancelar",
              confirmButtonText: "Confirmar",
              confirmButtonColor: '#0E823F',
              reverseButtons: true, 
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

  
  obtenerProceso(idProceso: number) {
    const proceso = this.procesos.find((u:any) => u.idProceso === idProceso);
    return proceso ? proceso.nombre : '';
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
  get procesoVacio(){
    return this.form.get('proceso')?.invalid && this.form.get('proceso')?.touched;
  }
  get idUsuarioVacio(){
    return this.form.get('idUsuario')?.invalid && this.form.get('idUsuario')?.touched;
  }
}