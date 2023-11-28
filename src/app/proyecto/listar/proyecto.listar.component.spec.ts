import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoListarComponent } from './proyecto.listar.component';

describe('ProyectoListarComponent', () => {
  let component: ProyectoListarComponent;
  let fixture: ComponentFixture<ProyectoListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoListarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProyectoListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
