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

import java.util.Map;

@RestController
@RequestMapping("/api/projects")

public class ProjectController {

    private final ProjectService projectSummaryService;

    public ProjectController(ProjectService projectSummaryService) {
        this.projectSummaryService = projectSummaryService;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Integer>> getProjectSummary(@RequestHeader("Authorization") String token) {
        try {
            String idToken = token.replace("Bearer ", "");
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String uid = decodedToken.getUid();

            Map<String, Integer> summary = projectSummaryService.getProjectStatusSummaryForUser(uid);
            return ResponseEntity.ok(summary);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

}


