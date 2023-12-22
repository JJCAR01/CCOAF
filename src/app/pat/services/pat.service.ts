import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatService {
  constructor(private http: HttpClient) {
  }

  crearPat<T>(pat : any,headers?: HttpHeaders):Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}/ccoa/pats`,pat,{headers});
  }

  listarPat<T>(headers?: HttpHeaders):Observable<T>{
    return this.http.get<T>(`${environment.apiUrl}/ccoa/pats`,{headers});
  }
  listarPatPorId<T>(idPat:number,headers?: HttpHeaders):Observable<T>{
    return this.http.get<T>(`${environment.apiUrl}/ccoa/pats/${idPat}`,{headers});
  }
  modificarPat<T>(pat : any,idPat:number,headers?: HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/pats/${idPat}`,pat,{headers});
  }
  eliminarPat<T>(idPat:number,headers?: HttpHeaders):Observable<T>{
    return this.http.delete<T>(`${environment.apiUrl}/ccoa/pats/${idPat}`,{headers});
  }
}
