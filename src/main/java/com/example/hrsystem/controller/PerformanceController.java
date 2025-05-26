package com.example.hrsystem.controller;

import com.example.hrsystem.model.Performance;
import com.example.hrsystem.service.PerformanceService;
import com.example.hrsystem.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/performance")
@CrossOrigin(origins = "http://localhost:3000")
public class PerformanceController {

    private final PerformanceService performanceService;
    private final TaskService taskService;

    public PerformanceController(PerformanceService performanceService,
                                 TaskService taskService) {
        this.performanceService = performanceService;
        this.taskService = taskService;
    }

    @GetMapping("/all-with-performance/{yearMonth}")
    public ResponseEntity<?> getAllEmployeesWithPerformance(
            @PathVariable String yearMonth) {
        try {
            List<Map<String, Object>> result = performanceService.getAllEmployeesWithPerformance(yearMonth);
            return ResponseEntity.ok(result);
        } catch (ExecutionException e) {
            return ResponseEntity.internalServerError().body("Database error: " + e.getMessage());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return ResponseEntity.internalServerError().body("Operation interrupted");
        }
    }

    @PostMapping("/review")
    public ResponseEntity<?> submitPerformanceReview(@RequestBody Performance review) {
        try {
            if (review == null) {
                return ResponseEntity.badRequest().body("Invalid performance data");
            }

            performanceService.savePerformanceReview(review);
            return ResponseEntity.ok(Map.of(
                    "message", "Performance review submitted successfully",
                    "reviewId", review.getId()
            ));
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error saving performance");
        }
    }

    @PatchMapping("/{reviewId}")
    public ResponseEntity<?> updatePerformanceReview(
            @PathVariable String reviewId,
            @RequestBody Performance updatedFields) {
        try {
            boolean success = performanceService.updatePerformanceReview(reviewId, updatedFields);
            return success
                    ? ResponseEntity.ok("Performance review updated successfully")
                    : ResponseEntity.notFound().build();
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error updating performance");
        }
    }

    @GetMapping("/employee/{employeeId}/{yearMonth}")
    public ResponseEntity<?> getEmployeePerformance(
            @PathVariable String employeeId,
            @PathVariable String yearMonth) {
        try {
            Performance review = performanceService.getEmployeePerformanceReview(employeeId, yearMonth);
            if (review == null) {
                return ResponseEntity.notFound().build();
            }

            int taskCount = taskService.countTasksForEmployee(employeeId, yearMonth);

            Map<String, Object> response = new HashMap<>();
            response.put("performance", review);
            response.put("taskCount", taskCount);

            return ResponseEntity.ok(response);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error fetching performance");
        }
    }
}