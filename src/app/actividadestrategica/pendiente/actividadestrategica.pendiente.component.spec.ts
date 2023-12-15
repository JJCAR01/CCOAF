import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadEstrategicaPendienteListarComponent } from './actividadestrategica.pendiente.component';

describe('ActividadEstrategicaPendienteListarComponent', () => {
  let component: ActividadEstrategicaPendienteListarComponent;
  let fixture: ComponentFixture<ActividadEstrategicaPendienteListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadEstrategicaPendienteListarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActividadEstrategicaPendienteListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
