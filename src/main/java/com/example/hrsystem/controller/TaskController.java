package com.example.hrsystem.controller;

import com.example.hrsystem.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/schedule")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }
    @GetMapping("/{yearMonth}-taskcomponent")
    public ResponseEntity<?> getTasks(@PathVariable String yearMonth, Authentication authentication) {
        try {
            String uid = (String) authentication.getPrincipal();
            var result = taskService.getScheduleForMonth(uid, yearMonth);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching schedule.");
        }
    }

    @PutMapping("/{yearMonth}/{taskId}")
    public ResponseEntity<?> updateTask(
            @PathVariable String yearMonth,
            @PathVariable String taskId,
            @RequestBody Map<String, Object> updates,
            Authentication authentication
    ) {
        String uid = (String) authentication.getPrincipal();
        try {
            taskService.updateTask(uid, yearMonth, taskId, updates);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok("Task updated");
    }
    @GetMapping("/{yearMonth}")
    public ResponseEntity<?> getScheduleForMonth(
            @PathVariable String yearMonth,
            Authentication authentication) {
        try{
            String uid = (String) authentication.getPrincipal();
            var result = taskService.getScheduleForMonth(uid, yearMonth);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching schedule.");
        }
    }

    @GetMapping("/count/{employeeId}/{yearMonth}")
    public ResponseEntity<Integer> getTaskCount(
            @PathVariable String employeeId,
            @PathVariable String yearMonth,
            Authentication authentication) {
        try {
            String uid = (String) authentication.getPrincipal();
            // Optional: Verify the requesting user has permission to view this employee's data
            int count = taskService.countTasksForEmployee(employeeId, yearMonth);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(0);
        }
    }

}
