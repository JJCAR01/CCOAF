import { Component } from '@angular/core';
import { CargoService } from '../services/cargo.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import swal from 'sweetalert';

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
          swal(error.error.mensajeTecnico,"error");
        }
      );
    }
    eliminarCargo(idCargo: number) {
      const cargoAEliminar = this.cargos.find(cargo => cargo.idCargo === idCargo);
      this.cargoService.eliminar(idCargo,this.auth.obtenerHeader()).subscribe(
        (response) => {
          swal("Eliminado Satisfactoriamente", "El cargo con el nombre " + cargoAEliminar.nombre + ", se ha eliminado!", "success").then(() => {
            window.location.reload();
          });
          console.log(response);
        },
        (error) => {
          swal(error.error.mensajeTecnico,"error");
        }
      );
    }


}