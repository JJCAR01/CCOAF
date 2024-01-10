import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {

  constructor(private http: HttpClient) {
  }

  crear(proceso : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/procesos`,proceso,{headers});
  }
  listar(headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/procesos`,{headers});
  }
  listarPorId(idProceso:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/procesos/${idProceso}`,{headers});
  }
  modificar(proceso : any,idProceso:number,headers?: HttpHeaders){
    return this.http.put(`${environment.apiUrl}/ccoa/procesos/${idProceso}`,proceso,{headers});
  }
  eliminarTarea(idProceso:number,headers?: HttpHeaders){
    return this.http.delete(`${environment.apiUrl}/ccoa/procesos/${idProceso}`,{headers});
  }

}
