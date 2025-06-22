package com.shirdheen.events_creator.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shirdheen.events_creator.dto.EventDTO;
import com.shirdheen.events_creator.dto.EventRequest;
import com.shirdheen.events_creator.service.EventService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EventController.class)
class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EventService eventService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /events should return list of events")
    void getAllEvents() throws Exception {
        EventDTO event = EventDTO.builder().id(1L).title("Team Meeting").description("Discuss project")
                .startDate(LocalDateTime.now()).endDate(LocalDateTime.now().plusHours(1)).location("Melbourne")
                .labels(List.of("Work")).build();

        Mockito.when(eventService.getEvents(null, null)).thenReturn(List.of(event));

        mockMvc.perform(get("/events")).andExpect(status().isOk()).andExpect(jsonPath("$.size()").value(1))
                .andExpect(jsonPath("$[0].title").value("Team Meeting"));
    }

    @Test
    @DisplayName("POST /events should create a new event")
    void createEvent() throws Exception {
        EventRequest request = EventRequest.builder().title("New Event").description("Test description")
                .startDate(LocalDateTime.now()).endDate(LocalDateTime.now().plusHours(2)).location("Remote")
                .labels(List.of("Work")).build();

        EventDTO response = EventDTO.builder().id(1L).title(request.getTitle()).description(request.getDescription())
                .startDate(request.getStartDate()).endDate(request.getEndDate()).location(request.getLocation())
                .labels(request.getLabels()).build();

        Mockito.when(eventService.createEvent(any(EventRequest.class))).thenReturn(response);

        mockMvc.perform(post("/events").contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))).andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("New Event"));
    }

    @Test
    @DisplayName("PUT /events/{id} should update an event")
    void updateEvent() throws Exception {
        EventRequest updatedRequest = new EventRequest("Updated Title", "Updated description",
                LocalDateTime.of(2025, 6, 1, 9, 0), LocalDateTime.of(2025, 7, 1, 10, 0), "Sydney",
                List.of("Work", "Important"));
        
        EventDTO updatedEvent = EventDTO.builder().id(1L).title(updatedRequest.getTitle()).description(updatedRequest.getDescription()).startDate(updatedRequest.getStartDate()).endDate(updatedRequest.getEndDate()).location(updatedRequest.getLocation()).labels(updatedRequest.getLabels()).build();

        Mockito.when(eventService.updateEvent(eq(1L), any(EventRequest.class))).thenReturn(updatedEvent);

        mockMvc.perform(put("/events/{id}", 1L).contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(updatedEvent))).andExpect(status().isOk()).andExpect(jsonPath("$.id").value(1L)).andExpect(jsonPath("$.title").value("Updated Title")).andExpect(jsonPath("$.location").value("Sydney"));

        Mockito.verify(eventService).updateEvent(eq(1L), any(EventRequest.class));
    }

    @Test
    @DisplayName("DELETE /events/{id} should delete event")
    void deleteEvent() throws Exception {
        mockMvc.perform(delete("/events/{id}", 1L)).andExpect(status().isNoContent());

        Mockito.verify(eventService).deleteEvent(1L);
    }
}
