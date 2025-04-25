import { TestBed } from '@angular/core/testing';

import { RadioButtonService } from './radio-button.service';

describe('RadioButtonService', () => {
  let service: RadioButtonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadioButtonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
