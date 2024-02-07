import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SprintService {

  constructor(private http: HttpClient) {
  }

  crearSprint(sprint : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/sprints`,sprint,{headers});
  }
  guardarDocumentoSprint(sprint : any,idSprint:number,headers?: HttpHeaders){
    return this.http.put(`${environment.apiUrl}/ccoa/sprints/archivo/${idSprint}`, sprint,{headers});
  }
  obtenerDocumento(idSprint:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/sprints/archivo/${idSprint}`,{headers});
  }
  listarSprint(headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/sprints`,{headers});
  }
  listarSprintPorId(idSprint:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/sprints/${idSprint}`,{headers});
  }
  listarSprintPorProyecto(idProyecto:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/sprints/proyecto/${idProyecto}`,{headers});
  }
  modificarSprint(sprint : any,idSprint:number,headers?: HttpHeaders){
    return this.http.put(`${environment.apiUrl}/ccoa/sprints/${idSprint}`,sprint,{headers});
  }
  eliminarSprint(idSprint:number,headers?: HttpHeaders){
    return this.http.delete(`${environment.apiUrl}/ccoa/sprints/${idSprint}`,{headers});
  }
  crearObservacionSprint(observacionSprint : any,headers?: HttpHeaders): Observable<any[]>{
    return this.http.post<any[]>(`${environment.apiUrl}/ccoa/sprint/observaciones`,observacionSprint,{headers});
  }
  listarObservacionSprint(headers?: HttpHeaders): Observable  <any[]>{
    return this.http.get<any[]>(`${environment.apiUrl}/ccoa/sprint/observaciones`,{headers});
  }
  listarObservacionSprintPorId(idObservacionSprint:number,headers?: HttpHeaders) : Observable<any[]>{
    return this.http.get<any[]>(`${environment.apiUrl}/ccoa/sprint/observaciones/${idObservacionSprint}`,{headers});
  }
  listarPorIdSprint(idSprint: number, headers?: HttpHeaders): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/ccoa/sprint/observaciones/sprints/${idSprint}`, { headers });
  }
}
