import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

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
    Swal.fire({
      icon:"question",
      title: "¿Estás seguro?",
      text: "Deseas salir de la sesión",
      confirmButtonText: "Confirmar",
      confirmButtonColor: "#3085d6",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    })
    .then((confirmacion) => {
      if (confirmacion.isConfirmed) {
        this.router.navigate(["/login"]);
            Swal.fire("Sesión cerrada", "", "success").then(() => {
              this.authService.signOut();
              this.cookie.deleteAll();
          },
        );
      }
    });
  }
}