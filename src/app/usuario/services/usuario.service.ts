import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { CookieService } from "ngx-cookie-service";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient, private cookies:CookieService) {
  }

  crearUsuario<T>(usuario : any,headers?: HttpHeaders):Observable<T>{
    return this.http.post<T>(`${environment.apiUrl}/ccoa/usuarios`,usuario,{headers});
  }

  listarUsuario<T>(headers?: HttpHeaders):Observable<T>{
    return this.http.get<T>(`${environment.apiUrl}/ccoa/usuarios`,{headers});
  }

  eliminarUsuario<T>(idUsuario:number,headers?: HttpHeaders):Observable<T>{
    return this.http.delete<T>(`${environment.apiUrl}/ccoa/usuarios/${idUsuario}`,{headers});
  }

  modificarAgregarPass<T>(usuario : any,idUsuario:number,headers?: HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/usuarios/pass/${idUsuario}`,usuario,{headers});
  }

  modificar<T>(usuario : any,idUsuario:number,headers?: HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/usuarios/${idUsuario}`,usuario,{headers});
  }

  modificarDireccion<T>(usuario : any,idUsuario:number,headers?: HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/usuarios/direcciones/${idUsuario}`,usuario,{headers});
  }
  eliminarDireccion<T>(usuario : any,idUsuario:number,headers?: HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/usuarios/direcciones/del/${idUsuario}`,usuario,{headers});
  }
  modificarPat<T>(usuario : any,idUsuario:number,headers?: HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/usuarios/pats/${idUsuario}`,usuario,{headers});
  }
  eliminarPat<T>(usuario : any,idUsuario:number,headers?: HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/usuarios/pats/del/${idUsuario}`,usuario,{headers});
  }
  
 
}
