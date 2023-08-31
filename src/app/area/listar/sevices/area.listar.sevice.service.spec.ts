import { TestBed } from '@angular/core/testing';

import { AreaListarSeviceService } from './area.listar.sevice.service';

describe('AreaListarSeviceService', () => {
  let service: AreaListarSeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreaListarSeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
