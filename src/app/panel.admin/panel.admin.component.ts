import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './panel.admin.component.html',
  styleUrls: ['./panel.admin.component.scss']
})
export class PanelAdminComponent {
  title = 'panelAdmin';

  constructor( 
      private cookieService:CookieService,
      private router: Router 
    ) {}

    

}