package com.example.hrsystem.controller;

import com.example.hrsystem.service.ProjectService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")

public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectSummaryService) {
        this.projectService = projectSummaryService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllProjects(@RequestHeader("Authorization") String token) {
        try {
            // Extract the UID from Firebase authentication token
            String idToken = token.replace("Bearer ", "");
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String uid = decodedToken.getUid();

            // Get all projects for the user
            List<Map<String, Object>> allProjects = projectService.getAllProjectsForUser(uid);
            return ResponseEntity.ok(allProjects);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
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

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllProjects() {
        List<Map<String, Object>> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

}


