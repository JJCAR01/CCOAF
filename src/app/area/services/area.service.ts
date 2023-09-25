import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { CookieService } from "ngx-cookie-service";


@Injectable({
  providedIn: 'root'
})
export class AreaService {
  
  constructor(private http: HttpClient, private cookies:CookieService) {
   }

  crearArea(area : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/areas`,area,{headers});
  }

  listarArea(headers?: HttpHeaders) {
      return this.http.get(`${environment.apiUrl}/ccoa/areas`, { headers });
  }
}



