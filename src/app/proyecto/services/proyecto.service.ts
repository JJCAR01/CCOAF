import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  constructor(private http: HttpClient) {
  }

  crearProyecto(proyecto : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/proyectos`,proyecto,{headers});
  }

  listarProyectos(headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/proyectos`,{headers});
  }
  listarProyectoPorId(idProyecto:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/proyectos/${idProyecto}`,{headers});
  }
  listarProyectoPorIdActividadEstrategica(idProyecto:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/proyectos/estrategica/${idProyecto}`,{headers});
  }
  eliminarProyecto(idProyecto:number,headers?: HttpHeaders){
    return this.http.delete(`${environment.apiUrl}/ccoa/proyectos/${idProyecto}`,{headers});
  }
}
