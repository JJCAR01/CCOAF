import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PatService {

  constructor(private http: HttpClient) {
  }

  crearPat(pat : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/pats`,pat,{headers});
  }

  listarPat(headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/pats`,{headers});
  }
  eliminarPat(idPat:number,headers?: HttpHeaders){
    return this.http.delete(`${environment.apiUrl}/ccoa/pats/${idPat}`,{headers});
  }
}
