import { TestBed } from '@angular/core/testing';

import { ZutatService } from './zutat.service';

describe('ZutatService', () => {
  let service: ZutatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZutatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
