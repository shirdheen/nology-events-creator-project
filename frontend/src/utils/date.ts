import { WeekDate } from "../types/week-date";

export function getStartOfWeek(date: Date): Date {
  const day = date.getDay(); // Gets the weekday as a number
  const start = new Date(date); // Creates a copy of the input date so that the original remains unchanged
  start.setDate(date.getDate() - day); // Subtracts the number of days needed to get back to Sunday
  start.setHours(0, 0, 0, 0); // Resets the time to the very beginning of the day (midnight)
  return start;
}

export function getVisibleMonthForWeek(startOfWeek: Date): number {
  const middleDay = new Date(startOfWeek);
  middleDay.setDate(startOfWeek.getDate() + 3);
  return middleDay.getMonth();
}

// Builds an array of 7 days starting from the start of week date (Sunday)
// Each date is returned with an extra flag: isOverflow to mark if it's outside the current month
export function getWeekDatesWithMeta(
  startOfWeek: Date,
  currentMonth: number
): WeekDate[] {
  return Array.from({ length: 7 }, (_, i) => {
    // Creates an array of 7 elements using a mapping function (value is not being used, only the index is required)
    const date = new Date(startOfWeek); // Clone startOfWeek
    date.setDate(startOfWeek.getDate() + i); // Move forward by i days
    const isOverflow = date.getMonth() !== currentMonth; // If the date's month doesn't match the current month, it is an overflow date
    return { date, isOverflow };
  });
}
