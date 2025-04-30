package com.example.hrsystem.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class CalendarEventService {

    public Map<String, Object> getCalendarEventsForMonth(String yearMonth) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        System.out.println("[DEBUG] Fetching calendar events for YearMonth: " + yearMonth);

        DocumentReference monthDocRef = db
                .collection("calendarEvent")
                .document("event_" + yearMonth);

        ApiFuture<DocumentSnapshot> future = monthDocRef.get();
        DocumentSnapshot doc = future.get();

        if (!doc.exists()) {
            System.out.println("[DEBUG] No document found for event_" + yearMonth);
            return Map.of("events", List.of());
        }

        if (doc.getData() == null) {
            System.out.println("[DEBUG] Document event_" + yearMonth + " exists but has no data.");
            return Map.of("events", List.of());
        }

        Map<String, Object> data = doc.getData();
        System.out.println("[DEBUG] Raw document fields: " + data.keySet());

        List<Map<String, Object>> formattedEvents = new ArrayList<>();

        for (Map.Entry<String, Object> entry : data.entrySet()) {
            String eventId = entry.getKey();
            Object value = entry.getValue();

            if (value instanceof Map<?, ?> rawEvent) {
                System.out.println("[DEBUG] Processing event: " + eventId);

                Map<String, Object> formattedEvent = new HashMap<>();

                for (Map.Entry<?, ?> eventEntry : rawEvent.entrySet()) {
                    String key = eventEntry.getKey().toString();
                    Object fieldValue = eventEntry.getValue();

                    if (fieldValue instanceof Timestamp ts) {
                        String isoString = ts.toDate().toInstant().toString();
                        formattedEvent.put(key, isoString);
                        System.out.println("[DEBUG] Converted Timestamp field: " + key + " → " + isoString);
                    } else {
                        formattedEvent.put(key, fieldValue);
                        System.out.println("[DEBUG] Copied field: " + key + " → " + fieldValue);
                    }
                }

                formattedEvents.add(formattedEvent);
            } else {
                System.out.println("[WARNING] Unexpected format for field: " + eventId);
            }
        }

        System.out.println("[DEBUG] Returning total " + formattedEvents.size() + " formatted events.");
        return Map.of("events", formattedEvents);
    }
}
