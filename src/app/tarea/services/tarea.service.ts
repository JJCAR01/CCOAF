import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  constructor(private http: HttpClient) {
  }

  crearTarea(tarea : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/tareas`,tarea,{headers});
  }

  guardarDocumentoTarea(tarea : any,idTarea:number,headers?: HttpHeaders){
    return this.http.put(`${environment.apiUrl}/ccoa/tareas/archivo/${idTarea}`, tarea,{headers});
  }
  obtenerDocumentoTarea(idTarea:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/tareas/archivo/${idTarea}`,{headers});
  }

  listarTarea(headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/tareas`,{headers});
  }
  listarTareaPorId(idTarea:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/tareas/${idTarea}`,{headers});
  }

  listarTareaPorActvidadGestion(idASE:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/tareas/gestion/${idASE}`,{headers});
  }
  listarTareaPorSprint(idASE:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/tareas/sprint/${idASE}`,{headers});
  }
  listarTareaPorSprintProyectoArea(idASE:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/tareas/sprintproyectoarea/${idASE}`,{headers});
  }
  listarTareaPorActvidadGestionActividadEstrategica(idASE:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/tareas/actividad/${idASE}`,{headers});
  }
  modificarTarea(tarea : any,idTarea:number,headers?: HttpHeaders){
    return this.http.put(`${environment.apiUrl}/ccoa/tareas/${idTarea}`,tarea,{headers});
  }
  modificarEstadoTarea(tarea : any,idTarea:number,headers?: HttpHeaders){
    return this.http.put(`${environment.apiUrl}/ccoa/tareas/estado/${idTarea}`,tarea,{headers});
  }
  modificarPorcentajeTarea(tarea : any,idTarea:number,headers?: HttpHeaders){
    return this.http.put(`${environment.apiUrl}/ccoa/tareas/porcentaje/${idTarea}`,tarea,{headers});
  }
  eliminarTarea(idTarea:number,headers?: HttpHeaders){
    return this.http.delete(`${environment.apiUrl}/ccoa/tareas/${idTarea}`,{headers});
  }

  crearObservacion(observacion : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/tarea/observaciones`,observacion,{headers});
  }
  listarObservacion(headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/tarea/observaciones`,{headers});
  }
  listarObservacionPorId(idObservacionTarea:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/tarea/observaciones/${idObservacionTarea}`,{headers});
  }
  listarPorIdTarea(idTarea:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/tarea/observaciones/tareas/${idTarea}`,{headers});
  }
  modificarObservacionTarea<T>(observacionTarea : any,idObservacionTarea:number,headers?: HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/tarea/observaciones/${idObservacionTarea}`,observacionTarea,{headers});
  }
  eliminarObservacionTarea<T>(idObservacionTarea:number,headers?: HttpHeaders):Observable<T>{
    return this.http.delete<T>(`${environment.apiUrl}/ccoa/tarea/observaciones/${idObservacionTarea}`,{headers});
  }
}