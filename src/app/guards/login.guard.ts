// login.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private cookieService: CookieService, private router:Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    console.log('LoginGuard is running!');
    const isAuthenticated = this.cookieService.get('jwt').length > 0;
    console.log('Is authenticated:', isAuthenticated);
    return isAuthenticated ? true : this.router.parseUrl('/login');
  }
  
}
