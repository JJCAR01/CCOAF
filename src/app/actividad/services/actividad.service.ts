import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  constructor(private http: HttpClient) { }

  crearActividadGestionActividadEstrategica(gestionActividadEstrategica : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/gestionesestrategicas`,gestionActividadEstrategica,{headers});
  }
  listarActividadGestionActividadEstrategica(headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/gestionesestrategicas`,{headers});
  }
  listarActividadGestionActividadEstrategicaPorId(idGestionActividadEstrategica:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/gestionesestrategicas/${idGestionActividadEstrategica}`,{headers});
  }
  listarActividadGestionActividadEstrategicaPorIdActividadEstrategica(idActividadEstrategica:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/gestionesestrategicas/actividad/${idActividadEstrategica}`,{headers});
  }
  eliminarActividadGestionActividadEstrategica(idGestionActividadEstrategica:number,headers?: HttpHeaders){
    return this.http.delete(`${environment.apiUrl}/ccoa/gestionesestrategicas/${idGestionActividadEstrategica}`,{headers});
  }


  crearProyecto(proyecto : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/proyectos`,proyecto,{headers});
  }
  listarProyecto(headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/proyectos`,{headers});
  }
  listarProyectoPorId(idProyecto:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/proyectos/${idProyecto}`,{headers});
  }
  listarProyectoPorIdActividadEstrategica(idActividadEstrategica:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/proyectos/actividad/${idActividadEstrategica}`,{headers});
  }
  eliminarProyecto(idProyecto:number,headers?: HttpHeaders){
    return this.http.delete(`${environment.apiUrl}/ccoa/proyectos/${idProyecto}`,{headers});
  }
}
