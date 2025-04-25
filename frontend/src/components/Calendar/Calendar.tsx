import { useEffect, useState } from "react";
import styles from "./Calendar.module.scss";
import Modal from "../Modal/Modal";
import { useCalendar } from "../../hooks/useCalendar";
import MonthView from "../views/MonthView";
import WeekView from "../views/WeekView";
import DayView from "../views/DayView";
import EventForm from "../EventForm/EventForm";
import { Event } from "../../types/Event";
import {
  createEvent,
  fetchEvents,
  updateEvent as updateEventAPI,
  deleteEvent as deleteEventAPI,
} from "../../api/eventService";
import EventDetailsModal from "../EventDetailsModal/EventDetailsModal";
import EventFilter from "../EventFilter/EventFilter";

const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"]; // To show in the calendar header row
// Starts with "Sun" (index 0) since JS Date.getDay() treats Sunday as 0

type ViewMode = "month" | "week" | "day";

const Calendar: React.FC = () => {
  // Declares a function React component using TypeScript

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

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

  const loadEvents = () => {
    fetchEvents(selectedLabel, selectedLocation)
      .then((fetchedEvents) => {
        setEvents(fetchedEvents);
        if (!selectedLabel && !selectedLocation) {
          setAllEvents(fetchedEvents);
        }
      })
      .catch((err) => console.error("Failed to fetch events", err));
  };

  useEffect(() => {
    fetchEvents()
      .then(setAllEvents)
      .catch((err) => console.error("Failed to fetch all events", err));

    loadEvents();
  }, [selectedLabel, selectedLocation]);

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

  const handleTimeSlotClick = (date: Date) => {
    setSelectedDate(date);
    setEditMode(false);
    setIsFormOpen(true);
    setSelectedEvent(null);
  };

  const addEvent = async (eventData: Omit<Event, "id">) => {
    try {
      const savedEvent = await createEvent(eventData);
      setEvents((prev) => [...prev, savedEvent]);
      setAllEvents((prev) => [...prev, savedEvent]);
    } catch (err) {
      console.error("Failed to add event:", err);
    }
  };

  const updateEvent = async (id: string | number, updated: Partial<Event>) => {
    try {
      const saved = await updateEventAPI(id, updated);
      setEvents((prev) => prev.map((e) => (e.id === saved.id ? saved : e)));
    } catch (err) {
      console.error("Failed to update event:", err);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await deleteEventAPI(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      setSelectedEvent(null);
    } catch (err) {
      console.error("Failed to delete event:", err);
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

      {/* Event filter */}
      {viewMode === "month" && (
        <EventFilter
          selectedLabel={selectedLabel}
          selectedLocation={selectedLocation}
          onLabelChange={setSelectedLabel}
          onLocationChange={setSelectedLocation}
          labels={[...new Set(allEvents.flatMap((e) => e.labels || []))]}
        />
      )}

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
            setEditMode(false);
            setIsFormOpen(true);
            setSelectedEvent(null);
          }}
          events={events}
          onEventClick={(event) => setSelectedEvent(event)}
        />
      )}
      {viewMode === "week" && (
        <WeekView
          currentDate={currentDate}
          onDayClick={(date) => {
            setSelectedDate(date);
          }}
          events={events}
          onEventClick={(event) => setSelectedEvent(event)}
        />
      )}
      {viewMode === "day" && (
        <DayView
          currentDate={currentDate}
          events={events}
          onEventClick={setSelectedEvent}
          onTimeSlotClick={handleTimeSlotClick}
        />
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        zIndex={1100}
      >
        <h3>{editMode ? "Edit Event" : "Add New Event"}</h3>
        {isFormOpen && (selectedDate || selectedEvent) && (
          <EventForm
            defaultDate={selectedDate || new Date()}
            defaultEvent={editMode ? selectedEvent ?? undefined : undefined}
            onSubmit={
              (event) => {
                if (editMode && selectedEvent) {
                  updateEvent(selectedEvent.id, event);
                } else {
                  addEvent(event);
                }
                setIsFormOpen(false);
                setSelectedEvent(null);
                setEditMode(false);
              } // Close modal
            }
          />
        )}
      </Modal>
      <EventDetailsModal
        isOpen={selectedEvent !== null && !isFormOpen}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEdit={(event) => {
          setEditMode(true);
          setSelectedEvent(event);
          setSelectedDate(new Date(event.startDate));
          setIsFormOpen(true);
        }}
        onDelete={(event) => deleteEvent(event.id)}
      />
    </div>
  );
};

export default Calendar;
