import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { CookieService } from "ngx-cookie-service";
import { Observable, catchError, throwError } from 'rxjs';
import swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class AreaService {
  //private headers = new HttpHeaders({'Content-Type':'applicaton/json'})
  
  constructor(private http: HttpClient) {
   }

  crearArea(area : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/areas`,area,{headers});
  }

  listarArea(headers?: HttpHeaders) {
      return this.http.get(`${environment.apiUrl}/ccoa/areas`, { headers}).pipe(
        catchError(e =>{
          return throwError(e);
        })
      );
  }
  eliminarPat(idArea:number,headers?: HttpHeaders){
    return this.http.delete(`${environment.apiUrl}/ccoa/areas/${idArea}`,{headers});
  }
}



