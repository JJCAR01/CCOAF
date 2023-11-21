import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login/services/login.service';
import { CookieService } from 'ngx-cookie-service/lib/cookie.service';
import { AuthService } from '../login/auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './panel.admin.component.html',
  styleUrls: ['./panel.admin.component.scss']
})
export class PanelAdminComponent implements OnInit{
  title = 'panelAdmin';

  user: SocialUser | null = null;
  loggedIn: boolean = true;

  constructor(private authService:SocialAuthService,
    private router: Router,private cookie:CookieService,
    private auth: AuthService){}

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }

  logOut():void{
    this.authService.signOut();
    this.cookie.deleteAll();
    this.router.navigate(["/login"]);
  }
}