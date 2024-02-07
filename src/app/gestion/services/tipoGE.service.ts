import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoGEService {

  constructor(private http: HttpClient) {
  }

  crearGestion(gestion : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/gestiones`,gestion,{headers});
  }
  guardarDocumento(documento : any,idActividadGestion:number,headers?: HttpHeaders){
    return this.http.put(`${environment.apiUrl}/ccoa/gestiones/archivo/${idActividadGestion}`, documento,{headers});
  }
  obtenerDocumento(idActividadGestion:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/gestiones/archivo/${idActividadGestion}`,{headers});
  }
  listarGestion(headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/gestiones`,{headers});
  }
  listarGestionPorId(idGestion:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/gestiones/${idGestion}`,{headers});
  }
  listarGestionPorIdPat(idPat:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/gestiones/pat/${idPat}`,{headers});
  }
  modificarActividadGestión(actividadGestion : any,idActividadGestion:number,headers?: HttpHeaders){
    return this.http.put(`${environment.apiUrl}/ccoa/gestiones/${idActividadGestion}`,actividadGestion,{headers});
  }
  eliminarGestion(idGestion:number,headers?: HttpHeaders){
    return this.http.delete(`${environment.apiUrl}/ccoa/gestiones/${idGestion}`,{headers});
  }
  crearObservacionActividadGestion(observacionActividadGestion : any,headers?: HttpHeaders): Observable<any[]>{
    return this.http.post<any[]>(`${environment.apiUrl}/ccoa/gestion/observaciones`,observacionActividadGestion,{headers});
  }
  listarObservacionActividadGestion(headers?: HttpHeaders): Observable  <any[]>{
    return this.http.get<any[]>(`${environment.apiUrl}/ccoa/gestion/observaciones`,{headers});
  }
  listarObservacionActividadGestionPorId(idObservacionActividadGestion:number,headers?: HttpHeaders) : Observable<any[]>{
    return this.http.get<any[]>(`${environment.apiUrl}/ccoa/gestion/observaciones/${idObservacionActividadGestion}`,{headers});
  }
  listarObservacionPorIdActividadGestion(idActividadGestion: number, headers?: HttpHeaders): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/ccoa/gestion/observaciones/gestiones/${idActividadGestion}`, { headers });
  }



  crearActividadEstrategica(actividadEstrategica : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/estrategicas`,actividadEstrategica,{headers});
  }
  listarActividadEstrategica(headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/estrategicas`,{headers});
  }
  listarActividadEstrategicaPorId(idActividadEstrategica:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/estrategicas/${idActividadEstrategica}`,{headers});
  }
  listarActividadEstrategicaPorIdPat(idPat:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/estrategicas/pat/${idPat}`,{headers});
  }
  modificarActividadEstrategica(actividadEstrategica : any,idActividadEstrategica:number,headers?: HttpHeaders){
    return this.http.put(`${environment.apiUrl}/ccoa/estrategicas/${idActividadEstrategica}`,actividadEstrategica,{headers});
  }
  eliminarActividadEstrategica(idActividadEstrategica:number,headers?: HttpHeaders){
    return this.http.delete(`${environment.apiUrl}/ccoa/estrategicas/${idActividadEstrategica}`,{headers});
  }
  crearObservacionActividadEstrategica(observacionActividadEstrategica : any,headers?: HttpHeaders): Observable<any[]>{
    return this.http.post<any[]>(`${environment.apiUrl}/ccoa/estrategica/observaciones`,observacionActividadEstrategica,{headers});
  }
  listarObservacionActividadEstrategica(headers?: HttpHeaders): Observable  <any[]>{
    return this.http.get<any[]>(`${environment.apiUrl}/ccoa/estrategica/observaciones`,{headers});
  }
  listarObservacionActividadEstrategicaPorId(idObservacionActividadEstrategica:number,headers?: HttpHeaders) : Observable<any[]>{
    return this.http.get<any[]>(`${environment.apiUrl}/ccoa/estrategica/observaciones/${idObservacionActividadEstrategica}`,{headers});
  }
  listarObservacionPorIdActividadEstrategica(idActividadEstrategica: number, headers?: HttpHeaders): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/ccoa/estrategica/observaciones/estrategicas/${idActividadEstrategica}`, { headers });
  }

  
}
