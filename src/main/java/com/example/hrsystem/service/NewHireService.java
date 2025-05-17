package com.example.hrsystem.service;

import com.example.hrsystem.model.NewHire;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class NewHireService {

    private static final String COLLECTION_NAME = "NewHires";

    public String saveNewHire(NewHire newHire) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        // Let Firestore auto-generate the ID
        ApiFuture<DocumentReference> future = dbFirestore.collection(COLLECTION_NAME).add(newHire);
        return future.get().getId(); // return generated ID if needed
    }

    public List<NewHire> getAllHires() throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = dbFirestore.collection(COLLECTION_NAME).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<NewHire> hireList = new ArrayList<>();
        for (QueryDocumentSnapshot doc : documents) {
            hireList.add(doc.toObject(NewHire.class));
        }
        return hireList;
    }
}
