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
  modificarObservacionActividadGestion<T>(observacionActividadGestion : any,idObservacionActividadGestion:number,headers?: HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/gestion/observaciones/${idObservacionActividadGestion}`,observacionActividadGestion,{headers});
  }
  eliminarObservacionActividadGestion<T>(idObservacionActividadGestion:number,headers?: HttpHeaders):Observable<T>{
    return this.http.delete<T>(`${environment.apiUrl}/ccoa/gestion/observaciones/${idObservacionActividadGestion}`,{headers});
  }



  crearActividadEstrategica<T>(actividadEstrategica : any,headers?:HttpHeaders):Observable<T>{
    return this.http.post<T>(`${environment.apiUrl}/ccoa/estrategicas`,actividadEstrategica,{headers});
  }
  guardarDocumentoAcividadEstrategica<T>(documento : any,idActividadEstrategica:number,headers?:HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/estrategicas/archivo/${idActividadEstrategica}`, documento,{headers});
  }
  obtenerDocumentoActividadEstrategica<T>(idActividadEstrategica:number,headers?:HttpHeaders):Observable<T>{
    return this.http.get<T>(`${environment.apiUrl}/ccoa/estrategicas/archivo/${idActividadEstrategica}`,{headers});
  }
  modificarDocumentoActividadEstrategica<T>(documento : any,idActividadEstrategica:number,headers?:HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/estrategicas/archivo/modificar/${idActividadEstrategica}`,documento,{headers});
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
  modificarResultadoMetaActividadEstrategica<T>(actividadEstrategica : any,idActividadEstrategica:number,headers?:HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/estrategicas/meta/${idActividadEstrategica}`,actividadEstrategica,{headers});
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
  modificarObservacionActividadEstrategica<T>(observacionActividadEstrategica : any,idObservacionActividadEstrategica:number,headers?: HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/estrategica/observaciones/${idObservacionActividadEstrategica}`,observacionActividadEstrategica,{headers});
  }
  eliminarObservacionActividadEstrategica<T>(idObservacionActividadEstrategica:number,headers?: HttpHeaders):Observable<T>{
    return this.http.delete<T>(`${environment.apiUrl}/ccoa/estrategica/observaciones/${idObservacionActividadEstrategica}`,{headers});
  }

  

  crearProyectoArea<T>(ProyectoArea : any,headers?:HttpHeaders):Observable<T>{
    return this.http.post<T>(`${environment.apiUrl}/ccoa/proyectosarea`,ProyectoArea,{headers});
  }
  guardarDocumentoProyectoArea<T>(documento : any,idProyectoArea:number,headers?:HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/proyectosarea/archivo/${idProyectoArea}`, documento,{headers});
  }
  obtenerDocumentoProyectoArea<T>(idProyectoArea:number,headers?:HttpHeaders):Observable<T>{
    return this.http.get<T>(`${environment.apiUrl}/ccoa/proyectosarea/archivo/${idProyectoArea}`,{headers});
  }
  listarProyectoArea<T>(headers?:HttpHeaders):Observable<T>{
    return this.http.get<T>(`${environment.apiUrl}/ccoa/proyectosarea`,{headers});
  }
  listarProyectoAreaPorId<T>(idProyectoArea:number,headers?:HttpHeaders):Observable<T>{
    return this.http.get<T>(`${environment.apiUrl}/ccoa/proyectosarea/${idProyectoArea}`,{headers});
  }
  listarProyectoAreaPorIdPat<T>(idPat:number,headers?:HttpHeaders):Observable<T>{
    return this.http.get<T>(`${environment.apiUrl}/ccoa/proyectosarea/pat/${idPat}`,{headers});
  }
  modificarProyectoArea<T>(ProyectoArea : any,idProyectoArea:number,headers?:HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/proyectosarea/${idProyectoArea}`,ProyectoArea,{headers});
  }
  modificarValorEjecutado(ProyectoArea : any,idProyectoArea:number,headers?: HttpHeaders){
    return this.http.put(`${environment.apiUrl}/ccoa/proyectosarea/valor-ejecutado/${idProyectoArea}`,ProyectoArea,{headers});
  }
  eliminarProyectoArea<T>(idProyectoArea:number,headers?:HttpHeaders):Observable<T>{
    return this.http.delete<T>(`${environment.apiUrl}/ccoa/proyectosarea/${idProyectoArea}`,{headers});
  }

  crearObservacionProyectoArea<T>(observacionProyectoArea : any,headers?:HttpHeaders):Observable<T>{
    return this.http.post<T>(`${environment.apiUrl}/ccoa/proyectoarea/observaciones`,observacionProyectoArea,{headers});
  }
  listarObservacionProyectoArea<T>(headers?:HttpHeaders):Observable<T>{
    return this.http.get<T>(`${environment.apiUrl}/ccoa/proyectoarea/observaciones`,{headers});
  }
  listarObservacionProyectoAreaPorId<T>(idObservacionProyectoArea:number,headers?:HttpHeaders):Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}/ccoa/proyectoarea/observaciones/${idObservacionProyectoArea}`,{headers});
  }
  listarObservacionPorIdProyectoArea<T>(idProyectoArea: number, headers?:HttpHeaders):Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}/ccoa/proyectoarea/observaciones/proyectosarea/${idProyectoArea}`, { headers });
  }
  modificarObservacionProyectoArea<T>(observacionProyectoArea : any,idObservacionProyectoArea:number,headers?: HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/proyectoarea/observaciones/${idObservacionProyectoArea}`,observacionProyectoArea,{headers});
  }
  eliminarObservacionProyectoArea<T>(idObservacionProyectoArea:number,headers?: HttpHeaders):Observable<T>{
    return this.http.delete<T>(`${environment.apiUrl}/ccoa/proyectoarea/observaciones/${idObservacionProyectoArea}`,{headers});
  }



  
}
