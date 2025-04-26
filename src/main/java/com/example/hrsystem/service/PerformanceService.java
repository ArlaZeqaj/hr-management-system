package com.example.hrsystem.service;

import com.example.hrsystem.dto.WeeklyPerformanceDTO;
import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
public class PerformanceService {
    private final Firestore db = FirestoreClient.getFirestore();

    public List<WeeklyPerformanceDTO> getMonthlyPerformance(String uid) throws Exception {
        // Determine start/end of current month
        LocalDate now = LocalDate.now();
        LocalDate start = now.withDayOfMonth(1);
        LocalDate end = now.with(TemporalAdjusters.lastDayOfMonth());

        ApiFuture<QuerySnapshot> future = db
                .collection("employees")
                .document(uid)
                .collection("performance")
                .whereGreaterThanOrEqualTo("date", Timestamp.ofTimeSecondsAndNanos(
                        start.atStartOfDay(ZoneOffset.UTC).toEpochSecond(), 0))
                .whereLessThanOrEqualTo("date", Timestamp.ofTimeSecondsAndNanos(
                        end.atTime(LocalTime.MAX).atZone(ZoneOffset.UTC).toEpochSecond(), 0))
                .get();

        Map<Integer, Integer> weeklyTotals = new HashMap<>();
        for (DocumentSnapshot doc : future.get().getDocuments()) {
            Timestamp ts = doc.getTimestamp("date");
            int tasks = doc.getLong("tasks").intValue();
            // calculate week-of-month (1–5)
            LocalDate date = ts.toDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            int week = ((date.getDayOfMonth() + date.withDayOfMonth(1).getDayOfWeek().getValue() - 1) / 7) + 1;
            weeklyTotals.merge(week, tasks, Integer::sum);
        }

        // Build list for weeks 1–5
        List<WeeklyPerformanceDTO> result = new ArrayList<>();
        for (int w = 1; w <= 5; w++) {
            result.add(new WeeklyPerformanceDTO(w, weeklyTotals.getOrDefault(w, 0)));
        }
        return result;
    }
}
