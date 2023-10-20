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
  listarGestion(headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/gestiones`,{headers});
  }
  listarGestionPorId(idGestion:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/gestiones/${idGestion}`,{headers});
  }
  listarGestionPorIdPat(idPat:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/gestiones/pat/${idPat}`,{headers});
  }
  eliminarGestion(idGestion:number,headers?: HttpHeaders){
    return this.http.delete(`${environment.apiUrl}/ccoa/gestiones/${idGestion}`,{headers});
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
  eliminarActividadEstrategica(idActividadEstrategica:number,headers?: HttpHeaders){
    return this.http.delete(`${environment.apiUrl}/ccoa/estrategicas/${idActividadEstrategica}`,{headers});
  }
}
