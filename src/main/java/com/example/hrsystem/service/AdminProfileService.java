package com.example.hrsystem.service;

import com.example.hrsystem.model.Admin;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class AdminProfileService {

    private static final String COLLECTION_NAME = "Admin";

    public Admin getAdminByEmail(String email) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection(COLLECTION_NAME)
                .whereEqualTo("email", email)
                .limit(1);

        ApiFuture<QuerySnapshot> querySnapshot = query.get();
        List<QueryDocumentSnapshot> documents = querySnapshot.get().getDocuments();

        if (!documents.isEmpty()) {
            Admin admin = documents.get(0).toObject(Admin.class);
            admin.setId(documents.get(0).getId());
            return admin;
        }
        return null;
    }

    public Admin getAdminById(String id) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection(COLLECTION_NAME).document(id);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();

        if (document.exists()) {
            Admin admin = document.toObject(Admin.class);
            admin.setId(document.getId());
            return admin;
        }
        return null;
    }
}