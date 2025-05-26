package com.example.hrsystem.service;

import com.example.hrsystem.model.Performance;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class PerformanceService {

    private static final String PERFORMANCE_COLLECTION = "Performance";
    private static final String EMPLOYEE_COLLECTION = "employees";

    public Performance getEmployeePerformanceReview(String employeeId, String yearMonth)
            throws ExecutionException, InterruptedException {
        String[] parts = yearMonth.split("-");
        Query query = FirestoreClient.getFirestore().collection(PERFORMANCE_COLLECTION)
                .whereEqualTo("employeeId", employeeId)
                .whereEqualTo("year", Integer.parseInt(parts[0]))
                .whereEqualTo("month", Integer.parseInt(parts[1]))
                .limit(1);

        QuerySnapshot snapshot = query.get().get();
        if (snapshot.isEmpty()) return null;

        DocumentSnapshot doc = snapshot.getDocuments().get(0);
        Performance review = doc.toObject(Performance.class);
        review.setId(doc.getId());
        return review;
    }

    public void savePerformanceReview(Performance review)
            throws ExecutionException, InterruptedException {
        DocumentReference docRef = FirestoreClient.getFirestore()
                .collection(PERFORMANCE_COLLECTION)
                .document();
        review.setId(docRef.getId());
        docRef.set(review).get();
    }

    public boolean updatePerformanceReview(String reviewId, Performance updatedFields)
            throws ExecutionException, InterruptedException {
        DocumentReference docRef = FirestoreClient.getFirestore()
                .collection(PERFORMANCE_COLLECTION)
                .document(reviewId);

        if (!docRef.get().get().exists()) return false;

        Map<String, Object> updates = new HashMap<>();
        if (updatedFields.getPerformanceScore() != 0)
            updates.put("performanceScore", updatedFields.getPerformanceScore());
        if (updatedFields.getStrengths() != null)
            updates.put("strengths", updatedFields.getStrengths());
        if (updatedFields.getAreasForImprovement() != null)
            updates.put("areasForImprovement", updatedFields.getAreasForImprovement());

        if (!updates.isEmpty()) docRef.update(updates).get();
        return true;
    }

    public List<Map<String, Object>> getAllEmployeesWithPerformance(String yearMonth)
            throws ExecutionException, InterruptedException {
        String[] parts = yearMonth.split("-");
        int year = Integer.parseInt(parts[0]);
        int month = Integer.parseInt(parts[1]);

        // Get all employees
        List<QueryDocumentSnapshot> employeeDocs = FirestoreClient.getFirestore()
                .collection(EMPLOYEE_COLLECTION)
                .get().get().getDocuments();

        // Get all performance reviews for the month
        List<QueryDocumentSnapshot> reviewDocs = FirestoreClient.getFirestore()
                .collection(PERFORMANCE_COLLECTION)
                .whereEqualTo("year", year)
                .whereEqualTo("month", month)
                .get().get().getDocuments();

        // Create map for quick lookup
        Map<String, Performance> reviewMap = reviewDocs.stream()
                .collect(Collectors.toMap(
                        doc -> doc.getString("employeeId"),
                        doc -> {
                            Performance p = doc.toObject(Performance.class);
                            p.setId(doc.getId());
                            return p;
                        }
                ));

        // Combine data
        return employeeDocs.stream()
                .map(emp -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("id", emp.getId());
                    result.put("name", emp.getString("Name"));

                    Performance review = reviewMap.get(emp.getId());
                    if (review != null) {
                        result.put("performanceScore", review.getPerformanceScore());
                        result.put("strengths", review.getStrengths() != null ?
                                review.getStrengths() : new ArrayList<>());
                        result.put("areasForImprovement", review.getAreasForImprovement() != null ?
                                review.getAreasForImprovement() : new ArrayList<>());
                        result.put("reviewId", review.getId());
                    } else {
                        result.put("performanceScore", 0);
                        result.put("strengths", new ArrayList<>());
                        result.put("areasForImprovement", new ArrayList<>());
                        result.put("reviewId", null);
                    }
                    return result;
                })
                .collect(Collectors.toList());
    }
}