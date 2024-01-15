import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearGestionComponent } from './crear.gestion.component';

describe('CrearGestionComponent', () => {
  let component: CrearGestionComponent;
  let fixture: ComponentFixture<CrearGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearGestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
