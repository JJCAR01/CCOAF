import { Component } from '@angular/core';
import { CargoService } from '../services/cargo.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root:not(c)',
  templateUrl: './cargo.listar.component.html',
  styleUrls: ['./cargo.listar.component.scss']
})
export class CargoListarComponent {
  title = 'listarCargo';
    cargos: any[] = [];
    busqueda: any;
  
    constructor(private cargoService: CargoService, private auth:AuthService) { }  

    ngOnInit() {
      this.cargarCargos();
    }

    cargarCargos() {
      this.cargoService.listar(this.auth.obtenerHeader()).toPromise().then(
        (data: any) => {
          this.cargos = data;
        },
        (error) => {
          Swal.fire('Error',error.error.mensajeTecnico,"error");
        }
      );
    }
    eliminarCargo(idCargo: number) {
      const cargoAEliminar = this.cargos.find(cargo => cargo.idCargo === idCargo);
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar este elemento.",
        icon: "question",
        confirmButtonText: "Confirmar",
        confirmButtonColor: "#3085d6",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
      })
      .then((confirmacion) => {
        if (confirmacion.isConfirmed) {
        this.cargoService.eliminar(idCargo, this.auth.obtenerHeader()).subscribe(
          (response) => {
            Swal.fire("Eliminado!!!", "El cargo se ha eliminado." , "success").then(() => {
              window.location.reload();
            });
          },
          (error) => {
            Swal.fire("Solicitud no válida", error.error.mensajeHumano, "error");
          }
        );
      }
    });
  }
}