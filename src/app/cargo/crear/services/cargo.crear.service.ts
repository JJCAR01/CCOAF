import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { CookieService } from "ngx-cookie-service";


@Injectable({
  providedIn: 'root'
})
export class CargoCrearService {

  constructor(private http: HttpClient, private cookies:CookieService) {
  }

 crearCargo(cargo : any){
   return this.http.post(`${environment.apiUrl}/ccoa/cargos`,cargo);
 }
}
