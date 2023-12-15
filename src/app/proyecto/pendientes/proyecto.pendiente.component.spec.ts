import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoPendienteListarComponent } from './proyecto.pendiente.component';

describe('ProyectoPendienteListarComponent', () => {
  let component: ProyectoPendienteListarComponent;
  let fixture: ComponentFixture<ProyectoPendienteListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoPendienteListarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProyectoPendienteListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
