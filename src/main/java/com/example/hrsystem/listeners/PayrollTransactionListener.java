//package com.example.hrsystem.listeners;
//import com.google.cloud.Timestamp;
//import com.google.cloud.firestore.DocumentChange;
//import com.google.cloud.firestore.DocumentSnapshot;
//import com.google.cloud.firestore.Firestore;
//import com.google.firebase.cloud.FirestoreClient;
//import jakarta.annotation.PostConstruct;
//import org.springframework.stereotype.Service;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@Service
//public class PayrollTransactionListener {
//
//    private final Firestore db = FirestoreClient.getFirestore();
//
//    @PostConstruct
//    public void listenToPayrollSubcollections() {
//        db.collectionGroup("payroll").addSnapshotListener((snapshots, e) -> {
//            if (e != null || snapshots == null) {
//                System.err.println("Listen to payroll failed: " + e);
//                return;
//            }
//
//            for (DocumentChange change : snapshots.getDocumentChanges()) {
//                if (change.getType() == DocumentChange.Type.ADDED) {
//                    DocumentSnapshot payrollDoc = change.getDocument();
//                    createTransactionFromPayroll(payrollDoc);
//                }
//            }
//        });
//    }
//
//    private void createTransactionFromPayroll(DocumentSnapshot doc) {
//        try {
//            Double grossSalary = doc.getDouble("grossSalary");
//            Timestamp paymentDate = doc.getTimestamp("paymentDate");
//
//            if (grossSalary == null || paymentDate == null) {
//                System.err.println("Missing grossSalary or paymentDate in payroll doc: " + doc.getId());
//                return;
//            }
//
//            Map<String, Object> transaction = new HashMap<>();
//            transaction.put("amount", -grossSalary);
//            transaction.put("currency", "USD");
//            transaction.put("status", "completed");
//            transaction.put("company", "Employee Monthly Payroll");
//            transaction.put("date", paymentDate);
//
//            db.collection("Transactions").add(transaction)
//                    .addListener(() -> System.out.println("Transaction added for payroll " + doc.getId()), Runnable::run);
//        } catch (Exception ex) {
//            System.err.println("Error creating transaction from payroll: " + ex.getMessage());
//        }
//    }
//}
//
