package com.example.hrsystem.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Year;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class EmployeeStatsService {

    public Map<String, Object> getEmployeeStats(String uid) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        System.out.println("[DEBUG] Fetching employee stats for UID: " + uid);

        // Fetch tasks
        CollectionReference tasksRef = db.collection("employees").document(uid).collection("tasks");
        ApiFuture<QuerySnapshot> taskQuery = tasksRef.get();
        List<QueryDocumentSnapshot> taskDocs = taskQuery.get().getDocuments();

        int tasksCompleted = 0;

        for (var doc : taskDocs) {
            Map<String, Object> taskMap = doc.getData(); // each task_YYYY-MM

            for (Map.Entry<String, Object> entry : taskMap.entrySet()) {
                Object value = entry.getValue();

                if (value instanceof Map<?, ?> taskData) {
                    Object statusObj = taskData.get("status");
                    if (statusObj instanceof String status && "completed".equalsIgnoreCase(status)) {
                        tasksCompleted++;
                    }
                }
            }
        }

        System.out.println("[DEBUG] Tasks Completed: " + tasksCompleted);


        // Fetch trainings
        CollectionReference trainingRef = db.collection("employees").document(uid).collection("trainings");
        ApiFuture<QuerySnapshot> trainingQuery = trainingRef.get();
        int trainingsCompleted = trainingQuery.get().size();
        System.out.println("[DEBUG] Trainings Completed: " + trainingsCompleted);

        // Fetch leaves
        CollectionReference leaveRef = db.collection("Leave");
        ApiFuture<QuerySnapshot> leaveQuery = leaveRef.whereEqualTo("userId", uid).get();

        int leavesTaken = 0;
        for (var doc : leaveQuery.get().getDocuments()) {
            String status = doc.getString("leave_Status");

            if (!"Approved".equalsIgnoreCase(status)) {
                continue; // skip non-approved leaves
            }

            Timestamp startTimestamp = doc.getTimestamp("start_Date");
            if (startTimestamp != null &&
                    startTimestamp.toDate().toInstant().atZone(ZoneId.systemDefault()).getYear() == Year.now().getValue()) {
                leavesTaken++;
            }
        }

        System.out.println("[DEBUG] Leaves Taken This Year (Approved Only): " + leavesTaken);


        // Fetch upcoming events
        String yearMonth = LocalDate.now().toString().substring(0, 7); // "YYYY-MM"
        DocumentReference calendarRef = db.collection("calendarEvent").document("event_" + yearMonth);
        ApiFuture<DocumentSnapshot> eventDoc = calendarRef.get();
        int upcomingEvents = 0;

        if (eventDoc.get().exists()) {
            Map<String, Object> events = eventDoc.get().getData();
            if (events != null) {
                LocalDate today = LocalDate.now();
                for (var eventObj : events.values()) {
                    if (eventObj instanceof Map<?, ?> eventData) {
                        Object startDateObj = eventData.get("startDate");
                        if (startDateObj instanceof String startDateStr) {
                            try {
                                LocalDate eventDate = LocalDate.parse(startDateStr.substring(0, 10));
                                if (!eventDate.isBefore(today)) {
                                    upcomingEvents++;
                                }
                            } catch (Exception e) {
                                System.out.println("[WARN] Could not parse event date: " + startDateStr);
                            }
                        }

                    }
                }
            }
        }
        System.out.println("[DEBUG] Upcoming Events: " + upcomingEvents);

        // Fetch certificates
        CollectionReference certRef = db.collection("employees").document(uid).collection("certificates");
        ApiFuture<QuerySnapshot> certQuery = certRef.get();
        int certificatesEarned = certQuery.get().size();
        System.out.println("[DEBUG] Certificates Earned: " + certificatesEarned);

        // Calculate years at company
        DocumentReference employeeDoc = db.collection("employees").document(uid);
        ApiFuture<DocumentSnapshot> employeeSnapshot = employeeDoc.get();
        int yearsAtCompany = 0;

        if (employeeSnapshot.get().exists()) {
            Timestamp joinDate = employeeSnapshot.get().getTimestamp("joinDate");
            if (joinDate != null) {
                LocalDate joined = joinDate.toDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                yearsAtCompany = LocalDate.now().getYear() - joined.getYear();
            }
        }
        System.out.println("[DEBUG] Years at Company: " + yearsAtCompany);

        Map<String, Object> stats = new HashMap<>();
        stats.put("tasksCompleted", tasksCompleted);
        stats.put("trainingsCompleted", trainingsCompleted);
        stats.put("leavesTaken", leavesTaken);
        stats.put("upcomingEvents", upcomingEvents);
        stats.put("certificatesEarned", certificatesEarned);
        stats.put("yearsAtCompany", yearsAtCompany);

        System.out.println("[DEBUG] Final Stats Response: " + stats);

        return stats;
    }
}
