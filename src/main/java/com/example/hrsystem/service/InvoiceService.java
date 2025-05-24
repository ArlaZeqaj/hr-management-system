package com.example.hrsystem.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class InvoiceService {

    private final Firestore db = FirestoreClient.getFirestore();

    public void generateInvoicesFromTransactions() throws Exception {
        ApiFuture<QuerySnapshot> future = db.collection("Transactions").get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        for (QueryDocumentSnapshot doc : documents) {
            Double amount = doc.getDouble("amount");
            if (amount != null && amount > 0) {
                Map<String, Object> invoiceData = new HashMap<>();
                invoiceData.put("amount", amount);
                invoiceData.put("currency", convertCurrency(doc.getString("currency")));
                invoiceData.put("date", formatDate(doc.getTimestamp("date").toDate()));
                invoiceData.put("invoiceNumber", generateInvoiceNumber());

                db.collection("Invoices").add(invoiceData);
            }
        }
    }

    private String generateInvoiceNumber() {
        int random = 100000 + new Random().nextInt(900000);
        return "MS-" + random;
    }

    private String formatDate(Date date) {
        return new SimpleDateFormat("MMMM d, yyyy", Locale.ENGLISH).format(date);
    }

    private String convertCurrency(String currencyCode) {
        if ("USD".equalsIgnoreCase(currencyCode)) {
            return "$";
        }
        return currencyCode;
    }
}

