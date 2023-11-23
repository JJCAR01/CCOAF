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
      clientId:'659612202917-3akn48ut0kpn8ojmneoml5ka2mp909et.apps.googleusercontent.com',
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
