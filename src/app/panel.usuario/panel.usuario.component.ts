import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './panel.usuario.component.html',
  styleUrls: ['./panel.usuario.component.scss']
})
export class PanelUsuarioComponent implements OnInit {
  title = 'panelUsuario';

  user: SocialUser | null = null;
  loggedIn: boolean = true;

  constructor(private authService:SocialAuthService,
    private router: Router,private cookie: CookieService){}

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