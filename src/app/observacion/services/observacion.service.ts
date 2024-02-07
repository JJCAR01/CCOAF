import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class ObservacionService {

  constructor(private http: HttpClient) {}

  crearObservacion(observacion : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/tarea/observaciones`,observacion,{headers});
  }
  listarObservacion(headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/tarea/observaciones`,{headers});
  }
  listarObservacionPorId(idObservacionTarea:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/tarea/observaciones/${idObservacionTarea}`,{headers});
  }
  listarTareaPorTarea(idTarea:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/tarea/observaciones/tareas/${idTarea}`,{headers});
  }

}
