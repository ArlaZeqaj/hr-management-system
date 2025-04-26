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
import java.util.concurrent.ExecutionException;

@Service
public class CalendarHighlightService {

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public List<CalendarHighlightDTO> getBirthdaysForMonth(int year, int month) {
        List<CalendarHighlightDTO> results = new ArrayList<>();
        Firestore db = FirestoreClient.getFirestore();
        System.out.println("Fetching birthdays...");

        try {
            ApiFuture<QuerySnapshot> query = db.collection("employees").get();
            List<QueryDocumentSnapshot> documents = query.get().getDocuments();
            System.out.println("Fetched documents count: " + documents.size());

            for (QueryDocumentSnapshot doc : documents) {
                String birthDateStr = doc.getString("birthDate");

                if (birthDateStr != null) {
                    LocalDate birthDate = LocalDate.parse(birthDateStr);
                    if (birthDate.getMonthValue() == month) {
                        CalendarHighlightDTO dto = new CalendarHighlightDTO("birthday", String.format("%d-%02d-%02d", year, month, birthDate.getDayOfMonth()));
                        results.add(dto);
                    }
                }
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }

        return results;
    }

    public List<CalendarHighlightDTO> getUserTasksForMonth(String userId, int year, int month) {
        List<CalendarHighlightDTO> results = new ArrayList<>();
        Firestore db = FirestoreClient.getFirestore();

        try {
            ApiFuture<QuerySnapshot> query = db.collection("task").whereEqualTo("userId", userId).get();
            List<QueryDocumentSnapshot> documents = query.get().getDocuments();

            for (QueryDocumentSnapshot doc : documents) {
                String dueDateStr = doc.getString("dueDate");
                if (dueDateStr != null) {
                    LocalDate dueDate = LocalDate.parse(dueDateStr);
                    if (dueDate.getYear() == year && dueDate.getMonthValue() == month) {
                        results.add(new CalendarHighlightDTO("task", dueDateStr));
                    }
                }
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }

        return results;
    }

    public List<CalendarHighlightDTO> getEventsForMonth(int year, int month) {
        List<CalendarHighlightDTO> results = new ArrayList<>();
        Firestore db = FirestoreClient.getFirestore();

        try {
            ApiFuture<QuerySnapshot> query = db.collection("calendarEvent").get();
            List<QueryDocumentSnapshot> documents = query.get().getDocuments();

            for (QueryDocumentSnapshot doc : documents) {
                String eventDateStr = doc.getString("date");
                if (eventDateStr != null) {
                    LocalDate eventDate = LocalDate.parse(eventDateStr);
                    if (eventDate.getYear() == year && eventDate.getMonthValue() == month) {
                        results.add(new CalendarHighlightDTO("event", eventDateStr));
                    }
                }
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }

        return results;
    }
}