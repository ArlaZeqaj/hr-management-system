package com.example.hrsystem.controller;

import com.example.hrsystem.dto.CalendarHighlightDTO;
import com.example.hrsystem.service.CalendarHighlightService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CalendarHighlightController {

    private final CalendarHighlightService highlightService;

    public CalendarHighlightController(CalendarHighlightService highlightService) {
        this.highlightService = highlightService;
    }

    @GetMapping("/calendar-highlights")
    public ResponseEntity<?> getHighlights(Authentication authentication,
                                           @RequestParam int year,
                                           @RequestParam int month) {
        String userId = authentication.getName();
        List<CalendarHighlightDTO> highlights = new ArrayList<>();
        highlights.addAll(highlightService.getBirthdaysForMonth(year, month));
        highlights.addAll(highlightService.getUserTasksForMonth(userId, year, month));
        highlights.addAll(highlightService.getEventsForMonth(year, month));
        return ResponseEntity.ok(highlights);
    }
}

