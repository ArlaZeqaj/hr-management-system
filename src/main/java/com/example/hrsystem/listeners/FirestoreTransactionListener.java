//package com.example.hrsystem.listeners;
//import com.google.cloud.Timestamp;
//import com.google.cloud.firestore.DocumentChange;
//import com.google.cloud.firestore.DocumentSnapshot;
//import com.google.cloud.firestore.Firestore;
//import com.google.firebase.cloud.FirestoreClient;
//import jakarta.annotation.PostConstruct;
//import org.springframework.stereotype.Service;
//
//import java.text.SimpleDateFormat;
//import java.util.*;
//
//@Service
//public class FirestoreTransactionListener {
//
//    private final Firestore db = FirestoreClient.getFirestore();
//
//    @PostConstruct
//    public void startTransactionListener() {
//        db.collection("Transactions").addSnapshotListener((snapshots, error) -> {
//            if (error != null || snapshots == null) {
//                System.err.println("Listen failed: " + error);
//                return;
//            }
//
//            for (DocumentChange change : snapshots.getDocumentChanges()) {
//                if (change.getType() == DocumentChange.Type.ADDED) {
//                    DocumentSnapshot doc = change.getDocument();
//                    processTransaction(doc);
//                }
//            }
//        });
//    }
//
//    private void processTransaction(DocumentSnapshot doc) {
//        Double amount = doc.getDouble("amount");
//
//        if (amount != null && amount > 0) {
//            Map<String, Object> invoiceData = new HashMap<>();
//            invoiceData.put("amount", amount);
//            invoiceData.put("currency", convertCurrency(doc.getString("currency")));
//
//            Timestamp timestamp = doc.getTimestamp("date");
//            if (timestamp != null) {
//                invoiceData.put("date", formatDate(timestamp.toDate()));
//            }
//
//            invoiceData.put("invoiceNumber", generateInvoiceNumber());
//
//            db.collection("Invoices").add(invoiceData).addListener(() ->
//                            System.out.println("Invoice created for transaction " + doc.getId()),
//                    Runnable::run
//            );
//        }
//    }
//
//    private String generateInvoiceNumber() {
//        int random = 100000 + new Random().nextInt(900000);
//        return "MS-" + random;
//    }
//
//    private String formatDate(Date date) {
//        return new SimpleDateFormat("MMMM d, yyyy", Locale.ENGLISH).format(date);
//    }
//
//    private String convertCurrency(String currencyCode) {
//        if ("USD".equalsIgnoreCase(currencyCode)) {
//            return "$";
//        }
//        return currencyCode;
//    }
//}
