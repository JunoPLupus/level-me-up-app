import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(): ValidatorFn {

  return (formGroup: AbstractControl): ValidationErrors | null => {

    const startDateStr = formGroup.get('startDate')?.value;
    const startTimeStr = formGroup.get('startTime')?.value;
    const endDateStr = formGroup.get('endDate')?.value;
    const endTimeStr = formGroup.get('endTime')?.value;

    if ( !startDateStr || !startTimeStr || !endDateStr ) {
      return null;
    }

    const startDateTime = new Date(startDateStr);
    const [startHours, startMinutes] = startTimeStr.split(':').map(Number);
    startDateTime.setHours(startHours, startMinutes, 0, 0);

    const endDateTime = new Date(endDateStr);
    const finalEndTime = endTimeStr || '23:59';
    const [endHours, endMinutes] = finalEndTime.split(':').map(Number);
    endDateTime.setHours(endHours, endMinutes, 0, 0);

    if (startDateTime > endDateTime) {
      return { invalidDateRange: true };
    }

    return null;
  };
}
