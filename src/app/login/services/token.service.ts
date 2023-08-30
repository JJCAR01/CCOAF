import { Injectable } from '@angular/core';
import { getCookie, setCookie,removeCookie } from 'typescript-cookie';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  guardarToken(token: string){
    localStorage.setItem('token',token);
    setCookie('token',token,{expires:365, path:'/'})
  }

  getToken(){
    const token = getCookie('token');
    return token;
  }

  eliminarToken(){
    removeCookie('token');
  }
}
