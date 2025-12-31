import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'relativeDate',
  standalone: true,
})

export class RelativeDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: Date | string | undefined | null): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);


    const timeString = this.datePipe.transform(date, 'HH:mm');

    if (date.toDateString() === today.toDateString()) {
      return `Hoje às ${timeString}`;
    }

    if (date.toDateString() === tomorrow.toDateString()) {
      return `Amanhã às ${timeString}`;
    }

    return this.datePipe.transform(date, 'dd/MM \'às\' HH:mm') || '';
  }
}
