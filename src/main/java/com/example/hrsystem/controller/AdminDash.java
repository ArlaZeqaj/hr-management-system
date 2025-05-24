package com.example.hrsystem.controller;

import com.example.hrsystem.service.AdminDashService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
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

    // ✅ Your task creation endpoint, now correctly placed

    @PostMapping("/tasks/create")
    public ResponseEntity<?> createTask(@RequestBody Map<String, Object> taskData) {
        try {
            // 🔍 Extract employee IDs from the "assignees" field
            List<String> employeeIds = (List<String>) taskData.get("assignees");

            if (employeeIds == null || employeeIds.isEmpty()) {
                return ResponseEntity.badRequest().body("Assignees list is required.");
            }

            // ✅ Call your service and pass the whole task data map and the list of assignees
            service.createTask(employeeIds, taskData);

            return ResponseEntity.ok(Map.of("message", "Task created successfully."));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create task: " + e.getMessage());
        }
    }

    @PutMapping("/tasks/update")
    public ResponseEntity<String> updateOrAssignTask(@RequestBody Map<String, Object> payload) {
        try {
            // Extract employeeIds and taskData from the request
            List<String> employeeIds = (List<String>) payload.get("assignees");
            Map<String, Object> taskData = (Map<String, Object>) payload;

            if (employeeIds == null || employeeIds.isEmpty()) {
                return ResponseEntity.badRequest().body("No employee IDs provided.");
            }

            service.updateOrAssignTask(employeeIds, taskData);
            return ResponseEntity.ok("Task updated or assigned successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error while updating or assigning task: " + e.getMessage());
        }
    }



    @GetMapping("/employees")
    public ResponseEntity<?> getAllEmployees() {
        try {
            List<Map<String, Object>> employees = service.getAllEmployees();
            return ResponseEntity.ok(employees);  // ✅ JSON list returned here
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch employees: " + e.getMessage()));  // ✅ Return JSON instead of plain text
        }
    }

    // per retrive all tasks
    @GetMapping("tasks/all")
    public List<Map<String, Object>> getAllTasks() {
        try {
            return service.getAllTasks1();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching tasks: " + e.getMessage());
        }
    }

    // delete task
    @DeleteMapping("/tasks/delete")
    public ResponseEntity<?> deleteTaskByTitle(@RequestBody Map<String, String> payload) {
        String title = payload.get("title");
        if (title == null || title.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Task title is required");
        }

        try {
            service.deleteTask(title);
            return ResponseEntity.ok("Task deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting task: " + e.getMessage());
        }
    }

    @GetMapping("/budget-allocation")
    public ResponseEntity<Map<String, Double>> getDepartmentBudgetAllocation() throws Exception {
        return ResponseEntity.ok(service.calculateBudgetAllocationByDepartment());
    }
    @GetMapping("/payroll/total")
    public ResponseEntity<Map<String, Double>> getTotalPayroll() {
        try {
            double totalPayroll = service.calculateTotalPayroll();
            Map<String, Double> response = new HashMap<>();
            response.put("totalPayroll", totalPayroll);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }










}

