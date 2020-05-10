import { TestBed } from '@angular/core/testing';

import { CustomIconService } from './custom-icon.service';

describe('CustomIconService', () => {
  let service: CustomIconService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomIconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
