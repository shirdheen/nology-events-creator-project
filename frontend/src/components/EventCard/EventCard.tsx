import { Event } from "../../types/Event";
import { getColorForLabel } from "../../utils/color";
import styles from "./EventCard.module.scss";

interface EventCardProps {
  event: Event;
  onClick: (event: Event) => void;
  className?: string;
  timeRange?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onClick,
  className,
  timeRange,
}) => {
  const startTime = new Date(event.startDate).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`${styles.eventCard} ${className || ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
    >
      <div className={styles.labels}>
        {event.labels.map((label) => (
          <span
            key={label}
            className={styles.labelTag}
            style={{ backgroundColor: getColorForLabel(label) }}
          >
            {label}
          </span>
        ))}
      </div>

      <div className={styles.title}>{event.title}</div>
      <div className={styles.time}>
        {timeRange ||
          new Date(event.startDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
      </div>
    </div>
  );
};

export default EventCard;
