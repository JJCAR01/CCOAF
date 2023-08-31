import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AreaListarService {

  constructor(private http: HttpClient) {
  }

 listarArea(){
   return this.http.get(`${environment.apiUrl}/ccoa/areas`);
 }

}
