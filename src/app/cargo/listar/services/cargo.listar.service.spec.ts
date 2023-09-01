import { TestBed } from '@angular/core/testing';

import { CargoListarService } from './cargo.listar.service';

describe('CargoListarService', () => {
  let service: CargoListarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargoListarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
