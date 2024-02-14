import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarSprintproyectoareaComponent } from './listar.sprintproyectoarea.component';

describe('ListarSprintproyectoareaComponent', () => {
  let component: ListarSprintproyectoareaComponent;
  let fixture: ComponentFixture<ListarSprintproyectoareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarSprintproyectoareaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarSprintproyectoareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
