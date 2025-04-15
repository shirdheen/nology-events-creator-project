import React from "react";
import styles from "../Calendar/Calendar.module.scss";
import { formatDateKey } from "../../utils/date";
import { Event } from "../../types/Event";

interface MonthViewProps {
  daysOfWeek: string[];
  blankDays: unknown[];
  daysArray: number[];
  month: number;
  year: number;
  onDayClick: (day: number) => void;
  events: Event[];
}

const MonthView: React.FC<MonthViewProps> = ({
  daysOfWeek,
  blankDays,
  daysArray,
  month,
  year,
  onDayClick,
  events,
}) => {
  const getEventsForDay = (day: number) => {
    const dateKey = formatDateKey(new Date(year, month, day));
    return events.filter((e) => formatDateKey(e.startDate) === dateKey);
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

              {dayEvents.map((event) => (
                <div key={event.id} className={styles.eventCard}>
                  {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MonthView;
