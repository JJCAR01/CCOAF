import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PatService {

  constructor(private http: HttpClient) {
  }

  crearPat(pat : any){
    return this.http.post(`${environment.apiUrl}/ccoa/pats`,pat);
  }

  listarPat(){
    return this.http.get(`${environment.apiUrl}/ccoa/pats`);
  }
}
