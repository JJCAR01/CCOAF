import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearProyectoareaComponent } from './crear.proyectoarea.component';

describe('CrearProyectoareaComponent', () => {
  let component: CrearProyectoareaComponent;
  let fixture: ComponentFixture<CrearProyectoareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearProyectoareaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearProyectoareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
