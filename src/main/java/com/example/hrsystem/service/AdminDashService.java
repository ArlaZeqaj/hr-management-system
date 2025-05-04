package com.example.hrsystem.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class AdminDashService {

    public long getEmployeeCount() throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();  // ✅ Get Firestore instance
        ApiFuture<QuerySnapshot> query = firestore.collection("employees").get();
        long count = query.get().getDocuments().size();

        System.out.println("✅ Employee count retrieved from Firestore: " + count);  // ✅ Console output
        return count;
    }

    // New method to get active projects count
    public long getActiveProjectsCount() throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        // Query for active projects (you might need to adjust the field depending on how your database is structured)
        ApiFuture<QuerySnapshot> query = firestore.collection("Project")
                .whereEqualTo("status", "Ongoing")  // Assuming you have a "status" field in the "projects" collection
                .get();
        long count = query.get().getDocuments().size();
        return count;
    }

    public long countPendingTasks() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference employees = db.collection("employees");

        ApiFuture<QuerySnapshot> employeeDocsFuture = employees.get();
        QuerySnapshot employeeDocs = employeeDocsFuture.get();

        long pendingCount = 0;

        for (QueryDocumentSnapshot employeeDoc : employeeDocs) {
            CollectionReference tasks = employeeDoc.getReference().collection("tasks");

            ApiFuture<QuerySnapshot> taskDocsFuture = tasks.get();
            QuerySnapshot taskDocs = taskDocsFuture.get();

            for (QueryDocumentSnapshot taskDoc : taskDocs) {
                Map<String, Object> taskFields = taskDoc.getData();

                for (Map.Entry<String, Object> entry : taskFields.entrySet()) {
                    Object taskValue = entry.getValue();

                    if (taskValue instanceof Map) {
                        Map<?, ?> taskMap = (Map<?, ?>) taskValue;
                        Object status = taskMap.get("status");

                        if ("pending".equalsIgnoreCase(String.valueOf(status))) {
                            pendingCount++;
                        }
                    }
                }
            }
        }

        return pendingCount;
    }

    public Map<String, Long> getDepartmentDistribution() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference employees = db.collection("employees");

        QuerySnapshot snapshot = employees.get().get();
        Map<String, Long> departmentCounts = new HashMap<>();

        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            String department = doc.getString("department");
            if (department != null) {
                departmentCounts.put(department, departmentCounts.getOrDefault(department, 0L) + 1);
            }
        }
        return departmentCounts;
    }



}
