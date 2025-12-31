export function formatTimeForInput(date: Date | undefined | null): string {
  if (!date) return '';

  return new Date(date).toTimeString().slice(0, 5);
}
