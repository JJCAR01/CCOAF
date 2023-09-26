import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class CargoService {

  constructor(private http: HttpClient, private cookies:CookieService) {
  }

  crearCargo(cargo : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/cargos`,cargo,{headers});
  }

  listarCargo(headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/cargos`,{headers});
  }

}
