import React, { useEffect, useRef, useState } from "react";
import styles from "../Calendar/Calendar.module.scss";
import { Event } from "../../types/Event";
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

  const dayStart = new Date(currentDate);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(currentDate);
  dayEnd.setHours(23, 59, 59, 999);

  const dayEvents = events.filter((event) => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    return eventEnd >= dayStart && eventStart <= dayEnd;
  });

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
          slotTime.setHours(hour, 0, 0, 0);
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
            const eventStartRaw = new Date(event.startDate);
            const eventEndRaw = new Date(event.endDate);

            const eventStart =
              eventStartRaw < dayStart ? dayStart : eventStartRaw;
            const eventEnd = eventEndRaw > dayEnd ? dayEnd : eventEndRaw;

            const startHour = eventStart.getHours();
            const startMinute = eventStart.getMinutes();

            const baseTop = slotRefs.current[startHour]?.offsetTop ?? 0; // Gives pixel offset when the event starts
            const minuteOffset = (startMinute / 60) * slotHeight;
            const top = baseTop + minuteOffset;

            const durationInMinutes =
              (eventEnd.getTime() - eventStart.getTime()) / 60000;

            const height = Math.max(
              Math.round((durationInMinutes / 60) * slotHeight),
              10
            );

            const timeRange = `${eventStart.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })} - ${eventEnd.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`;

            console.log(
              `[${event.title}]`,
              `start: ${eventStart.toString()}`,
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
