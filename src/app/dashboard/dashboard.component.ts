import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatService } from '../pat/services/pat.service';
import { AuthService } from '../login/auth/auth.service';
import { ActividadService } from '../actividad/services/actividad.service';
import { TipoGEService } from '../gestion/services/tipoGE.service';
import { Chart, registerables } from 'chart.js/auto';
import { AnyObject } from 'chart.js/dist/types/basic';
import { Pat } from '../modelo/pat';

Chart.register(...registerables);

@Component({
  selector: 'app-root',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  title = 'dashboard';
  idsPats: any[] = []
  nombrePats: any[] = [];
  porcentajePats: any[] = [];
  porcentajeRealEstrategica: number[] = [];
  porcentajeEsperadoEstrategica: number[] = [];
  nombreActividadEstrategicas: any[] = [];
  porcentajeRealActividadEstrategica: number[] = [];
  porcentajeEsperadoActividadEstrategica: number[] = [];
  porcentajeKpi: number[] = [];
  sumadorPromediadorPorcentajePat: number = 0;
  promedioPorcentajePat: number = 0;
  idPatsConActividadesEstrategicas : number [] =[];
  contadorPatsConActividades = 0;
  porcentajeACien = 0;
  porcentajeACienDiez = 10;
  pats: Pat [] = [];
  form:FormGroup;
  chartPorcentajePat:Chart | any;
  chartProgramasRealYEsperado:Chart | any;
  chartActividadesEstrategicasRealYEsperado:Chart | any;
  chartPorcentajeKpi: Chart | any;
  chartAcelerador: Chart | any;

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
    this.obtenerTodos();
    this.inicializarGraficoPrincipal();
    this.cargarPats();
  }

  cargarPats() {
    this.patService.getPatsAsociados().subscribe(
      (pats: Pat[]) => {
        this.pats = pats;
      }
    );
  }
  
  obtenerTodos(){
    this.patService.getPatsAsociados().subscribe((patsData: any[]) => {
      if (patsData && Array.isArray(patsData)) {
          this.idsPats = patsData.map((pat: any) => pat.idPat);

          // Inicializar arreglos fuera del bucle
          this.nombrePats = [];
          this.porcentajeRealEstrategica = [];
          this.porcentajeEsperadoEstrategica = [];
          this.porcentajePats = [];
          this.nombreActividadEstrategicas = [];
          this.porcentajeRealActividadEstrategica = [];
          this.porcentajeEsperadoActividadEstrategica = [];


          // Iterar sobre los IDs de Pats y cargar las actividades estratégicas
          for (const idPat of this.idsPats) {
              this.tipoService.listarActividadEstrategicaPorIdPat(idPat, this.auth.obtenerHeader())
                  .toPromise()
                  .then((actividadesEstrategicas: any) => {
                      if (actividadesEstrategicas && actividadesEstrategicas.length > 0) {
                        const porcentajesRealEstrategicaPat = actividadesEstrategicas.map((actividad: any) => actividad.porcentajeReal);
                        const totalPorcentajeRealPat = porcentajesRealEstrategicaPat.reduce((total: number, porcentaje: number) => total + porcentaje, 0);

                        const porcentajesEsperadoEstrategicaPat = actividadesEstrategicas.map((actividad: any) => actividad.porcentajeEsperado);
                        const totalPorcentajeEsperadoPat = porcentajesEsperadoEstrategicaPat.reduce((total: number, porcentaje: number) => total + porcentaje, 0);

                        const porcentajesPat = actividadesEstrategicas.map((actividad: any) => actividad.porcentajePat);
                        const totalPorcentajesPat = porcentajesPat.reduce((total: number, porcentaje: number) => total + porcentaje, 0);

                        const promedioPorcentajeRealPat = totalPorcentajeRealPat / porcentajesPat.length;
                        const promedioPorcentajeEsperadoPat = totalPorcentajeEsperadoPat / porcentajesPat.length;
                        const promedioPorcentajePat = totalPorcentajesPat / porcentajesPat.length;
  
                        // Obtener el nombre del PAT
                        const nombrePat = patsData.find(pat => pat.idPat === idPat)?.nombre;

                        // Agregar los datos del PAT correspondientes a esta iteración
                        this.nombrePats.push(nombrePat);
                        this.porcentajeRealEstrategica.push(promedioPorcentajeRealPat);
                        this.porcentajeEsperadoEstrategica.push(promedioPorcentajeEsperadoPat);
                        this.porcentajePats.push(promedioPorcentajePat);
                        this.sumadorPromediadorPorcentajePat += promedioPorcentajePat;
                        this.contadorPatsConActividades++;
    
                        // Agregar los datos de actividades estratégicas
                        for (const actividad of actividadesEstrategicas) {
                          this.nombreActividadEstrategicas.push(actividad.nombre);
                          this.porcentajeRealActividadEstrategica.push(actividad.porcentajeReal);
                          this.porcentajeEsperadoActividadEstrategica.push(actividad.porcentajeEsperado);
                          this.porcentajeKpi.push(actividad.promedioMeta);
                          }

                        // Agregar el PAT a this.pats solo si tiene actividades estratégicas
                        if (!this.idPatsConActividadesEstrategicas.includes(idPat)) {
                          this.idPatsConActividadesEstrategicas.push(idPat);
                        }   
                                                        
                      }
                      // Actualizar gráficos con los datos de esta iteración
                      this.actualizarGraficos();
                  });
                  
          } 
        }
    });
  }

  obtenerPat(){
    const idPat = this.form.get('pat')?.value;
    if(idPat === 'todos') {
      this.obtenerTodos();
    } else {
      // Limpiar arreglos de datos antes de agregar nuevos datos
      this.nombrePats = [];
      this.porcentajeRealEstrategica = [];
      this.porcentajeEsperadoEstrategica = [];
      this.porcentajePats = [];
      this.nombreActividadEstrategicas = [];
      this.porcentajeRealActividadEstrategica = [];
      this.porcentajeEsperadoActividadEstrategica = [];
      this.porcentajeKpi = [];
      
      const pat = this.pats.find((pat) => pat.idPat === parseInt(idPat));
      this.nombrePats.push(pat?.nombre);

      this.tipoService.listarActividadEstrategicaPorIdPat(idPat, this.auth.obtenerHeader())
        .toPromise()
          .then((actividadesEstrategicas: any) => {
            if (actividadesEstrategicas && actividadesEstrategicas.length > 0) {
              const porcentajesPat = actividadesEstrategicas.map((actividad: any) => actividad.porcentajePat);
              const totalPorcentajePat = porcentajesPat.reduce((total: number, porcentaje: number) => total + porcentaje, 0);

              const porcentajesRealEstrategicaPat = actividadesEstrategicas.map((actividad: any) => actividad.porcentajeReal);
              const totalPorcentajeRealPat = porcentajesRealEstrategicaPat.reduce((total: number, porcentaje: number) => total + porcentaje, 0);

              const porcentajesEsperadoEstrategicaPat = actividadesEstrategicas.map((actividad: any) => actividad.porcentajeEsperado);
              const totalPorcentajeEsperadoPat = porcentajesEsperadoEstrategicaPat.reduce((total: number, porcentaje: number) => total + porcentaje, 0);

              const promedioPorcentajeRealPat = totalPorcentajeRealPat / porcentajesRealEstrategicaPat.length;
              const promedioPorcentajeEsperadoPat = totalPorcentajeEsperadoPat / porcentajesEsperadoEstrategicaPat.length;
              const promedioPat = totalPorcentajePat / porcentajesPat.length;
              // Agregar los datos del PAT correspondientes a esta iteración

              this.porcentajeRealEstrategica.push(promedioPorcentajeRealPat);
              this.porcentajeEsperadoEstrategica.push(promedioPorcentajeEsperadoPat);
              this.porcentajePats.push(promedioPat);
      
              // Agregar los datos de actividades estratégicas
              for (const actividad of actividadesEstrategicas) {
                this.nombreActividadEstrategicas.push(actividad.nombre);
                this.porcentajeRealActividadEstrategica.push(actividad.porcentajeReal);
                this.porcentajeEsperadoActividadEstrategica.push(actividad.porcentajeEsperado);
                this.porcentajeKpi.push(actividad.promedioMeta);
              }                                                  
        }
        this.actualizarGraficos();                   
        });
      }
    
  }
  obtenerNombrePat(idPat: number) {
    const pat = this.pats.find((pat) => pat.idPat === idPat);
    return pat ? pat.nombre : '';
  }

 
  actualizarGraficos() {
    this.chartPorcentajePat.data.labels = this.nombrePats;
    this.chartPorcentajePat.data.datasets[0].data = this.porcentajePats;
    this.chartPorcentajePat.update();

    this.chartProgramasRealYEsperado.data.labels = this.nombrePats;
    this.chartProgramasRealYEsperado.data.datasets[0].data = this.porcentajeRealEstrategica;
    this.chartProgramasRealYEsperado.data.datasets[1].data = this.porcentajeEsperadoEstrategica;
    this.chartProgramasRealYEsperado.update();

    this.chartActividadesEstrategicasRealYEsperado.data.labels = this.nombreActividadEstrategicas;
    this.chartActividadesEstrategicasRealYEsperado.data.datasets[0].data = this.porcentajeRealActividadEstrategica;
    this.chartActividadesEstrategicasRealYEsperado.data.datasets[1].data = this.porcentajeEsperadoActividadEstrategica;
    this.chartActividadesEstrategicasRealYEsperado.update();

    this.chartPorcentajeKpi.data.labels = this.nombreActividadEstrategicas;
    this.chartPorcentajeKpi.data.datasets[0].data = this.porcentajeKpi;
    this.chartPorcentajeKpi.update();

    this.porcentajeACien =  100 - this.promedioPorcentajePat;
    this.porcentajeACienDiez = 110 - this.promedioPorcentajePat;
    this.promedioPorcentajePat = this.sumadorPromediadorPorcentajePat / this.contadorPatsConActividades;
    this.chartAcelerador.data.datasets[0].data = [this.promedioPorcentajePat, this.porcentajeACien, this.porcentajeACienDiez];
    this.chartAcelerador.update();
  }

  inicializarGraficoPrincipal(): void {
  
    // Crear el gráfico con datos iniciales
    this.chartAcelerador = new Chart('chartAcelerador', {
      type: 'doughnut',
      data: {
          labels: ['Porcentaje PAT','Restante','Sobre ejecutado'],
          datasets: [{
              data: [this.promedioPorcentajePat, this.porcentajeACien, this.porcentajeACienDiez],
              backgroundColor: ['rgb(178,218,250)', 'rgb(215, 219, 221)','rgb(238, 238, 238)'],
              circumference: 180,
              rotation:270,
              
            }]
      },
      options: {
        aspectRatio: 1.5,
          plugins: {
            legend:{
              display:false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed !== null) {
                    label += context.parsed.toFixed(2) + '%';
                  }
                  return label;
                }
              }
            }
          }
      }
    }),
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
            min: 0,
            max: 100,
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
          data: this.porcentajeRealEstrategica,
          backgroundColor: 'rgb(178,218,250)', // Color para el primer dataset
          order: 1
        }, {
          label: 'Porcentaje esperado programa',
          data: this.porcentajeEsperadoEstrategica,
          backgroundColor: 'rgb(176,242,194)', // Color para el segundo dataset
          order: 2
        }],
        labels: this.nombrePats,
      },
      options: {
        scales: {
          x: {
            grid: {
              offset: true
            }
          },
          y: {
            min: 0,
            max: 100,
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

    this.chartActividadesEstrategicasRealYEsperado = new Chart('chartActividadesEstrategicasRealYEsperado', {
      type: 'bar',
      data: {
        datasets: [{
          label: 'Porcentaje real actividad estratégica',
          data: this.porcentajeRealEstrategica,
          backgroundColor: 'rgb(178,218,250)', // Color para el primer dataset
          order: 1
        }, {
          label: 'Porcentaje esperado actividad estratégica',
          data: this.porcentajeEsperadoEstrategica,
          backgroundColor: 'rgb(176,242,194)', // Color para el segundo dataset
          order: 2
        }],
        labels: this.nombrePats,
      },
      options: {
        scales: {
          x: {
            ticks: {
              autoSkip: false, // Desactiva el salto automático
              maxRotation: 90, // Rotación máxima
              minRotation: 0, // Rotación mínima
              padding: 10, // Añade un relleno adicional para las etiquetas
              callback: function(value,index) {
                return index + 1; // Devuelve el valor sin formato
              }
            }
          },
          y: {
            min: 0,
            max: 100,
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

    this.chartPorcentajeKpi = new Chart('chartPorcentajeKpi', {
      type: 'bar',
      data: {
        labels: this.nombreActividadEstrategicas,
        datasets: [{
          label: 'Porcentaje meta KPI',
          data: this.porcentajeKpi ,
          backgroundColor: ['rgb(178,218,250)'],
        }]
      },
      options: {
        scales: {
          y: {
            min: 0,
            max: 100,
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value + '%'; // Añade '%' al valor numérico
              }
            }
          },
          x: {
            ticks: {
              autoSkip: false, // Desactiva el salto automático
              maxRotation: 90, // Rotación máxima
              minRotation: 0, // Rotación mínima
              padding: 10, // Añade un relleno adicional para las etiquetas
              callback: function(value,index) {
                return index + 1; // Devuelve el valor sin formato
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
