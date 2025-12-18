import { TestBed } from '@angular/core/testing';

import { LevelCalculatorService } from './level-calculator.service';

describe('LevelCalculatorService', () => {
  let service: LevelCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LevelCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
