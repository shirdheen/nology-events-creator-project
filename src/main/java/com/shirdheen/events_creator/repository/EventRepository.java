package com.shirdheen.events_creator.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shirdheen.events_creator.model.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
    
}
