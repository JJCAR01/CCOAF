import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  constructor(private http: HttpClient) { }

  crearActividadGestionActividadEstrategica(gestionActividadEstrategica : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/gestionesestrategicas`,gestionActividadEstrategica,{headers});
  }
  guardarDocumento(documento : any,idGestionActividadEstrategica:number,headers?: HttpHeaders){
    return this.http.put(`${environment.apiUrl}/ccoa/gestionesestrategicas/archivo/${idGestionActividadEstrategica}`, documento,{headers});
  }
  obtenerDocumento(idGestionActividadEstrategica:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/gestionesestrategicas/archivo/${idGestionActividadEstrategica}`,{headers});
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
  modificarActividadGestionActividadEstrategica(actividadGestionActividadEstrategica : any,idActividadGestionActividadEstrategica:number,headers?: HttpHeaders){
    return this.http.put(`${environment.apiUrl}/ccoa/gestionesestrategicas/${idActividadGestionActividadEstrategica}`,actividadGestionActividadEstrategica,{headers});
  }
  eliminarActividadGestionActividadEstrategica(idGestionActividadEstrategica:number,headers?: HttpHeaders){
    return this.http.delete(`${environment.apiUrl}/ccoa/gestionesestrategicas/${idGestionActividadEstrategica}`,{headers});
  }
  crearObservacionActividadGestionActividadEstrategica(observacionActividadGestionActividadEstrategica : any,headers?: HttpHeaders): Observable<any[]>{
    return this.http.post<any[]>(`${environment.apiUrl}/ccoa/gestionestrategica/observaciones`,observacionActividadGestionActividadEstrategica,{headers});
  }
  listarObservacionActividadGestionActividadEstrategica(headers?: HttpHeaders): Observable  <any[]>{
    return this.http.get<any[]>(`${environment.apiUrl}/ccoa/gestionestrategica/observaciones`,{headers});
  }
  listarObservacionPorId(idObservacionActividadGestionEstrategica:number,headers?: HttpHeaders) : Observable<any[]>{
    return this.http.get<any[]>(`${environment.apiUrl}/ccoa/gestionestrategica/observaciones/${idObservacionActividadGestionEstrategica}`,{headers});
  }
  listarObservacionPorIdActividadGestionActividadEstrategica(idActividadGestionEstrategica: number, headers?: HttpHeaders): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/ccoa/gestionestrategica/observaciones/gestionesestrategicas/${idActividadGestionEstrategica}`, { headers });
  }


  crearProyecto(proyecto : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/proyectos`,proyecto,{headers});
  }
  guardarDocumentoProyecto(documento : any,idProyecto:number,headers?: HttpHeaders){
    return this.http.put(`${environment.apiUrl}/ccoa/proyectos/archivo/${idProyecto}`, documento,{headers});
  }
  obtenerDocumentoProyecto(idProyecto:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/proyectos/archivo/${idProyecto}`,{headers});
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
  modificarProyecto(proyecto : any,idProyecto:number,headers?: HttpHeaders){
    return this.http.put(`${environment.apiUrl}/ccoa/proyectos/${idProyecto}`,proyecto,{headers});
  }
  eliminarProyecto(idProyecto:number,headers?: HttpHeaders){
    return this.http.delete(`${environment.apiUrl}/ccoa/proyectos/${idProyecto}`,{headers});
  }
  crearObservacionProyecto(observacionProyecto : any,headers?: HttpHeaders): Observable<any[]>{
    return this.http.post<any[]>(`${environment.apiUrl}/ccoa/proyecto/observaciones`,observacionProyecto,{headers});
  }
  listarObservacionProyecto(headers?: HttpHeaders): Observable  <any[]>{
    return this.http.get<any[]>(`${environment.apiUrl}/ccoa/proyecto/observaciones`,{headers});
  }
  listarObservacionProyectoPorId(idObservacionProyecto:number,headers?: HttpHeaders) : Observable<any[]>{
    return this.http.get<any[]>(`${environment.apiUrl}/ccoa/proyecto/observaciones/${idObservacionProyecto}`,{headers});
  }
  listarObservacionPorIdProyecto(idProyecto: number, headers?: HttpHeaders): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/ccoa/proyecto/observaciones/proyectos/${idProyecto}`, { headers });
  }
  
}
