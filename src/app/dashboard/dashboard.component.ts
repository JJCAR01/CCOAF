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
  chartPrincipal:Chart | any;
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
          this.patService.listarPatPorId(idPat,this.auth.obtenerHeader()).subscribe((result : any) => {
            this.datoPat.push(result);
            if (this.datoPat != null) {
              this.nombrePats = [];
              this.porcentajePats = [];
              for (let i = 0; i < this.datoPat.length; i++) {
                this.nombrePats.push(this.datoPat[i].nombre);
                this.porcentajePats.push(this.datoPat[i].porcentaje);
                console.log(this.nombrePats)
              }
            }
            // Actualizar chartPrincipal con los datos iniciales
            this.chartPrincipal.data.labels = this.nombrePats;
            this.chartPrincipal.data.datasets[0].data = this.porcentajePats;
            this.chartPrincipal.update();
          });
        }
        
        
      }
      
    });
    this.inicializarGraficoPrincipal();
    this.inicializarGraficos();
  }

  async obtenerDatosPorActividades(idPat: number) {
    this.idActividadEstrategica = [];
  
    this.tipoService.listarGestionPorIdPat(idPat, this.auth.obtenerHeader()).subscribe(result => {
      this.dataAct = result;
      if (this.dataAct != null) {
        this.sumaTotalActividadesGestion = [this.dataAct.length];
      }
    });
  
    this.sumaTotalProyectos = 0;  // Inicializar como un número
  
    this.tipoService.listarActividadEstrategicaPorIdPat(idPat, this.auth.obtenerHeader()).subscribe(async result => {
      this.dataActvidadesEstrategicas = result;
      if (this.dataActvidadesEstrategicas != null) {
        this.idActividadEstrategica = this.dataActvidadesEstrategicas.map((act: any) => act.idActividadEstrategica);
        this.sumaTotalActividadesEstrategicas = [this.dataActvidadesEstrategicas.length];
  
        // Inicializar sumaTotalProyectos como 0 antes de comenzar el bucle
        this.sumaTotalProyectos = 0;
  
        // Crear un array de promesas
        const promesasProyectos = this.idActividadEstrategica.map(async (id: any) => {
          return new Promise<void>(async (resolve) => {
            const proyectos = await this.actividadService.listarProyectoPorIdActividadEstrategica(id, this.auth.obtenerHeader()).toPromise();
  
            // Verificar si proyectos es undefined o null
            const proyectosArray = (proyectos !== undefined) ? proyectos as any[] : [];
  
            // Sumar la longitud de cada conjunto de proyectos
            this.sumaTotalProyectos += proyectosArray.length;
  
            // Si necesitas hacer algo con los proyectos individuales, puedes hacerlo aquí
  
            // Resolve la promesa después de completar las operaciones asincrónicas
            resolve();
          });
        });
  
        // Utilizar Promise.all para esperar a que todas las promesas se resuelvan antes de continuar
        await Promise.all(promesasProyectos);
  
        // Después de que todas las operaciones asincrónicas hayan concluido, actualiza el gráfico
        this.actualizarGrafico2();
      }
    });
  }
  
  async obtenerPat(pat: any): Promise<void> {
    const idPatsFiltrados = pat.map((pat: any) => pat.idPat);
    const primerIdPat = idPatsFiltrados[0];
    this.idPat = primerIdPat;
  
    // Espera a que todas las operaciones asíncronas se completen antes de continuar
    await this.tipoService.listarGestionPorIdPat(this.idPat, this.auth.obtenerHeader()).toPromise();
    // ...
    await this.tipoService.listarActividadEstrategicaPorIdPat(this.idPat, this.auth.obtenerHeader()).toPromise();
    // ...
    await this.obtenerDatosPorActividades(this.idPat);
  }

  async onPatSelect(): Promise<void> {
    const patSeleccionado = this.form.get('pat')?.value;
    this.patSeleccionado = patSeleccionado;
  
    // Lógica para filtrar datos según el 'pat' seleccionado
    const filtrarPorNombrePat = this.datoPat.filter((item: any) => item.nombre === patSeleccionado);
    
    // Espera a que obtenerPat y todas las operaciones asíncronas se completen antes de continuar
    await this.obtenerPat(filtrarPorNombrePat);
  
    // Actualizar gráficos después de completar todas las operaciones
    await Promise.all([
      this.actualizarGrafico2(),
      this.actualizarGrafico1(filtrarPorNombrePat),
      
    ]);
  }
  async actualizarGrafico1(filtrarPorNombrePat: any[]): Promise<void> {
    const labels = filtrarPorNombrePat.map((item: any) => item.nombre);
    const porcentaje = filtrarPorNombrePat.map((item: any) => item.porcentaje);
    const dataRestante = porcentaje.map((value: number) => 100 - value);
  
    labels.push('Restante');
    porcentaje.push(dataRestante);
  
    // Actualizar gráfico 1
    if (this.chart1) {
      this.chart1.data.labels = labels;
      this.chart1.data.datasets[0].data = porcentaje;
      this.chart1.update();
    }
  }
  
  // ...
  
  async actualizarGrafico2(): Promise<void> {
    const datosChart2 = [
      this.sumaTotalActividadesGestion[0], // Datos para 'Actividades de Gestión'
      this.sumaTotalActividadesEstrategicas[0], // Datos para 'Actividades estratégicas'
      this.sumaTotalProyectos
    ];
  
    // Actualizar gráfico 2
    if (this.chart2) {
      this.chart2.data.labels = this.nombreActividades;
      this.chart2.data.datasets[0].data = datosChart2;
      this.chart2.update();
    }
  }

  inicializarGraficoPrincipal(): void {
    this.chartPrincipal = new Chart('chartPrincipal', {
      type: 'bar',
      data: {
        labels: this.nombrePats,
        datasets: [{
          label: 'Porcentaje anual',
          data: this.porcentajePats ,
          backgroundColor: ['rgb(78, 119, 228)', 'rgb(203, 159, 77)','rgb(181, 91, 205)','rgb(111, 210, 105)','rgb(205, 195, 91)'],
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

  inicializarGraficos(): void {
    this.chart1 = new Chart('chart1', {
      type: 'doughnut',
      data: {
        labels: this.nombrePats,
        datasets: [{
          label: 'Porcentaje actual',
          data: this.porcentajePats + '%',
          backgroundColor: ['rgb(111, 210, 105)', 'rgb(227, 227, 227)'],
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

    this.chart2 = new Chart('chart2', {
      type: 'bar',
      data: {
        labels: this.nombreActividades,
        datasets: [{
          label: 'Cantidad',
          data: this.sumaTotalActividadesGestion, // Actualizar para reflejar la estructura correcta
          backgroundColor: ['rgb(111, 210, 105)', 'rgb(227, 227, 227)','rgb(203, 159, 77)'],
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
