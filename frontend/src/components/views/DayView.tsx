import React, { useEffect, useRef, useState } from "react";
import styles from "../Calendar/Calendar.module.scss";
import { Event } from "../../types/Event";
import { formatDateKey } from "../../utils/date";
import EventCard from "../EventCard/EventCard";

interface DayViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => i);
const slotHeight = 80;

const DayView: React.FC<DayViewProps> = ({
  currentDate,
  events,
  onEventClick,
}) => {
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [refsReady, setRefsReady] = useState(false);

  const dayEvents = events.filter(
    (event) => formatDateKey(event.startDate) === formatDateKey(currentDate)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setRefsReady(true);
    }, 0);
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
        {hours.map((hour, idx) => (
          <div
            key={hour}
            className={styles.timeSlot}
            ref={(el) => {
              slotRefs.current[idx] = el;
            }}
          >
            <span className={styles.timeLabel}>
              {hour.toString().padStart(2, "0")}:00
            </span>
            <div className={styles.slotContent}>
              {/* <span className={styles.placeholderText}>No events</span> */}
            </div>
          </div>
        ))}

        {refsReady &&
          dayEvents.map((event) => {
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);

            const startHour = startDate.getHours();
            const startMinute = startDate.getMinutes();
            const endHour = endDate.getHours();
            const endMinute = endDate.getMinutes();

            const totalStart = startHour + startMinute / 60;
            const totalEnd = endHour + endMinute / 60;
            const duration = totalEnd - totalStart;

            const baseTop = slotRefs.current[startHour]?.offsetTop ?? 0;
            const minuteOffset = (startMinute / 60) * slotHeight;
            const top = baseTop + minuteOffset;
            const durationInMinutes =
              (endDate.getTime() - startDate.getTime()) / 60000;
            const height = (durationInMinutes / 60) * slotHeight;

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
