import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart,registerables} from 'node_modules/chart.js'
import { PatService } from '../pat/services/pat.service';
import { AuthService } from '../login/auth/auth.service';
import { ActividadService } from '../actividad/services/actividad.service';
import { TipoGEService } from '../gestion/services/tipoGE.service';
Chart.register(...registerables)

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  title = 'dashboard';
  data : any;
  nombrePats : any [] = [];
  porcentajePats : any [] = [];
  label : any [] = [];
  avanceProyectos : any [] = [];
  sumaTotal : any [] = [];
  total : any [] = [];

  constructor(
    private patService:PatService,
    private auth:AuthService,
    private actividadService:ActividadService,
    private tipoService:TipoGEService){ }
  
  ngOnInit(): void {
    this.patService.listarPat(this.auth.obtenerHeader()).subscribe(result => {
      this.data = result;
      if(this.data != null){
        for (let i = 0; i < this.data.length; i++) {
          this.nombrePats.push(this.data[i].nombre);
          this.porcentajePats.push(this.data[i].porcentaje);
        }
        this.renderChart(this.nombrePats,this.porcentajePats,'bar','chart','Total');
      }
    })
    this.actividadService.listarProyecto(this.auth.obtenerHeader()).subscribe(result => {
      this.data = result;
      if(this.data != null){
        this.label.push('Proyectos');
      }
      this.sumaTotal.push(this.data.length);
      
    })
    this.tipoService.listarGestion(this.auth.obtenerHeader()).subscribe(result => {
      this.data = result;
      if(this.data != null){
        this.label.push('Actividades gestión');
      }
      this.sumaTotal.push(this.data.length);
      
    })
    this.tipoService.listarActividadEstrategica(this.auth.obtenerHeader()).subscribe(result => {
      this.data = result;
      if(this.data != null){
        this.label.push("Actividades Estratégicas");        
      }
      this.sumaTotal.push(this.data.length);
      this.renderChart(this.label,this.sumaTotal,'doughnut','chart2','Total');
    })

    
  }

  renderChart(data:any, mindata:any, type:any , id:any, label:any){
    const dashboard = new Chart(id, {
      type: type,
      data: {
        labels: data,
        datasets: [{
          label: label,
          data: mindata,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}
