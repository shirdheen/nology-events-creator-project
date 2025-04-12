package com.shirdheen.events_creator.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime date;
    private String location;
    private List<String> labels;
}
