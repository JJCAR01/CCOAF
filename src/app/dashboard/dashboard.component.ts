import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatService } from '../pat/services/pat.service';
import { AuthService } from '../login/auth/auth.service';
import { ActividadService } from '../actividad/services/actividad.service';
import { TipoGEService } from '../gestion/services/tipoGE.service';
import { Chart, registerables } from 'chart.js/auto';
import { AnyObject } from 'chart.js/dist/types/basic';

Chart.register(...registerables);

@Component({
  selector: 'app-root',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  title = 'dashboard';
  idsPats: any[] = []
  datoPat: any[] = [];
  dataActvidadesEstrategicas: any;
  dataAct: any;
  datoProyectos:any;
  idPat:number | any;
  idActividadEstrategica:[] = [];
  nombrePats: any[] = [];
  porcentajePats: any[] = [];
  porcentajeRealPrograma: number[] = [];
  porcentajeEsperadoPrograma: number[] = [];
  label: any[] = [];
  avanceProyectos: any[] = [];
  sumaTotalActividadesGestion: any[] = [];
  sumaTotalActividadesEstrategicas: any[] = [];
  sumaTotalProyectos: any;
  total: any[] = [];
  selectedPat: string = '';
  nombreActividades: string[] = ['Actividades de Gestión', 'Actividades estratégicas','Proyectos'];
  patSeleccionado :string = ''
  form:FormGroup;
    chartPorcentajePat:Chart | any;
  chartProgramasRealYEsperado:Chart | any;
  chart1: Chart | any;
  chart2: Chart | any;

  constructor(
    private patService: PatService,
    private auth: AuthService,
    private actividadService: ActividadService,
    private tipoService: TipoGEService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      pat: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    this.patService.getPatsData().subscribe((patsData: any[]) => {
      if (patsData && Array.isArray(patsData)) {
        this.idsPats = patsData.map((pat: any) => pat.idPat);

        // Iterar sobre los IDs de Pats y cargar las actividades estratégicas
        for (const idPat of this.idsPats) {
          this.patService.listarPatPorId(idPat, this.auth.obtenerHeader()).subscribe((result: any) => {
            this.datoPat.push(result);
            if (this.datoPat != null) {
              this.nombrePats = [];
              this.porcentajePats = [];
              this.porcentajeRealPrograma = [];
              this.porcentajeEsperadoPrograma = [];
              for (let i = 0; i < this.datoPat.length; i++) {
                this.nombrePats.push(this.datoPat[i].nombre);
                this.porcentajePats.push(this.datoPat[i].porcentajePat);
                this.porcentajeRealPrograma.push(this.datoPat[i].porcentajeReal);
                this.porcentajeEsperadoPrograma.push(this.datoPat[i].porcentajeEsperado);
              }
            }
            // Actualizar chartPrincipal con los datos iniciales
            this.chartPorcentajePat.data.labels = this.nombrePats;
            this.chartPorcentajePat.data.datasets[0].data = this.porcentajePats;
            this.chartPorcentajePat.update();
        
            // Actualizar chartProgramasRealEsperado con los nuevos datos
            this.chartProgramasRealYEsperado.data.labels = this.nombrePats;
            this.chartProgramasRealYEsperado.data.datasets[0].data = this.porcentajeRealPrograma;
            this.chartProgramasRealYEsperado.data.datasets[1].data = this.porcentajeEsperadoPrograma; // <- Aquí actualizas los datos esperados
            this.chartProgramasRealYEsperado.update();
          });
        }
        this.inicializarGraficoPrincipal();
        
      }
      
    });
  }




  inicializarGraficoPrincipal(): void {

    this.chartPorcentajePat = new Chart('chartPrincipal', {
      type: 'bar',
      data: {
        labels: this.nombrePats,
        datasets: [{
          label: 'Porcentaje PAT',
          data: this.porcentajePats ,
          backgroundColor: ['rgb(178,218,250)'],
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value + '%'; // Añade '%' al valor numérico
              }
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toFixed(2) + '%';
                }
                return label;
              }
            }
          }
        }
      }
    });

    this.chartProgramasRealYEsperado = new Chart('chartProgramasRealEsperado', {
      type: 'bar',
      data: {
        datasets: [{
          label: 'Porcentaje real programa',
          data: this.porcentajeRealPrograma,
          backgroundColor: 'rgb(178,218,250)', // Color para el primer dataset
          order: 2
        }, {
          label: 'Porcentaje esperado programa',
          data: this.porcentajeEsperadoPrograma,
          backgroundColor: 'rgb(176,242,194)', // Color para el segundo dataset
          order: 1
        }],
        labels: this.nombrePats,
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value + '%'; // Añade '%' al valor numérico
              }
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toFixed(2) + '%';
                }
                return label;
              }
            }
          }
        }
      }
    });
    
  }

 
}
