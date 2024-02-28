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
  obtenerHeaderDocumento(): HttpHeaders {
    const token = this.getToken();
    // Agregar el encabezado 'Content-Type: application/json'
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
  async obtenerNombreUsuario(): Promise<string | null> {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        if (decodedToken && decodedToken.sub) {
          return decodedToken.sub;
        } else {
          return null; // No se encontró el nombre de usuario en el token
        }
      } catch (error) {
        return null; // Error al decodificar el token
      }
    } else {
      return null; // No hay token disponible
    }
  }

  esAdmin(): Promise<boolean> {
    return this.verificarRol('ADMIN');
  }
  esDirector(): Promise<boolean> {
    return this.verificarRol('DIRECTOR');
  }
  esOperador(): Promise<boolean> {
    return this.verificarRol('OPERADOR');
  }
  esConsultor(): Promise<boolean> {
    return this.verificarRol('CONSULTOR');
  }

  private async verificarRol(rol: string): Promise<boolean> {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken && decodedToken.type === rol;
      } catch (error) {
        return false;
      }
    }
    return false;
  }
}
