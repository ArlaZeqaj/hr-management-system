package com.example.hrsystem.controller;

import com.example.hrsystem.service.CalendarEventService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/calendar-events")
public class CalendarEventController {

    private final CalendarEventService calendarEventService;

    public CalendarEventController(CalendarEventService calendarEventService) {
        this.calendarEventService = calendarEventService;
    }

    @GetMapping("/{yearMonth}")
    public ResponseEntity<?> getCalendarEventsForMonth(
            @PathVariable String yearMonth,
            Authentication authentication) {
        try {
            var result = calendarEventService.getCalendarEventsForMonth(yearMonth);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching calendar events.");
        }
    }
}
