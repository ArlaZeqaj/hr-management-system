package com.example.hrsystem.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class DocumentService {

    public List<Map<String, Object>> getDocumentsForUser(String uid) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference docsRef = db.collection("employees").document(uid).collection("documents");

        ApiFuture<QuerySnapshot> future = docsRef.get();
        QuerySnapshot snapshot = future.get();

        List<Map<String, Object>> documents = new ArrayList<>();
        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            Map<String, Object> data = doc.getData();
            data.put("id", doc.getId()); // Include Firestore ID for frontend operations
            documents.add(data);
        }

        return documents;
    }
    public void updateStarStatus(String uid, String docId, boolean starred) {
        Firestore db = FirestoreClient.getFirestore();
        db.collection("employees")
                .document(uid)
                .collection("documents")
                .document(docId)
                .update("starred", starred);
    }
    public void generateSampleDocs(String uid) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference docRef = db.collection("employees").document(uid).collection("documents");

        List<Map<String, Object>> sampleDocs = List.of(
                Map.of("name", "Company_Policy.pdf", "type", "PDF", "category", "Company Policies", "starred", false, "url", "/uploads/sample1.pdf", "formattedDate", LocalDate.now().toString(), "size", "210 KB", "uploadedBy", uid),
                Map.of("name", "Payroll_March.xlsx", "type", "XLSX", "category", "Payroll", "starred", false, "url", "/uploads/sample2.xlsx", "formattedDate", LocalDate.now().toString(), "size", "120 KB", "uploadedBy", uid)
                // Add more samples if desired
        );

        for (Map<String, Object> doc : sampleDocs) {
            docRef.document().set(doc);
        }
    }

}
