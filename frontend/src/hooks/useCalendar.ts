import { useState } from "react";
import { getCalendarMeta } from "../utils/calendar";

export function useCalendar() {
  // Declares a function React component using TypeScript
  const [currentDate, setCurrentDate] = useState(new Date()); // Sets up state to hold the "current" date that the calendar is displaying
  // Initially set to new Date() - today's date
  // setCurrentDate updates the state when switching months

  const calendarMeta = getCalendarMeta(currentDate);

  const goToPrevMonth = () => {
    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    ); // Goes to the previous month by creating a new Date object
    setCurrentDate(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    ); // Goes to the next month similarly
    setCurrentDate(nextMonth);
  };

  // Date automatically handles year overflow

  const goToPrevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
  };

  const goToNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };

  const goToPrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const goToNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return {
    currentDate,
    ...calendarMeta,
    goToPrevMonth,
    goToNextMonth,
    goToPrevWeek,
    goToNextWeek,
    goToPrevDay,
    goToNextDay,
    setCurrentDate,
    goToToday,
  };
}
