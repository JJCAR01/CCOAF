import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  guardarDocumentoSprint(documento : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/sprints/archivo`,documento,{headers});
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
}
