import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(): ValidatorFn {

  return (form: AbstractControl): ValidationErrors | null => {

    const startDate = form.get('startDate')?.value;
    const startTime = form.get('startTime')?.value;
    const endDate = form.get('endDate')?.value;
    const endTime = form.get('endTime')?.value;

    if ( !startDate || !startTime || !endDate ) {
      return null;
    }

    const startDateTime = new Date(startDate);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    startDateTime.setHours(startHours, startMinutes);

    const endDateTime = new Date(endDate);
    const finalEndTime = endTime || '23:59';
    const [endHours, endMinutes] = finalEndTime.split(':').map(Number);
    endDateTime.setHours(endHours, endMinutes);

    if (startDateTime > endDateTime) {
      return { dateRange: true };
    }

    return null;
  };
}
