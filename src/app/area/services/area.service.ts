import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { CookieService } from "ngx-cookie-service";


@Injectable({
  providedIn: 'root'
})
export class AreaService {
  
  constructor(private http: HttpClient, private cookies:CookieService) {
   }

  crearArea(area : any){
    return this.http.post(`${environment.apiUrl}/ccoa/areas`,area);
  }

  setToken(token: string) {
    this.cookies.set("jwt",token);
  }
  getToken() {
    return this.cookies.get("token");
  }
  listarArea(){
    return this.http.get(`${environment.apiUrl}/ccoa/areas`);
  }
}



