package com.shirdheen.events_creator.integration;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shirdheen.events_creator.dto.EventRequest;
import com.shirdheen.events_creator.model.Event;
import com.shirdheen.events_creator.repository.EventRepository;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class EventIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        eventRepository.deleteAll();
    }

    @Test
    void shouldCreateAndFetchEvent() throws Exception {
        EventRequest eventRequest = new EventRequest("Integration Test Event", "Integration description",
                LocalDateTime.of(2025, 5, 10, 14, 0), LocalDateTime.of(2025, 7, 10, 15, 0), "Melbourne",
                List.of("Work"));

        mockMvc.perform(post("/events").contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(eventRequest))).andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Integration Test Event"));

        mockMvc.perform(get("/events")).andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void shouldUpdateEvent() throws Exception {
        Event event = Event.builder().title("Old Title").description("Old Description").startDate(LocalDateTime.of(2025,8,1,10,0)).endDate(LocalDateTime.of(2025, 7, 1, 11, 0)).location("Sydney").labels(List.of("Work")).build();

        event = eventRepository.save(event);

        EventRequest updateRequest = new EventRequest("New Title", "New Description", LocalDateTime.of(2025, 7, 1, 12, 0), LocalDateTime.of(2025, 7, 1, 13, 0), "Brisbane", List.of("Updated"));

        mockMvc.perform(put("/events/{id}", event.getId()).contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(updateRequest))).andExpect(status().isOk()).andExpect(jsonPath("$.title").value("New Title"));
    }

    @Test
    void shouldDeleteEvent() throws Exception {
        Event event = Event.builder().title("Delete Me").description("To be deleted").startDate(LocalDateTime.of(2025, 8, 5, 9, 0)).endDate(LocalDateTime.of(2025, 7, 5, 10, 0)).location("Remote").labels(List.of("Temp")).build();
        event = eventRepository.save(event);

        mockMvc.perform(delete("/events/{id}", event.getId())).andExpect(status().isNoContent());

        assertThat(eventRepository.findById(event.getId())).isEmpty();
    }
}
