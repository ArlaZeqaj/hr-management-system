package com.example.hrsystem.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class TaskService {

    public void updateTask(String uid, String yearMonth, String taskId, Map<String, Object> updates) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection("employees")
                .document(uid)
                .collection("tasks")
                .document("task_" + yearMonth);

        Map<String, Object> flatUpdates = new HashMap<>();

        // Flatten the map: "task2.status" → "completed"
        for (Map.Entry<String, Object> entry : updates.entrySet()) {
            flatUpdates.put(taskId + "." + entry.getKey(), entry.getValue());
        }

        docRef.update(flatUpdates); // ✅ Now it updates nested fields, not overwrites the whole object
    }

    public int countTasksForEmployee(String uid, String yearMonth) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection("employees")
                .document(uid)
                .collection("tasks")
                .document("task_" + yearMonth);

        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot doc = future.get();

        if (!doc.exists()) {
            return 0;
        }

        Map<String, Object> data = doc.getData();
        if (data == null) {
            return 0;
        }


        int count = 0;
        for (Map.Entry<String, Object> entry : data.entrySet()) {
            if (entry.getValue() instanceof Map) {
                count++;
            }
        }
        return count;
    }


    public Map<String, Object> getScheduleForMonth(String uid, String yearMonth) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        System.out.println("[DEBUG] Fetching schedule for UID: " + uid + ", YearMonth: " + yearMonth);

        DocumentReference monthDocRef = db
                .collection("employees")
                .document(uid)
                .collection("tasks")
                .document("task_" + yearMonth);

        ApiFuture<DocumentSnapshot> future = monthDocRef.get();
        DocumentSnapshot doc = future.get();

        if (!doc.exists()) {
            System.out.println("[DEBUG] Document does not exist for: task_" + yearMonth);
            return Map.of("tasks", List.of());
        }

        Map<String, Object> data = doc.getData();
        if (data == null || data.isEmpty()) {
            System.out.println("[DEBUG] No data found inside document: task_" + yearMonth);
            return Map.of("tasks", List.of());
        }

        List<Map<String, Object>> formattedTasks = new ArrayList<>();
        System.out.println("[DEBUG] Raw data retrieved: " + data);

        for (Map.Entry<String, Object> entry : data.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();

            System.out.println("[DEBUG] Processing field: " + key);

            if (value instanceof Map<?, ?> rawTask) {
                Map<String, Object> formattedTask = new HashMap<>();

                for (Map.Entry<?, ?> taskEntry : rawTask.entrySet()) {
                    String fieldKey = taskEntry.getKey().toString();
                    Object fieldValue = taskEntry.getValue();

                    if (fieldValue instanceof Timestamp ts) {
                        String iso = ts.toDate().toInstant().toString();
                        formattedTask.put(fieldKey, iso);
                        System.out.println("[DEBUG] Converted Timestamp field: " + fieldKey + " -> " + iso);
                    } else {
                        formattedTask.put(fieldKey, fieldValue);
                        System.out.println("[DEBUG] Copied field: " + fieldKey + " -> " + fieldValue);
                    }
                }

                formattedTasks.add(formattedTask);
            } else {
                System.out.println("[DEBUG] Skipping non-task field: " + key);
            }
        }

        System.out.println("[DEBUG] Formatted tasks: " + formattedTasks);
        return Map.of("tasks", formattedTasks);
    }
}
