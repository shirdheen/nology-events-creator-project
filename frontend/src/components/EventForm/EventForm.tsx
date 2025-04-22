import React, { useState } from "react";
import { Event } from "../../types/Event";
import styles from "./EventForm.module.scss";

interface EventFormProps {
  defaultDate: Date;
  onSubmit: (eventData: Omit<Event, "id">) => void;
  defaultEvent?: Event;
}

const EventForm: React.FC<EventFormProps> = ({
  defaultDate,
  onSubmit,
  defaultEvent,
}) => {
  const [title, setTitle] = useState(defaultEvent?.title || "");
  const [location, setLocation] = useState(defaultEvent?.location || "");
  const [labelInput, setLabelInput] = useState(
    defaultEvent?.labels.join(", ") || ""
  );
  const [description, setDescription] = useState(
    defaultEvent?.description || ""
  );
  const [startDate, setStartDate] = useState(
    defaultEvent?.startDate || defaultDate.toISOString().slice(0, 16)
  );
  const [endDate, setEndDate] = useState(
    defaultEvent?.endDate || defaultDate.toISOString().slice(0, 16)
  );

  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: string[] = [];

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (!title.trim()) validationErrors.push("Event title is required.");
    if (start < now)
      validationErrors.push("Start date must be in the future or now.");
    if (end <= start)
      validationErrors.push("End date must be after start date.");

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newEvent: Omit<Event, "id"> = {
      title,
      description,
      location,
      labels: labelInput
        .split(",")
        .map((l) => l.trim())
        .filter((l) => l.length > 0),
      startDate,
      endDate,
    };

    onSubmit(newEvent);

    setTitle("");
    setDescription("");
    setLocation("");
    setLabelInput("");
    setErrors([]);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {errors.length > 0 && (
        <ul className={styles.errorList}>
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      <input
        type="text"
        placeholder="Event title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="datetime-local"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />

      <input
        type="datetime-local"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        type="text"
        placeholder="Label"
        value={labelInput}
        onChange={(e) => setLabelInput(e.target.value)}
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit">Add Event</button>
    </form>
  );
};

export default EventForm;
