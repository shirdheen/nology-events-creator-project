package com.shirdheen.events_creator.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.shirdheen.events_creator.dto.EventDTO;
import com.shirdheen.events_creator.dto.EventRequest;
import com.shirdheen.events_creator.model.Event;
import com.shirdheen.events_creator.repository.EventRepository;

public class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventService eventService;

    private Event sampleEvent;
    private EventRequest sampleRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        sampleEvent = Event.builder().id(1L).title("Test Event").description("Description")
                .startDate(LocalDateTime.now().plusDays(1)).endDate(LocalDateTime.now().plusDays(2))
                .location("Melbourne").labels(List.of("Work", "Meeting")).build();

        sampleRequest = EventRequest.builder().title("New Event").description("New Description")
                .startDate(LocalDateTime.now().plusDays(1)).endDate(LocalDateTime.now().plusDays(2)).location("Sydney")
                .labels(List.of("Work")).build();
    }

    @Test
    void testGetEvents_NoFilters() {
        when(eventRepository.findAll()).thenReturn(List.of(sampleEvent));

        List<EventDTO> result = eventService.getEvents(null, null);

        assertEquals(1, result.size());
        verify(eventRepository).findAll();
    }

    @Test
    void testGetEvents_LabelOnly() {
        when(eventRepository.findByLabelsContainingIgnoreCase("Work")).thenReturn(List.of(sampleEvent));

        List<EventDTO> result = eventService.getEvents("Work", null);

        assertEquals(1, result.size());
        verify(eventRepository).findByLabelsContainingIgnoreCase("Work");
    }

    @Test
    void testGetEvents_LabelAndLocation() {
        when (eventRepository.findByLabelsContainingIgnoreCaseAndLocationIgnoreCase("Work", "Melbourne")).thenReturn(List.of(sampleEvent));

        List<EventDTO> result = eventService.getEvents("Work", "Melbourne");

        assertEquals(1, result.size());
        verify(eventRepository).findByLabelsContainingIgnoreCaseAndLocationIgnoreCase("Work", "Melbourne");
    }

    @Test
    void testGetEventById_Success() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(sampleEvent));

        EventDTO result = eventService.getEventById(1L);

        assertEquals(sampleEvent.getId(), result.getId());
        assertEquals(sampleEvent.getTitle(), result.getTitle());
    }

    @Test
    void testGetEventById_NotFound() {
        when(eventRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> eventService.getEventById(1L));
    }

    @Test
    void testCreateEvent_Success() {
        when(eventRepository.save(any(Event.class))).thenReturn(sampleEvent);

        EventDTO result = eventService.createEvent(sampleRequest);

        assertEquals(sampleEvent.getTitle(), result.getTitle());
        verify(eventRepository).save(any(Event.class));
    }

    @Test
    void testCreateEvent_EndBeforeStart_ShouldThrow() {
        sampleRequest.setEndDate(sampleRequest.getStartDate().minusHours(1));

        assertThrows(IllegalArgumentException.class, () -> eventService.createEvent(sampleRequest));
    }

    @Test
    void testUpdateEvent_Success() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(sampleEvent));
        when(eventRepository.save(any(Event.class))).thenReturn(sampleEvent);

        EventDTO result = eventService.updateEvent(1L, sampleRequest);

        assertEquals(sampleRequest.getTitle(), result.getTitle());
    }

    @Test
    void testUpdateEvent_EventInPast_ShouldThrow() {
        sampleEvent.setStartDate(LocalDateTime.now().minusDays(2));

        when(eventRepository.findById(1L)).thenReturn(Optional.of(sampleEvent));

        assertThrows(IllegalArgumentException.class, () -> eventService.updateEvent(1L, sampleRequest));
    }

    @Test
    void testUpdateEvent_EndBeforeStart_ShouldThrow() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(sampleEvent));
        sampleRequest.setEndDate(sampleRequest.getStartDate().minusHours(1));

        assertThrows(IllegalArgumentException.class, () -> eventService.updateEvent(1L, sampleRequest));
    }

    @Test
    void testDeleteEvent_Success() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(sampleEvent));

        eventService.deleteEvent(1L);

        verify(eventRepository).delete(sampleEvent);
    }

    @Test
    void testDeleteEvent_NotFound() {
        when(eventRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> eventService.deleteEvent(1L));
    }

    @Test
    void testSanitiseLabels() {
        List<String> rawLabels = List.of("  Work  ", "", "Meeting", "Work");
        List<String> cleaned = eventService.sanitiseLabels(rawLabels);

        assertEquals(List.of("Work", "Meeting"), cleaned);
    }

    @Test
    void testSanitiseLabels_NullInput() {
        List<String> cleaned = eventService.sanitiseLabels(null);

        assertEquals(List.of(), cleaned);
    }


}
