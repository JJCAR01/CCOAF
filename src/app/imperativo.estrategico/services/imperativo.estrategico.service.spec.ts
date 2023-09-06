import { TestBed } from '@angular/core/testing';

import { ImperativoEstrategicoService } from './imperativo.estrategico.service';

describe('ImperativoEstrategicoService', () => {
  let service: ImperativoEstrategicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImperativoEstrategicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
