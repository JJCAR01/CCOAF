import { TestBed } from '@angular/core/testing';

import { ServicesSprintproyectoareaService } from './services.sprintproyectoarea.service';

describe('ServicesSprintproyectoareaService', () => {
  let service: ServicesSprintproyectoareaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesSprintproyectoareaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
