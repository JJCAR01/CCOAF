import { TestBed } from '@angular/core/testing';

import { GoogleService } from './auth.google.service';

describe('LoginService', () => {
  let service: GoogleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
