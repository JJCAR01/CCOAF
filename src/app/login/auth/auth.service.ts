import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService) { }

  isAuthenticated(): boolean {
    const jwt = this.cookieService.get('jwt');

    if (jwt) {
      try {
        jwtDecode(jwt);
        return true;
      } 
      catch (error) {
        return false;
      }
    } else {
      return false;
    }
  }

  getToken(): string | null {
    return this.cookieService.get('jwt'); 
  }

  obtenerHeader(): Headers|any{
    const token = this.getToken(); // Obtiene el token JWT del servicio AuthService
    return new HttpHeaders().set('Authorization', `Bearer ${token}`)
  }
}
