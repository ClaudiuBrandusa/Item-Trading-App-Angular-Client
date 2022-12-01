import { TestBed } from '@angular/core/testing';

import { UnauthGuardService } from './unauth-guard.service';

describe('UnauthGuardService', () => {
  let service: UnauthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnauthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
