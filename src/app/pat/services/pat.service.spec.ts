import { TestBed } from '@angular/core/testing';

import { PatService } from './pat.service';

describe('PatService', () => {
  let service: PatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
