package com.example.hrsystem.controller;

import com.example.hrsystem.service.AdminDashService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController  // ✅ Needed to make this a REST controller
@RequestMapping("/api/admin1")  // ✅ Optional, for grouping admin routes
public class AdminDash {

    private final AdminDashService service;

    public AdminDash(AdminDashService service) {
        this.service = service;
    }

    @GetMapping("/count")
    public ResponseEntity<?> getEmployeeCount() {
        try {
            long count = service.getEmployeeCount();
            System.out.println("Employee count retrieved in controller: " + count);  // ✅ Log it in backend too
            return ResponseEntity.ok(count);
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();  // Optional: logs full stack trace
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve employee count: " + e.getMessage());
        }
    }

    // Endpoint to get the active projects count
    @GetMapping("/active-projects/count")
    public ResponseEntity<?> getActiveProjectsCount() {
        try {
            long count = service.getActiveProjectsCount();  // Use AdminDashService to get active projects count
            System.out.println("Active projects count retrieved in controller: " + count);  // Log the count for debugging
            return ResponseEntity.ok(count);  // Return the count in the response
        } catch (Exception e) {
            e.printStackTrace();  // Log the error if an exception occurs
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve active projects count: " + e.getMessage());
        }
    }

    // do marrim pending tasks
    @GetMapping("/tasks/pending/count")
    public ResponseEntity<?> getPendingTasksCount() {
        try {
            long count = service.countPendingTasks();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve pending tasks count: " + e.getMessage());
        }
    }

    @GetMapping("/employees/distribution")
    public ResponseEntity<?> getDepartmentDistribution() {
        try {
            Map<String, Long> distribution = service.getDepartmentDistribution();
            return ResponseEntity.ok(distribution);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve department distribution: " + e.getMessage());
        }
    }




}

