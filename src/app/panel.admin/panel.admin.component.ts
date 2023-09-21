import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login/services/login.service';


@Component({
  selector: 'app-root',
  templateUrl: './panel.admin.component.html',
  styleUrls: ['./panel.admin.component.scss']
})
export class PanelAdminComponent implements OnInit{
  title = 'panelAdmin';

  user: SocialUser | null = null;
  loggedIn: boolean = false;

  constructor(private authService:SocialAuthService,
    private router: Router, private loginService: LoginService){}

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }



  logOut():void{
    this.authService.signOut();
    this.router.navigate(["/login"]);
  }
  

}