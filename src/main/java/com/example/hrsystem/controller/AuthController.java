package com.example.hrsystem.controller;

import com.example.hrsystem.service.FirebaseAuthService;
import com.example.hrsystem.service.LoginAttemptService;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
     *
     * Frontend should send:
     * {
     *   "idToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6..."
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String idToken = body.get("idToken");

        System.out.println("🔥 Token received: " + idToken);

        String ip = request.getRemoteAddr();
        String email = "unknown";
        boolean success = false;

        try {


            FirebaseToken decodedToken = firebaseAuthService.verifyToken(idToken);
            String uid = decodedToken.getUid();
            email = decodedToken.getEmail();

            String role = firebaseAuthService.getUserRole(uid);

            if (role == null) {
                return ResponseEntity.status(403).body("User role not found");
            }

            Map<String, Object> response = new HashMap<>();
            response.put("uid", uid);
            response.put("email", email);
            response.put("role", role);
            response.put("message", "Login successful");

            return ResponseEntity.ok(response);

        } catch (FirebaseAuthException e) {
            e.printStackTrace();

            return ResponseEntity.status(401).body("Invalid Firebase token");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        } finally {
            loginAttemptService.logAttempt(email, ip, success);
        }
    }
}
