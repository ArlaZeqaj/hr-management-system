package com.example.hrsystem.service;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class LoginAttemptService {

    /**
     * Logs a login attempt to Firestore.
     * @param email the email of the user attempting to log in
     * @param ip the IP address from which the login attempt originated
     * @param success true if login was successful, false otherwise
     */
    public void logAttempt(String email, String ip, boolean success) {
        Firestore db = FirestoreClient.getFirestore();

        Map<String, Object> attemptData = new HashMap<>();
        attemptData.put("email", email);
        attemptData.put("ip", ip);
        attemptData.put("success", success);
        attemptData.put("timestamp", LocalDateTime.now().toString());

        // Optional: add UID or request metadata if available
        db.collection("login_attempts").add(attemptData);
    }
}
