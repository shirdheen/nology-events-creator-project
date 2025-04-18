import React, { useEffect, useState } from "react";
import { Event } from "../../types/Event";
import styles from "./EventDetailsModal.module.scss";
import Modal from "../Modal/Modal";

interface Props {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailsModal: React.FC<Props> = ({ event, isOpen, onClose }) => {
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    if (!event) return;

    const updateCountdown = () => {
      if (!event?.startDate) return;

      const now = new Date();
      const [datePart, timePart] = event.startDate.split("T");
      const [year, month, day] = datePart.split("-").map(Number);
      const [hourPart, minutePart] = timePart.split(":").map(Number);

      const eventStart = new Date(year, month - 1, day, hourPart, minutePart);

      const diff = eventStart.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("Event has started or passed.");
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [event]);

  if (!event) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalContent}>
        <h2>{event.title}</h2>
        <p>
          <strong>Start:</strong> {new Date(event.startDate).toLocaleString()}
        </p>
        <p>
          <strong>End:</strong> {new Date(event.endDate).toLocaleString()}
        </p>
        <p>
          <strong>Location:</strong> {event.location}
        </p>
        <p>
          <strong>Description:</strong> {event.description || "N/A"}
        </p>
        <p>
          <strong>Labels:</strong> {event.labels.join(", ") || "None"}
        </p>

        <div className={styles.countdown}>
          <strong>Countdown:</strong> {timeRemaining}
        </div>
      </div>
    </Modal>
  );
};

export default EventDetailsModal;
