package com.shirdheen.events_creator.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shirdheen.events_creator.dto.EventDTO;
import com.shirdheen.events_creator.dto.EventRequest;
import com.shirdheen.events_creator.service.EventService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {
    
    private final EventService eventService;

    @PostMapping
    public ResponseEntity<EventDTO> createEvent(@Valid @RequestBody EventRequest request) {
        EventDTO createdEvent = eventService.createEvent(request);
        return ResponseEntity.status(201).body(createdEvent);
    }
}
