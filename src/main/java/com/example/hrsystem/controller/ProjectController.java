package com.example.hrsystem.controller;

import com.example.hrsystem.service.ProjectService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
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




}
