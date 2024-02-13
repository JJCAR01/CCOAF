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

  crearGestion<T>(gestion : any,headers?:HttpHeaders):Observable<T>{
    return this.http.post<T>(`${environment.apiUrl}/ccoa/gestiones`,gestion,{headers});
  }
  guardarDocumento<T>(documento : any,idActividadGestion:number,headers?:HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/gestiones/archivo/${idActividadGestion}`, documento,{headers});
  }
  obtenerDocumento<T>(idActividadGestion:number,headers?:HttpHeaders):Observable<T>{
    return this.http.get<T>(`${environment.apiUrl}/ccoa/gestiones/archivo/${idActividadGestion}`,{headers});
  }
  listarGestion<T>(headers?:HttpHeaders):Observable<T>{
    return this.http.get<T>(`${environment.apiUrl}/ccoa/gestiones`,{headers});
  }
  listarGestionPorId<T>(idGestion:number,headers?:HttpHeaders):Observable<T>{
    return this.http.get<T>(`${environment.apiUrl}/ccoa/gestiones/${idGestion}`,{headers});
  }
  listarGestionPorIdPat<T>(idPat:number,headers?:HttpHeaders):Observable<T>{
    return this.http.get<T>(`${environment.apiUrl}/ccoa/gestiones/pat/${idPat}`,{headers});
  }
  modificarActividadGestión<T>(actividadGestion : any,idActividadGestion:number,headers?:HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/gestiones/${idActividadGestion}`,actividadGestion,{headers});
  }
  eliminarGestion<T>(idGestion:number,headers?:HttpHeaders):Observable<T>{
    return this.http.delete<T>(`${environment.apiUrl}/ccoa/gestiones/${idGestion}`,{headers});
  }
  crearObservacionActividadGestion<T>(observacionActividadGestion : any,headers?:HttpHeaders):Observable<T>{
    return this.http.post<T>(`${environment.apiUrl}/ccoa/gestion/observaciones`,observacionActividadGestion,{headers});
  }
  listarObservacionActividadGestion<T>(headers?:HttpHeaders):Observable<T>{
    return this.http.get<T>(`${environment.apiUrl}/ccoa/gestion/observaciones`,{headers});
  }
  listarObservacionActividadGestionPorId<T>(idObservacionActividadGestion:number,headers?:HttpHeaders):Observable<T>{
    return this.http.get<T>(`${environment.apiUrl}/ccoa/gestion/observaciones/${idObservacionActividadGestion}`,{headers});
  }
  listarObservacionPorIdActividadGestion<T>(idActividadGestion: number, headers?:HttpHeaders):Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}/ccoa/gestion/observaciones/gestiones/${idActividadGestion}`, { headers });
  }



  crearActividadEstrategica<T>(actividadEstrategica : any,headers?:HttpHeaders):Observable<T>{
    return this.http.post<T>(`${environment.apiUrl}/ccoa/estrategicas`,actividadEstrategica,{headers});
  }
  listarActividadEstrategica<T>(headers?:HttpHeaders):Observable<T>{
    return this.http.get<T>(`${environment.apiUrl}/ccoa/estrategicas`,{headers});
  }
  listarActividadEstrategicaPorId<T>(idActividadEstrategica:number,headers?:HttpHeaders):Observable<T>{
    return this.http.get<T>(`${environment.apiUrl}/ccoa/estrategicas/${idActividadEstrategica}`,{headers});
  }
  listarActividadEstrategicaPorIdPat<T>(idPat:number,headers?:HttpHeaders):Observable<T>{
    return this.http.get<T>(`${environment.apiUrl}/ccoa/estrategicas/pat/${idPat}`,{headers});
  }
  modificarActividadEstrategica<T>(actividadEstrategica : any,idActividadEstrategica:number,headers?:HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/estrategicas/${idActividadEstrategica}`,actividadEstrategica,{headers});
  }
  modificarResultadoActividadEstrategica<T>(actividadEstrategica : any,idActividadEstrategica:number,headers?:HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/estrategicas/resultado/${idActividadEstrategica}`,actividadEstrategica,{headers});
  }
  eliminarActividadEstrategica<T>(idActividadEstrategica:number,headers?:HttpHeaders):Observable<T>{
    return this.http.delete<T>(`${environment.apiUrl}/ccoa/estrategicas/${idActividadEstrategica}`,{headers});
  }
  crearObservacionActividadEstrategica<T>(observacionActividadEstrategica : any,headers?:HttpHeaders):Observable<T>{
    return this.http.post<T>(`${environment.apiUrl}/ccoa/estrategica/observaciones`,observacionActividadEstrategica,{headers});
  }
  listarObservacionActividadEstrategica<T>(headers?:HttpHeaders):Observable<T>{
    return this.http.get<T>(`${environment.apiUrl}/ccoa/estrategica/observaciones`,{headers});
  }
  listarObservacionActividadEstrategicaPorId<T>(idObservacionActividadEstrategica:number,headers?:HttpHeaders):Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}/ccoa/estrategica/observaciones/${idObservacionActividadEstrategica}`,{headers});
  }
  listarObservacionPorIdActividadEstrategica<T>(idActividadEstrategica: number, headers?:HttpHeaders):Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}/ccoa/estrategica/observaciones/estrategicas/${idActividadEstrategica}`, { headers });
  }

  
}
