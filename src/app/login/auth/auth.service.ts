import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

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
      } catch (error) {
        return false;
      }
    } else {
      return false;
    }
  }

  getToken(): string | null {
    return this.cookieService.get('jwt'); 
  }

  obtenerHeader(): HttpHeaders {  // <-- Corregir aquí
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
