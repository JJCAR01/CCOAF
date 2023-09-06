import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LineaEstrategicaService {

  constructor(private http: HttpClient) {
  }

  crearLineaEstrategica(lineaEstrategica : any){
    return this.http.post(`${environment.apiUrl}/ccoa/lineasestrategicas`,lineaEstrategica);
  }

  listarLineaEstrategica(){
    return this.http.get(`${environment.apiUrl}/ccoa/lineasestrategicas`);
  }
}
