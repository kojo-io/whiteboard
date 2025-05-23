import { TestBed } from '@angular/core/testing';

import { TailwindClassService } from './tailwind-class.service';

describe('TailwindClassService', () => {
  let service: TailwindClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TailwindClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
