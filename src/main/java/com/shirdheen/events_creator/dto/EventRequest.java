package com.shirdheen.events_creator.dto;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class EventRequest {
    
    @NotBlank(message = "Title is required")
    private String title;

    @Size(max = 500, message = "Description must be under 500 characters")
    private String description;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    @Future(message = "End date must be in the future")
    private LocalDateTime endDate;
    
    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Labels list cannot be null")
    private List<@NotBlank(message = "Label cannot be blank") String> labels;
}
