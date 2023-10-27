import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  listarTareaPorActvidadGestionActividadEstrategica(idASE:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/tareas/actividad/${idASE}`,{headers});
  }
  modificarTarea(tarea : any,idTarea:number,headers?: HttpHeaders){
    return this.http.put(`${environment.apiUrl}/ccoa/tareas/${idTarea}`,tarea,{headers});
  }
  eliminarTarea(idTarea:number,headers?: HttpHeaders){
    return this.http.delete(`${environment.apiUrl}/ccoa/tareas/${idTarea}`,{headers});
  }
}