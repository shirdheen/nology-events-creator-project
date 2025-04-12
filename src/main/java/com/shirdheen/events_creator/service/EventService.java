package com.shirdheen.events_creator.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.shirdheen.events_creator.dto.EventDTO;
import com.shirdheen.events_creator.dto.EventRequest;
import com.shirdheen.events_creator.model.Event;
import com.shirdheen.events_creator.repository.EventRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public List<EventDTO> getEvents(String label, String location) {
        List<Event> events;

        if (label != null) {
            events = eventRepository.findByLabelsContainingIgnoreCase(label);
        } else if (location != null) {
            events = eventRepository.findByLocationIgnoreCase(location);
        } else {
            events = eventRepository.findAll();
        }

        return events.stream().map(this::mapToDTO).toList();
    }

    public EventDTO getEventById(Long id) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Event not found with id " + id));

        return mapToDTO(event);
    }

    public EventDTO createEvent(EventRequest request) {
        Event event = Event.builder().title(request.getTitle()).description(request.getDescription())
                .date(request.getDate()).location(request.getLocation()).labels(request.getLabels()).build();

        return mapToDTO(eventRepository.save(event));
    }

    public EventDTO updateEvent(Long id, EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Event not found with id " + id));

        if (event.getDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Cannot update past events");
        }

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setDate(request.getDate());
        event.setLocation(request.getLocation());
        event.setLabels(request.getLabels());

        return mapToDTO(eventRepository.save(event));
    }

    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Event not found with id " + id));

        eventRepository.delete(event);
    }

    private EventDTO mapToDTO(Event event) {
        return EventDTO.builder().id(event.getId()).title(event.getTitle()).description(event.getDescription())
                .date(event.getDate()).location(event.getLocation()).labels(event.getLabels()).build();
    }
}
