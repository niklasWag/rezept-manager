import { TestBed } from '@angular/core/testing';

import { LebensmittelService } from './lebensmittel.service';

describe('ZutatService', () => {
  let service: LebensmittelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LebensmittelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
