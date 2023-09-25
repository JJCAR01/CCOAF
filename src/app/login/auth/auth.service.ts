import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService) { }

  isAuthenticated(): boolean {
    // Obtén el JWT almacenado en las cookies
    const jwt = this.cookieService.get('jwt');

    // Verifica si el JWT existe y no está vacío
    if (jwt) {
      try {
        const decode = jwtDecode(jwt);
        return true;
      } catch (error) {

        console.error('Error al decodificar el JWT:', error);
        return false;
      }
    } else {
      return false;
    }
  }

  getToken(): string | null {
    return this.cookieService.get('jwt'); 
  }
}
