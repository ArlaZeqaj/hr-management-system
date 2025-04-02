package com.example.hrsystem.controller;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/firestore")
public class FirebaseController {

    @GetMapping("/employees")
    public ResponseEntity<List<Map<String, Object>>> getEmployeesFromFirestore() {
        Firestore db = FirestoreClient.getFirestore();
        List<Map<String, Object>> employees = new ArrayList<>();

        try {
            ApiFuture<QuerySnapshot> future = db.collection("employees").get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            for (QueryDocumentSnapshot doc : documents) {
                Map<String, Object> data = doc.getData();
                data.put("id", doc.getId()); // include doc ID if needed
                employees.add(data);
            }

            return ResponseEntity.ok(employees);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
