import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AreaCrearService {
  
  constructor(private http: HttpClient) {
   }

  crearArea(area : any){
    return this.http.post(`${environment.apiUrl}/ccoa/areas`,area);
  }
}


