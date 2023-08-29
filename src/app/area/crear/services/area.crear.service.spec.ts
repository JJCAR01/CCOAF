import { TestBed } from '@angular/core/testing';

import { AreaCrearService } from './area.crear.service';

describe('AreaCrearService', () => {
  let service: AreaCrearService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreaCrearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
