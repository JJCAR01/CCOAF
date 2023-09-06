import { TestBed } from '@angular/core/testing';

import { LineaEstrategicaService } from './linea.estrategica.service';

describe('LineaEstrategicaService', () => {
  let service: LineaEstrategicaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineaEstrategicaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
