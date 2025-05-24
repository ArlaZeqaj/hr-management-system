//package com.example.hrsystem.listeners;
//import com.google.cloud.Timestamp;
//import com.google.cloud.firestore.DocumentChange;
//import com.google.cloud.firestore.DocumentSnapshot;
//import com.google.cloud.firestore.Firestore;
//import com.google.firebase.cloud.FirestoreClient;
//import org.springframework.stereotype.Service;
//import jakarta.annotation.PostConstruct;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@Service
//public class ProjectTransactionListener {
//
//    private final Firestore db = FirestoreClient.getFirestore();
//
//    @PostConstruct
//    public void listenToProjectAdditions() {
//        db.collection("Project").addSnapshotListener((snapshots, e) -> {
//            if (e != null || snapshots == null) {
//                System.err.println("Listen to Project failed: " + e);
//                return;
//            }
//
//            for (DocumentChange change : snapshots.getDocumentChanges()) {
//                if (change.getType() == DocumentChange.Type.ADDED) {
//                    DocumentSnapshot projectDoc = change.getDocument();
//                    createTransactionFromProject(projectDoc);
//                }
//            }
//        });
//    }
//
//    private void createTransactionFromProject(DocumentSnapshot doc) {
//        try {
//            String budgetStr = doc.getString("budget");
//            if (budgetStr == null) return;
//
//            double amount = -Double.parseDouble(budgetStr);
//            Timestamp paymentTimestamp = doc.getTimestamp("paymentDate");
//
//            Map<String, Object> transaction = new HashMap<>();
//            transaction.put("amount", amount);
//            transaction.put("currency", "USD");
//            transaction.put("company", "Project Payment");
//            transaction.put("status", "completed");
//
//            if (paymentTimestamp != null) {
//                transaction.put("date", paymentTimestamp);
//            } else {
//                transaction.put("date", Timestamp.now());
//            }
//
//            db.collection("Transactions").add(transaction)
//                    .addListener(() -> System.out.println("Transaction added for project " + doc.getId()), Runnable::run);
//        } catch (Exception ex) {
//            System.err.println("Failed to create transaction from project: " + ex.getMessage());
//        }
//    }
//}
