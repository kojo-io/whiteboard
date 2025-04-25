import { TestBed } from '@angular/core/testing';

import { MonacoLoaderService } from './monaco-loader.service';

describe('MonacoLoaderService', () => {
  let service: MonacoLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonacoLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
