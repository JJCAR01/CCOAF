import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {
  
  constructor(private oauth:OAuthService,) {
    this.iniciarLogin()
  }

  iniciarLogin(){
    const config : AuthConfig = {
      issuer :'https://accounts.google.com',
      strictDiscoveryDocumentValidation:false,
      clientId:'659612202917-95lnaql5oq526cg8cd18li7gksjlduap.apps.googleusercontent.com',
      redirectUri: window.location.origin + '/panelUsuario',
      scope:'openid profile email'
    }
    this.oauth.configure(config);
    this.oauth.setupAutomaticSilentRefresh();
    this.oauth.loadDiscoveryDocumentAndTryLogin();
  }

  loging(){
    this.oauth.initLoginFlow();
  }


  logOut():void{
    this.oauth.logOut();
  }

  getProfile(){
    return this.oauth.getIdentityClaims();
  }

}
