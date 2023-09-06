import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient, private cookies:CookieService) {
  }

  crearUsuario(usuario : any){
    return this.http.post(`${environment.apiUrl}/ccoa/usuarios`,usuario);
  }

  listarUsuario(){
    return this.http.get(`${environment.apiUrl}/ccoa/usuarios`);
  }
}
