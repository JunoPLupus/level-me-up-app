export function isValid(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

export function isValidRange(startDate: Date, endDate: Date): boolean {
  return startDate.getTime() <= endDate.getTime();
}

export function isFutureDate(date: Date) : boolean {
  return date.getTime() > Date.now();
}
