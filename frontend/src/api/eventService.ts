import { Event } from "../types/Event";

const API_BASE = "http://localhost:8080/events";

export const fetchEvents = async (
  label?: string,
  location?: string
): Promise<Event[]> => {
  const params = new URLSearchParams();
  if (label) params.append("label", label);
  if (location) params.append("location", location);

  const res = await fetch(`${API_BASE}?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
};

export const fetchEventsById = async (id: string | number): Promise<Event> => {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error("Event not found");
  return res.json();
};

export const createEvent = async (event: Omit<Event, "id">): Promise<Event> => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create event");
  }

  return res.json();
};

export const updateEvent = async (
  id: string | number,
  event: Partial<Event>
): Promise<Event> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create event");
  }

  return res.json();
};

export const deleteEvent = async (id: string | number): Promise<void> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete event");
  }
};
