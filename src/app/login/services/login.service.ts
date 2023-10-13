import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  constructor(private http: HttpClient) {
  }



  login(login : any){
    return this.http.post(`${environment.apiUrl}/ccoa/auth/login`,login);
  }

  authenticateWithGoogle() {
    return this.http.get(`${environment.apiUrl}/login/oauth2/code/google`);
  }
}


