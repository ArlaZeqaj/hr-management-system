package com.example.hrsystem.controller;

import com.example.hrsystem.dto.WeeklyPerformanceDTO;
import com.example.hrsystem.service.PerformanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/performance")
public class PerformanceController {

    private final PerformanceService performanceService;

    @Autowired
    public PerformanceController(PerformanceService performanceService) {
        this.performanceService = performanceService;
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<WeeklyPerformanceDTO>> getMonthly(
            @AuthenticationPrincipal String uid) {
        try {
            List<WeeklyPerformanceDTO> data = performanceService.getMonthlyPerformance(uid);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }
}
