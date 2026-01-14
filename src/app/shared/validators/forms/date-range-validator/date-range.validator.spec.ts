import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { dateRangeValidator } from './date-range.validator';

describe('DateRangeValidator', () => {

  const validator : ValidatorFn = dateRangeValidator();

  function createFormGroup(start: string, startTime: string, end: string, endTime: string) {
    return new FormGroup({
      startDate: new FormControl(start),
      startTime: new FormControl(startTime),
      endDate: new FormControl(end),
      endTime: new FormControl(endTime)
    });
  }

  it('should return null when starDate is before than endDate', () => {

    const formGroup = createFormGroup(
      '2026-01-10', '08:00', '2026-01-15', '18:00'
    );

    const result = validator(formGroup);

    expect(result).toBeNull();
  });

  it('should return null when starDate and endDate are the same date', () => {

    const formGroup = createFormGroup(
      '2026-01-10', '08:00', '2026-01-10', '08:00'
    );

    const result = validator(formGroup);

    expect(result).toBeNull();
  });

  it('should return error object when startDate is after endDate', () => {
    const formGroup = createFormGroup(
      '2026-01-15', '08:00', '2026-01-10', '18:00'
    );

    const result = validator(formGroup);

    expect(result).not.toBeNull();
    expect(result).toEqual({ invalidDateRange: true });
  });

  it('should handle when startDate or endDate is empty', () => {

    const formGroup = createFormGroup(
      '', '', '', ''
    );

    const result = validator(formGroup);

    expect(result).toBeNull();
  });

});
