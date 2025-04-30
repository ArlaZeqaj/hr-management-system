package com.example.hrsystem.controller;

import com.example.hrsystem.service.EmployeeStatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employee-stats")
public class EmployeeStatsController {

    private final EmployeeStatsService employeeStatsService;

    public EmployeeStatsController(EmployeeStatsService employeeStatsService) {
        this.employeeStatsService = employeeStatsService;
    }

    @GetMapping
    public ResponseEntity<?> getEmployeeStats(Authentication authentication) {
        try {
            String uid = (String) authentication.getPrincipal();
            var stats = employeeStatsService.getEmployeeStats(uid);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching employee stats.");
        }
    }
}
