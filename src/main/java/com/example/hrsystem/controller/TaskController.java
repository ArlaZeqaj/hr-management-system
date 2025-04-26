package com.example.hrsystem.controller;

import com.example.hrsystem.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/schedule")
public class TaskController {
    private final TaskService scheduleService;

    public TaskController(TaskService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping("/{yearMonth}")
    public ResponseEntity<?> getScheduleForMonth(
            @PathVariable String yearMonth,
            Authentication authentication) {
        try {
            String uid = (String) authentication.getPrincipal();

            var result = scheduleService.getScheduleForMonth(uid, yearMonth);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching schedule.");
        }
    }
}
