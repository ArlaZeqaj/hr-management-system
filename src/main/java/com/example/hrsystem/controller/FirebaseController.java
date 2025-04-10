package com.example.hrsystem.controller;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.cloud.FirestoreClient;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/firestore")
public class FirebaseController {

    @GetMapping("/employees")
    public ResponseEntity<List<Map<String, Object>>> getEmployeesFromFirestore(HttpServletRequest request) {
        // Get Firebase user from request (injected by FirebaseTokenFilter)
        FirebaseToken user = (FirebaseToken) request.getAttribute("firebaseUser");

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        String uid = user.getUid();
        String email = user.getEmail();
        System.out.println("✅ Request made by Firebase user: " + email + " (UID: " + uid + ")");

        Firestore db = FirestoreClient.getFirestore();
        List<Map<String, Object>> employees = new ArrayList<>();

        try {
            ApiFuture<QuerySnapshot> future = db.collection("employees").get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            for (QueryDocumentSnapshot doc : documents) {
                Map<String, Object> data = doc.getData();
                data.put("id", doc.getId()); // include document ID
                employees.add(data);
            }

            return ResponseEntity.ok(employees);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
