import React from "react";
import styles from "./EventFilter.module.scss";

interface EventFilterProps {
  labels: string[];
  selectedLabel: string;
  selectedLocation: string;
  onLabelChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}

const EventFilter: React.FC<EventFilterProps> = ({
  labels,
  selectedLabel,
  selectedLocation,
  onLabelChange,
  onLocationChange,
}) => {
  return (
    <div className={styles.filterControls}>
      <label>
        Label:
        <select
          value={selectedLabel}
          onChange={(e) => onLabelChange(e.target.value)}
        >
          <option value="">All</option>
          {labels.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Location:
        <input
          type="text"
          placeholder="Enter location"
          value={selectedLocation}
          onChange={(e) => onLocationChange(e.target.value)}
        />
      </label>
    </div>
  );
};

export default EventFilter;
