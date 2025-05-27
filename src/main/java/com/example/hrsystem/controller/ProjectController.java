package com.example.hrsystem.controller;

import com.example.hrsystem.service.ProjectService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")

public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectSummaryService) {
        this.projectService = projectSummaryService;
    }

    // 🔹 Per-user: Get all projects
    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllProjects(@RequestHeader("Authorization") String token) {
        try {
            String idToken = token.replace("Bearer ", "");
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String uid = decodedToken.getUid();

            List<Map<String, Object>> allProjects = projectService.getAllProjectsForUser(uid);
            return ResponseEntity.ok(allProjects);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllProjects() {
        List<Map<String, Object>> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }
    // 🔹 Per-user: Get status summary
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Integer>> getProjectSummary(@RequestHeader("Authorization") String token) {
        try {
            String idToken = token.replace("Bearer ", "");
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String uid = decodedToken.getUid();

            Map<String, Integer> summary = projectService.getProjectStatusSummaryForUser(uid);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }


    @GetMapping("/ongoing")
    public ResponseEntity<List<Map<String, Object>>> getAllOngoingProjects(@RequestHeader("Authorization") String token) {
        try {
            String idToken = token.replace("Bearer ", "");
            FirebaseAuth.getInstance().verifyIdToken(idToken); // Validate token

            List<Map<String, Object>> ongoingProjects = projectService.getAllOngoingProjects();
            return ResponseEntity.ok(ongoingProjects);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/count/{employeeId}/{yearMonth}")
    public ResponseEntity<Integer> getProjectCount(
            @PathVariable String employeeId,
            @PathVariable String yearMonth,
            @RequestHeader("Authorization") String token) {
        try {

            String idToken = token.replace("Bearer ", "");
            FirebaseAuth.getInstance().verifyIdToken(idToken);


            int count = projectService.countProjectsForEmployee(employeeId, yearMonth);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(0);
        }
    }


    @PostMapping
    public ResponseEntity<Map<String, Object>> createProject(
            @RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String token) {
        Map<String, Object> savedProject = projectService.createProject(request);
        return ResponseEntity.ok(savedProject);
    }
    @PutMapping("/{id}")
    public ResponseEntity<String> updateProject(@PathVariable String id, @RequestBody Map<String, Object> updatedData) {
        try {
            projectService.updateProject(id, updatedData);
            return ResponseEntity.ok("Project updated");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateProjectStatus(
            @PathVariable String id,
            @RequestBody Map<String, Object> body,
            @RequestHeader("Authorization") String token) {
        try {
            String status = (String) body.get("status");
            projectService.updateProjectStatus(id, status);
            return ResponseEntity.ok("Status updated");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update status: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProject(
            @PathVariable String id,
            @RequestHeader("Authorization") String token) {
        try {
            projectService.deleteProject(id);
            return ResponseEntity.ok("Project deleted");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete project: " + e.getMessage());
        }
    }

}
