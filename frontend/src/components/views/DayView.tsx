import React from "react";
import styles from "../Calendar/Calendar.module.scss";

interface DayViewProps {
  currentDate: Date;
}

const hours = Array.from({ length: 24 }, (_, i) => i);

const DayView: React.FC<DayViewProps> = ({ currentDate }) => {
  return (
    <div className={styles.dayView}>
      <h3 className={styles.dayTitle}>
        {currentDate.toLocaleDateString("default", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </h3>

      <div className={styles.timeline}>
        {hours.map((hour) => (
          <div key={hour} className={styles.timeSlot}>
            <span className={styles.timeLabel}>
              {hour.toString().padStart(2, "0")}:00
            </span>
            <div className={styles.slotContent}>
              <span className={styles.placeholderText}>No events</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayView;
