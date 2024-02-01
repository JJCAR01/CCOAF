import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class ObservacionService {

  constructor(private http: HttpClient) {}

  crearObservacion(observacion : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/observacion`,observacion,{headers});
  }

  listarObservacion(headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/observacion`,{headers});
  }
  listarObservacionPorId(idObservacionTarea:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/observacion/${idObservacionTarea}`,{headers});
  }
  listarTareaPorTarea(idTarea:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/observacion/tarea/${idTarea}`,{headers});
  }

}
