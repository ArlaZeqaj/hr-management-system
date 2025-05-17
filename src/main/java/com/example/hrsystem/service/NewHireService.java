package com.example.hrsystem.service;

import com.example.hrsystem.model.NewHire;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
        NewHire hire = doc.toObject(NewHire.class);
        hire.setDocId(doc.getId()); // 🔥 ADD THIS
        hireList.add(hire);
    }
    return hireList;
}


    public void updateNewHire(String id, NewHire updatedHire) throws ExecutionException, InterruptedException {
    Firestore db = FirestoreClient.getFirestore();
    db.collection(COLLECTION_NAME).document(id).set(updatedHire).get();
}

public void deleteNewHire(String id) throws ExecutionException, InterruptedException {
    Firestore db = FirestoreClient.getFirestore();
    db.collection(COLLECTION_NAME).document(id).delete().get();
}

public void approveNewHire(String id) throws Exception {
    Firestore db = FirestoreClient.getFirestore();
    DocumentSnapshot snapshot = db.collection(COLLECTION_NAME).document(id).get().get();

    if (!snapshot.exists()) {
        throw new IllegalArgumentException("New hire not found");
    }

    NewHire hire = snapshot.toObject(NewHire.class);

    // Create Auth account
    String password = "password123"; // or generate based on policy
    com.google.firebase.auth.UserRecord.CreateRequest request = new com.google.firebase.auth.UserRecord.CreateRequest()
        .setEmail(hire.getEmail())
        .setPassword(password);

    com.google.firebase.auth.UserRecord userRecord = com.google.firebase.auth.FirebaseAuth.getInstance().createUser(request);
    String uid = userRecord.getUid();

    // Convert data and store in employees collection
    Map<String, Object> employeeData = com.example.hrsystem.util.NewHireToEmployeeConverter.convert(hire);
    db.collection("employees").document(uid).set(employeeData).get();

    // Delete from NewHires
    db.collection(COLLECTION_NAME).document(id).delete().get();
}

}
