import {TestBed} from '@angular/core/testing';

import {UsefulLinksService} from './useful-links.service';

describe('UsefulLinksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsefulLinksService = TestBed.get(UsefulLinksService);
    expect(service).toBeTruthy();
  });
});
