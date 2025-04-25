import React, { useEffect, useRef, useState } from "react";
import styles from "../Calendar/Calendar.module.scss";
import { Event } from "../../types/Event";
import { formatDateKey } from "../../utils/date";
import EventCard from "../EventCard/EventCard";

interface DayViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onTimeSlotClick: (date: Date) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => i);
const slotHeight = 82;

const DayView: React.FC<DayViewProps> = ({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
}) => {
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]); // To get vertical position on the screen
  const [refsReady, setRefsReady] = useState(false);

  const dayEvents = events.filter(
    (event) => formatDateKey(event.startDate) === formatDateKey(currentDate)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setRefsReady(true);
    }, 0); // Setting this up to wait until all refs are populated before calculating and rendering events
    return () => clearTimeout(timer);
  }, [currentDate, events]);

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
        {hours.map((hour, idx) => {
          const slotTime = new Date(currentDate);
          slotTime.setHours(hour);
          slotTime.setMinutes(0);
          slotTime.setSeconds(0);
          slotTime.setMilliseconds(0);

          return (
            <div
              key={hour}
              className={styles.timeSlot}
              ref={(el) => {
                slotRefs.current[idx] = el;
              }}
              onClick={() => onTimeSlotClick(slotTime)}
            >
              <span className={styles.timeLabel}>
                {hour.toString().padStart(2, "0")}:00
              </span>
              <div className={styles.slotContent}>
                {/* <span className={styles.placeholderText}>No events</span> */}
              </div>
            </div>
          );
        })}

        {refsReady &&
          dayEvents.map((event) => {
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);

            const startHour = startDate.getHours();
            const startMinute = startDate.getMinutes();

            const baseTop = slotRefs.current[startHour]?.offsetTop ?? 0; // Gives pixel offset when the event starts
            const minuteOffset = (startMinute / 60) * slotHeight;
            const top = baseTop + minuteOffset;

            const durationInMinutes =
              (endDate.getTime() - startDate.getTime()) / 60000;

            const height = Math.round((durationInMinutes / 60) * slotHeight);

            const timeRange = `${startDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })} - ${endDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`;

            console.log(
              `[${event.title}]`,
              `start: ${startDate.toString()}`,
              `→ startHour: ${startHour}`,
              `→ top: ${top}px`,
              `→ height: ${height}px`
            );

            return (
              <div
                key={event.id}
                className={styles.eventWrapper}
                style={{
                  position: "absolute",
                  left: "72px",
                  top: `${top}px`,
                  height: `${height}px`,
                  width: "calc(100% - 72px)",
                  zIndex: 2,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event);
                }}
              >
                <EventCard
                  className={styles.dayEventCard}
                  event={event}
                  onClick={onEventClick}
                  timeRange={timeRange}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DayView;
