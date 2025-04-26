package com.example.hrsystem.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
@Service
public class TaskService {
    public Map<String, Object> getScheduleForMonth(String uid, String yearMonth) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        ApiFuture<DocumentSnapshot> future = db
                .collection("users")
                .document(uid)
                .collection("schedules")
                .document(yearMonth)
                .get();

        DocumentSnapshot document = future.get();

        if (!document.exists()) {
            Map<String, Object> emptyResponse = new HashMap<>();
            emptyResponse.put("month", yearMonth);
            emptyResponse.put("tasks", new Object[0]);
            return emptyResponse;
        }

        return document.getData();
    }
}
