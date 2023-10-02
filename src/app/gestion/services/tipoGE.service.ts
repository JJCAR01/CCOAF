import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TipoGEService {

  constructor(private http: HttpClient) {
  }

  crearGestion(gestion : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/gestiones`,gestion,{headers});
  }
  crearEpica(epica : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/tareas`,epica,{headers});
  }

  listarGestion(headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/gestiones`,{headers});
  }
  listarEpica(headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/tareas`,{headers});
  }

  eliminarGestion(idGestion:number,headers?: HttpHeaders){
    return this.http.delete(`${environment.apiUrl}/ccoa/gestiones/${idGestion}`,{headers});
  }
  eliminarEpica(idEpica:number,headers?: HttpHeaders){
    return this.http.delete(`${environment.apiUrl}/ccoa/tareas/${idEpica}`,{headers});
  }
}
