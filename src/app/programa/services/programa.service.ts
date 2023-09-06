import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProgramaService {

  constructor(private http: HttpClient) {
  }

  crearPrograma(programa : any){
    return this.http.post(`${environment.apiUrl}/ccoa/programas`,programa);
  }

  listarPrograma(){
    return this.http.get(`${environment.apiUrl}/ccoa/programas`);
  }
}
