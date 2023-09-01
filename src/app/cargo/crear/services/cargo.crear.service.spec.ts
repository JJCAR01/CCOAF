import { TestBed } from '@angular/core/testing';

import { CargoCrearService } from './cargo.crear.service';

describe('CargoCrearService', () => {
  let service: CargoCrearService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargoCrearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
