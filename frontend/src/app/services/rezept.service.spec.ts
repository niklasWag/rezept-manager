import { TestBed } from '@angular/core/testing';

import { RezeptService } from './rezept.service';

describe('RezeptService', () => {
  let service: RezeptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RezeptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
