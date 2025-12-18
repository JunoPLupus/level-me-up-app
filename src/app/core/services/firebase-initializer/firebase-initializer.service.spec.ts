import { TestBed } from '@angular/core/testing';

import { FirebaseInitializerService } from './firebase-initializer.service';

describe('FirebaseInitializerService', () => {
  let service: FirebaseInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
