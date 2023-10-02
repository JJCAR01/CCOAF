import { TestBed } from '@angular/core/testing';

import { TipoGEService } from './tipoGE.service';

describe('tipoGEService', () => {
  let service: TipoGEService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoGEService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
