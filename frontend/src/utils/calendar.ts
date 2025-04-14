export interface CalendarMeta {
  year: number;
  month: number;
  firstDayOfMonth: Date;
  lastDayOfMonth: Date;
  startDayIndex: number;
  totalDays: number;
  daysArray: number[];
  blankDays: unknown[];
}

export function getCalendarMeta(date: Date): CalendarMeta {
  const year = date.getFullYear();
  const month = date.getMonth();

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date

  const firstDayOfMonth = new Date(year, month, 1); // The first day of the current month
  const lastDayOfMonth = new Date(year, month + 1, 0); // The last day of the current month. Setting day to 0 for the next month gives the last day of this month
  const startDayIndex = firstDayOfMonth.getDay(); // Day of week the month starts on (0-6)
  const totalDays = lastDayOfMonth.getDate(); // Total number of days in this month (28, 30, 31)

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from

  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1); // Creates an array [1, 2, ...., totalDays] to render each day of the month

  const blankDays = Array.from({ length: startDayIndex }); // Creates an array of empty slots for padding before the 1st of the month, so days align correctly to the weekday
  blankDays;

  return {
    year,
    month,
    firstDayOfMonth,
    lastDayOfMonth,
    startDayIndex,
    totalDays,
    daysArray,
    blankDays,
  };
}
