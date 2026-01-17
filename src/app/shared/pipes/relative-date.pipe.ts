import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'relativeDate',
  standalone: true,
})

export class RelativeDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(dateValue: Date | string | undefined | null, showTime : boolean = true): string {
    if (!dateValue) {
      return '';
    }

    const date = new Date(dateValue);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);


    const timeString = this.datePipe.transform(date, 'HH:mm');

    if (date.toDateString() === today.toDateString()) {
      return showTime? `Hoje às ${timeString}` : 'Hoje';
    }

    if (date.toDateString() === tomorrow.toDateString()) {
      return showTime? `Amanhã às ${timeString}` : 'Amanhã';
    }

    const fullDate = showTime?
      this.datePipe.transform(date, 'dd/MM \'às\' HH:mm'):
      this.datePipe.transform(date, 'dd/MM');

    return fullDate || '';
  }
}
