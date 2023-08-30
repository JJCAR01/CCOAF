import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  constructor(private http: HttpClient) {
  }

   
  /*login(corrreo:string,password:string){
    return this.http.post(`${environment.apiUrl}/ccoa/auth/login`,{
      corrreo,
      password
  });
}*/


  login(login : any){
    return this.http.post(`${environment.apiUrl}/ccoa/auth/login`,login);
  }

}


