package com.example.hrsystem.service;

import com.example.hrsystem.dto.CalendarHighlightDTO;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class CalendarHighlightService {

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public List<CalendarHighlightDTO> getBirthdaysForMonth(int year, int month) {
        List<CalendarHighlightDTO> results = new ArrayList<>();
        Firestore db = FirestoreClient.getFirestore();

        try {
            ApiFuture<QuerySnapshot> query = db.collection("employees").get();
            List<QueryDocumentSnapshot> documents = query.get().getDocuments();

            for (QueryDocumentSnapshot doc : documents) {
                String birthDateStr = doc.getString("birthDate");
                String name = doc.getString("name");

                if (birthDateStr != null) {
                    try {
                        LocalDate birthDate = LocalDate.parse(birthDateStr);
                        if (birthDate.getMonthValue() == month) {
                            String highlightDate = String.format("%04d-%02d-%02d", year, month, birthDate.getDayOfMonth());
                            String title = (name != null ? name : "Employee") + "'s Birthday";
                            results.add(new CalendarHighlightDTO("birthday", highlightDate, title));
                        }
                    } catch (Exception e) {
                        System.err.println("[WARN] Invalid birth date: " + birthDateStr);
                    }
                }
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            Thread.currentThread().interrupt();
        }

        return results;
    }

    public List<CalendarHighlightDTO> getUserTasksForMonth(String userId, int year, int month) {
        List<CalendarHighlightDTO> results = new ArrayList<>();
        Firestore db = FirestoreClient.getFirestore();
        String yearMonth = String.format("task_%04d-%02d", year, month);

        try {
            DocumentReference taskDocRef = db
                    .collection("employees")
                    .document(userId)
                    .collection("tasks")
                    .document(yearMonth);

            DocumentSnapshot snapshot = taskDocRef.get().get();

            if (snapshot.exists() && snapshot.getData() != null) {
                Map<String, Object> tasks = snapshot.getData();

                for (Map.Entry<String, Object> entry : tasks.entrySet()) {
                    if (entry.getValue() instanceof Map<?, ?> taskMap) {
                        Object dueDateObj = taskMap.get("dueDate");
                        Object titleObj = taskMap.get("title");

                        if (dueDateObj instanceof String dueDateStr) {
                            try {
                                LocalDate date = LocalDate.parse(dueDateStr);
                                if (date.getYear() == year && date.getMonthValue() == month) {
                                    String title = titleObj instanceof String ? (String) titleObj : "Task";
                                    results.add(new CalendarHighlightDTO("task", dueDateStr, title));
                                }
                            } catch (Exception e) {
                                System.err.println("[WARN] Invalid dueDate in task: " + dueDateStr);
                            }
                        }
                    }
                }
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            Thread.currentThread().interrupt();
        }

        return results;
    }

    public List<CalendarHighlightDTO> getEventsForMonth(int year, int month) {
        List<CalendarHighlightDTO> results = new ArrayList<>();
        Firestore db = FirestoreClient.getFirestore();
        String docId = String.format("event_%04d-%02d", year, month);

        try {
            DocumentReference docRef = db.collection("calendarEvent").document(docId);
            DocumentSnapshot snapshot = docRef.get().get();

            if (snapshot.exists() && snapshot.getData() != null) {
                Map<String, Object> events = snapshot.getData();

                for (Map.Entry<String, Object> entry : events.entrySet()) {
                    if (entry.getValue() instanceof Map<?, ?> event) {
                        Object startDateObj = event.get("startDate");
                        Object titleObj = event.get("title");

                        if (startDateObj instanceof String dateStr) {
                            try {
                                LocalDate parsed = LocalDate.parse(dateStr);
                                if (parsed.getYear() == year && parsed.getMonthValue() == month) {
                                    String title = titleObj instanceof String ? (String) titleObj : "Event";
                                    results.add(new CalendarHighlightDTO("event", dateStr, title));
                                }
                            } catch (Exception e) {
                                System.err.println("[WARN] Invalid event startDate: " + dateStr);
                            }
                        }
                    }
                }
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            Thread.currentThread().interrupt();
        }

        return results;
    }
}
