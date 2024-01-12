import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesoCrearComponent } from './proceso.crear.component';

describe('CrearComponent', () => {
  let component: ProcesoCrearComponent;
  let fixture: ComponentFixture<ProcesoCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcesoCrearComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProcesoCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
