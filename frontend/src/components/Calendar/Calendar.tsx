import { useEffect, useState } from "react";
import styles from "./Calendar.module.scss";
import Modal from "../Modal/Modal";
import { useCalendar } from "../../hooks/useCalendar";
import MonthView from "../views/MonthView";
import WeekView from "../views/WeekView";
import DayView from "../views/DayView";
import EventForm from "../EventForm/EventForm";
import { Event } from "../../types/Event";
import { createEvent, fetchEvents } from "../../api/eventService";

const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"]; // To show in the calendar header row
// Starts with "Sun" (index 0) since JS Date.getDay() treats Sunday as 0

type ViewMode = "month" | "week" | "day";

const Calendar: React.FC = () => {
  // Declares a function React component using TypeScript

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  const [events, setEvents] = useState<Event[]>([]);

  const {
    currentDate,
    year,
    month,
    daysArray,
    blankDays,
    goToPrevMonth,
    goToNextMonth,
    goToNextWeek,
    goToPrevWeek,
    goToNextDay,
    goToPrevDay,
    goToToday,
  } = useCalendar();

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch((err) => console.error("Failed to fetch events", err));
  });

  const handlePrev = () => {
    if (viewMode === "month") goToPrevMonth();
    else if (viewMode === "week") goToPrevWeek();
    else if (viewMode === "day") goToPrevDay();
  };

  const handleNext = () => {
    if (viewMode === "month") goToNextMonth();
    else if (viewMode === "week") goToNextWeek();
    else if (viewMode === "day") goToNextDay();
  };

  const handleToday = () => {
    goToToday();
  };

  const addEvent = async (eventData: Omit<Event, "id">) => {
    try {
      const savedEvent = await createEvent(eventData);
      setEvents((prev) => [...prev, savedEvent]);
    } catch (err) {
      console.error("Failed to add event:", err);
    }
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <div className={styles.navGroup}>
          <button onClick={handlePrev}>{"<"}</button>
          <h2>
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          {/* Formats month as full string in local language */}
          <button onClick={handleNext}>{">"}</button>
        </div>
      </div>

      <div className={styles.todayWrapper}>
        <button onClick={handleToday} className={styles.todayButton}>
          Today
        </button>
      </div>

      {/* View mode toggle */}
      <div className={styles.viewToggle}>
        <button
          className={viewMode === "month" ? styles.active : ""}
          onClick={() => setViewMode("month")}
        >
          Month
        </button>
        <button
          className={viewMode === "week" ? styles.active : ""}
          onClick={() => setViewMode("week")}
        >
          Week
        </button>
        <button
          className={viewMode === "day" ? styles.active : ""}
          onClick={() => setViewMode("day")}
        >
          Day
        </button>
      </div>

      {/* View components */}
      {viewMode === "month" && (
        <MonthView
          daysOfWeek={daysOfWeek}
          blankDays={blankDays}
          daysArray={daysArray}
          month={month}
          year={year}
          onDayClick={(day) => {
            const date = new Date(year, month, day, 12);
            setSelectedDate(date);
          }}
          events={events}
        />
      )}
      {viewMode === "week" && (
        <WeekView
          currentDate={currentDate}
          onDayClick={(date) => {
            setSelectedDate(date);
          }}
        />
      )}
      {viewMode === "day" && <DayView currentDate={currentDate} />}

      <Modal
        isOpen={selectedDate !== null}
        onClose={() => setSelectedDate(null)}
      >
        <h3>Add New Event</h3>
        {selectedDate && (
          <EventForm
            defaultDate={selectedDate}
            onSubmit={
              (event) => {
                addEvent(event);
                setSelectedDate(null);
              } // Close modal
            }
          />
        )}
      </Modal>
    </div>
  );
};

export default Calendar;
