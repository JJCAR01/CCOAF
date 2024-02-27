import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarHistoricoComponent } from './listar.historico.component';

describe('ListarHistoricoComponent', () => {
  let component: ListarHistoricoComponent;
  let fixture: ComponentFixture<ListarHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarHistoricoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
