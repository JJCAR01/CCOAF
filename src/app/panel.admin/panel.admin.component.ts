import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { getAuth,signOut } from 'firebase/auth';
import { navbarAdminData } from './nav-barAdmin';
import { navbarData } from '../panel.usuario/nav-bar';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './panel.admin.component.html',
  styleUrls: ['./panel.admin.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('350ms',
          style({opacity: 1})
        )
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('350ms',
          style({opacity: 0})
        )
      ])
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms', 
          keyframes([
            style({transform: 'rotate(0deg)', offset: '0'}),
            style({transform: 'rotate(2turn)', offset: '1'})
          ])
        )
      ])
    ])
  ]
})
export class PanelAdminComponent implements OnInit {
  title = 'panelAdmin';
  loggedIn: boolean = true;

  constructor(private router: Router,private cookie: CookieService){}

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarAdminData;
  navDataUser = navbarData;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;   
    if(this.screenWidth <= 768 ) {
      this.collapsed = false;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
    }
  }

  ngOnInit(): void {
      this.screenWidth = window.innerWidth;
      this.loggedIn != null;
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  logOut():void{
    Swal.fire({
      icon:"question",
      title: "¿Estás seguro?",
      text: "Deseas salir de la sesión",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
      confirmButtonColor: '#0E823F',
      reverseButtons: true, 
    })
    .then((confirmacion) => {
      if (confirmacion.isConfirmed) {
        this.router.navigate(["/login"]);
            Swal.fire({title:"Exitoso!!!", icon: "success",confirmButtonColor: '#0E823F',}).then(() => {
              const auth = getAuth();
              signOut(auth);
              this.cookie.deleteAll();
              this.loggedIn = false;
          },
        );
      }
    });
  }
}