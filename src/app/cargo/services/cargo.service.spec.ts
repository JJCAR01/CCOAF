import { TestBed } from '@angular/core/testing';

import { CargoService } from './cargo.service';

describe('ServicesService', () => {
  let service: CargoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
