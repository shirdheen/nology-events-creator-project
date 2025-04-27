package com.shirdheen.events_creator.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shirdheen.events_creator.model.Event;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByLabelsContainingIgnoreCase(String label);

    List<Event> findByLabelsContainingIgnoreCaseAndLocationIgnoreCase(String label, String location);

    List<Event> findByLocationIgnoreCase(String location);
    
}
