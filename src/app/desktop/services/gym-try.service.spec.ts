import {TestBed} from '@angular/core/testing';

import {GymTryService} from './gym-try.service';

describe('GymTryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GymTryService = TestBed.get(GymTryService);
    expect(service).toBeTruthy();
  });
});
