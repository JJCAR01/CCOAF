import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadestrategicaListarComponent } from './actividadestrategica.listar.component';

describe('ActividadestrategicaListarComponent', () => {
  let component: ActividadestrategicaListarComponent;
  let fixture: ComponentFixture<ActividadestrategicaListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadestrategicaListarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActividadestrategicaListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
