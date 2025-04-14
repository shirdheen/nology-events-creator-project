import React from "react";
import styles from "../Calendar/Calendar.module.scss";

interface MonthViewProps {
  daysOfWeek: string[];
  blankDays: unknown[];
  daysArray: number[];
  month: number;
  year: number;
  onDayClick: (day: number) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  daysOfWeek,
  blankDays,
  daysArray,
  month,
  year,
  onDayClick,
}) => {
  const today = new Date();

  return (
    // Renders the day labels at the top of the calendar grid
    <div className={styles.grid}>
      {daysOfWeek.map((day) => (
        <div key={day} className={styles.dayLabel}>
          {day}
        </div>
      ))}

      {/* Adds empty cells before day 1 of the month starts to align it properly with the correct weekday */}
      {blankDays.map((_, i) => (
        <div
          key={`blank-${i}`}
          className={`${styles.dayCell} ${styles.blankCell}`}
        ></div>
      ))}

      {/* Loops through all the days of the current month and renders them as clickable cells */}
      {daysArray.map((day) => {
        const isToday =
          day === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear();

        return (
          <div
            key={day}
            className={`${styles.dayCell} ${isToday ? styles.today : ""}`}
            onClick={() => onDayClick(day)}
          >
            {day}
          </div>
        );
      })}
    </div>
  );
};

export default MonthView;
