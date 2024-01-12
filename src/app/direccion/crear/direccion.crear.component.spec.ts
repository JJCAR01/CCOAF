import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DireccionCrearComponent } from './direccion.crear.component';

describe('CrearComponent', () => {
  let component: DireccionCrearComponent;
  let fixture: ComponentFixture<DireccionCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DireccionCrearComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DireccionCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
