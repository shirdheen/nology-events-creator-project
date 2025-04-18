import { Event } from "../../types/Event";
import { getColorForLabel } from "../../utils/color";
import styles from "./EventCard.module.scss";

interface EventCardProps {
  event: Event;
  onClick: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const startTime = new Date(event.startDate).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={styles.eventCard}
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
      <div className={styles.time}>{startTime}</div>
    </div>
  );
};

export default EventCard;
