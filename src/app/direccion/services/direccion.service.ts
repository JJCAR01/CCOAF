import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {

  constructor(private http: HttpClient) {
  }

  crear(direccion : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/direcciones`,direccion,{headers});
  }
  listar(headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/direcciones`,{headers});
  }
  listarPorId(idDireccion:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/direcciones/${idDireccion}`,{headers});
  }
  modificar(direccion : any,idDireccion:number,headers?: HttpHeaders){
    return this.http.put(`${environment.apiUrl}/ccoa/direcciones/${idDireccion}`,direccion,{headers});
  }
  eliminarTarea(idDireccion:number,headers?: HttpHeaders){
    return this.http.delete(`${environment.apiUrl}/ccoa/direcciones/${idDireccion}`,{headers});
  }

}
