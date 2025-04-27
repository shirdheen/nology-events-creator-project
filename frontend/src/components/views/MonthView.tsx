import React from "react";
import styles from "../Calendar/Calendar.module.scss";
import { Event } from "../../types/Event";
import EventCard from "../EventCard/EventCard";

interface MonthViewProps {
  daysOfWeek: string[];
  blankDays: unknown[];
  daysArray: number[];
  month: number;
  year: number;
  onDayClick: (day: number) => void;
  events: Event[];
  onEventClick: (event: Event) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  daysOfWeek,
  blankDays,
  daysArray,
  month,
  year,
  onDayClick,
  events,
  onEventClick,
}) => {
  const getEventsForDay = (day: number) => {
    const currentDate = new Date(year, month, day);
    currentDate.setHours(0, 0, 0, 0);

    return events
      .filter((event) => {
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        return currentDate >= start && currentDate <= end;
      })
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
  };

  const today = new Date();

  return (
    <>
      {/* Renders the day labels at the top of the calendar grid */}
      <div className={styles.dayLabelsRow}>
        {daysOfWeek.map((day) => (
          <div key={day} className={styles.dayLabel}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {/* Adds empty cells before day 1 of the month starts to align it properly with the correct weekday */}
        {blankDays.map((_, i) => (
          <div
            key={`blank-${i}`}
            className={`${styles.dayCell} ${styles.blankCell}`}
          ></div>
        ))}

        {/* Loops through all the days of the current month and renders them as clickable cells */}
        {daysArray.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isToday =
            today.getMonth() === month &&
            today.getDate() === day &&
            today.getFullYear() === year;
          return (
            <div
              key={day}
              className={`${styles.dayCell} ${isToday ? styles.today : ""} `}
              onClick={() => onDayClick(day)}
            >
              <div className={styles.dayNumber}>{day}</div>

              {dayEvents.map((event) => {
                const eventStartDate = new Date(event.startDate);
                const isContinuation =
                  eventStartDate.getDate() !== day ||
                  eventStartDate.getMonth() !== month ||
                  eventStartDate.getFullYear() !== year;

                return (
                  <EventCard
                    key={`${event.id}-${day}`}
                    event={event}
                    onClick={onEventClick}
                    showContinuousBadge={isContinuation}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MonthView;
