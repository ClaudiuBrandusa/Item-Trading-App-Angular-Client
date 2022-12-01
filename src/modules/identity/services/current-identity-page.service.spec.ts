import { TestBed } from '@angular/core/testing';

import { CurrentIdentityPageService } from './current-identity-page.service';

describe('CurrentIdentityPageService', () => {
  let service: CurrentIdentityPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentIdentityPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
