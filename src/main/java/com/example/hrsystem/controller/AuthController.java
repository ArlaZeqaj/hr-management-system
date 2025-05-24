package com.example.hrsystem.controller;

import com.example.hrsystem.service.FirebaseAuthService;
import com.example.hrsystem.service.LoginAttemptService;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private LoginAttemptService loginAttemptService;

    @Autowired
    private FirebaseAuthService firebaseAuthService;

    /**
     * Handles login by verifying Firebase ID token sent from frontend.
     * Logs the attempt and determines user role (admin or employee).
     * <p>
     * Frontend should send:
     * {
     * "idToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6..."
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(Authentication authentication) {
        String uid = authentication.getName(); // Comes from the token set in filter

        try {
            String role = firebaseAuthService.getUserRole(uid);
            if (role == null) {
                return ResponseEntity.status(403).body("User role not found");
            }

            return ResponseEntity.ok(Map.of(
                    "uid", uid,
                    "role", role
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error getting user role: " + e.getMessage());
        }
    }

    @GetMapping("/last-signin")
    public Map<String, String> getLastSignIn(@RequestParam String email) throws FirebaseAuthException {
        // In a real implementation, you would query your database for this info
        // This is a simplified version that returns dummy data
        Map<String, String> response = new HashMap<>();
        response.put("lastSignIn", "2025-05-16T12:34:56Z");
        return response;
    }


}
