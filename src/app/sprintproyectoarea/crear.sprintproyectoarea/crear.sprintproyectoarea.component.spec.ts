import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSprintproyectoareaComponent } from './crear.sprintproyectoarea.component';

describe('CrearSprintproyectoareaComponent', () => {
  let component: CrearSprintproyectoareaComponent;
  let fixture: ComponentFixture<CrearSprintproyectoareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearSprintproyectoareaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearSprintproyectoareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
