import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient, private cookies:CookieService) {
  }

  crearUsuario(usuario : any,headers?: HttpHeaders){
    return this.http.post(`${environment.apiUrl}/ccoa/usuarios`,usuario,{headers});
  }

  listarUsuario(headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/usuarios`,{headers});
  }

  eliminarUsuario(idUsuario:number,headers?: HttpHeaders){
    return this.http.delete(`${environment.apiUrl}/ccoa/usuarios/${idUsuario}`,{headers});
  }
}
