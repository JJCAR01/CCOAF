import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ImperativoEstrategicoService {

  constructor(private http: HttpClient) {
  }

  crearImperativoEstrategico(imperativoEstrategico : any){
    return this.http.post(`${environment.apiUrl}/ccoa/imperativosestrategicos`,imperativoEstrategico);
  }

  listarImperativoEstrategico(){
    return this.http.get(`${environment.apiUrl}/ccoa/imperativosestrategicos`);
  }
}
