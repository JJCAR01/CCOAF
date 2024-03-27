import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ServicesSprintProyectoAreaService {

  constructor(private http: HttpClient) { }

  crearSprintProyectoArea(sprint : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/sprintsproyectoarea`,sprint,{headers});
  }
  guardarDocumentoSprintProyectoArea(sprint : any,idSprintProyectoArea:number,headers?: HttpHeaders){
    return this.http.put(`${environment.apiUrl}/ccoa/sprintsproyectoarea/archivo/${idSprintProyectoArea}`, sprint,{headers});
  }
  obtenerDocumento(idSprintProyectoArea:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/sprintsproyectoarea/archivo/${idSprintProyectoArea}`,{headers});
  }
  modificarDocumentoSprintProyectoArea<T>(documento : any,idSprintProyectoArea:number,headers?:HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/sprintsproyectoarea/archivo/modificar/${idSprintProyectoArea}`,documento,{headers});
  }
  eliminarDocumentoSprintProyectoArea<T>(idDocumentoSprintProyectoArea:number,headers?:HttpHeaders):Observable<T>{
    return this.http.delete<T>(`${environment.apiUrl}/ccoa/sprintsproyectoarea/archivo/eliminar/${idDocumentoSprintProyectoArea}`,{headers});
  }
  listarSprintProyectoArea(headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/sprintsproyectoarea`,{headers});
  }
  listarSprintProyectoAreaPorId(idSprintProyectoArea:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/sprintsproyectoarea/${idSprintProyectoArea}`,{headers});
  }
  listarSprintProyectoAreaPorProyecto(idProyecto:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/sprintsproyectoarea/proyecto/${idProyecto}`,{headers});
  }
  modificarSprintProyectoArea(sprint : any,idSprintProyectoArea:number,headers?: HttpHeaders){
    return this.http.put(`${environment.apiUrl}/ccoa/sprintsproyectoarea/${idSprintProyectoArea}`,sprint,{headers});
  }
  eliminarSprintProyectoArea(idSprintProyectoArea:number,headers?: HttpHeaders){
    return this.http.delete(`${environment.apiUrl}/ccoa/sprintsproyectoarea/${idSprintProyectoArea}`,{headers});
  }
  crearObservacionSprintProyectoArea(observacionSprintProyectoArea : any,headers?: HttpHeaders): Observable<any[]>{
    return this.http.post<any[]>(`${environment.apiUrl}/ccoa/sprintproyectoarea/observaciones`,observacionSprintProyectoArea,{headers});
  }
  listarObservacionSprintProyectoArea(headers?: HttpHeaders): Observable  <any[]>{
    return this.http.get<any[]>(`${environment.apiUrl}/ccoa/sprintproyectoarea/observaciones`,{headers});
  }
  listarObservacionSprintProyectoAreaPorId(idObservacionSprintProyectoArea:number,headers?: HttpHeaders) : Observable<any[]>{
    return this.http.get<any[]>(`${environment.apiUrl}/ccoa/sprintproyectoarea/observaciones/${idObservacionSprintProyectoArea}`,{headers});
  }
  listarPorIdSprintProyectoArea(idSprintProyectoArea: number, headers?: HttpHeaders): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/ccoa/sprintproyectoarea/observaciones/sprints/${idSprintProyectoArea}`, { headers });
  }
  modificarObservacionSprintProyectoArea<T>(observacionSprintProyectoArea : any,idObservacionSprintProyectoArea:number,headers?: HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/sprintproyectoarea/observaciones/${idObservacionSprintProyectoArea}`,observacionSprintProyectoArea,{headers});
  }
  eliminarObservacionSprintProyectoArea<T>(idObservacionSprintProyectoArea:number,headers?: HttpHeaders):Observable<T>{
    return this.http.delete<T>(`${environment.apiUrl}/ccoa/sprintproyectoarea/observaciones/${idObservacionSprintProyectoArea}`,{headers});
  }
}
