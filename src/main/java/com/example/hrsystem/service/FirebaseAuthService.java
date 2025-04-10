package com.example.hrsystem.service;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

@Service
public class FirebaseAuthService {

    private static final String ADMIN_COLLECTION = "Admin";
    private static final String EMPLOYEE_COLLECTION = "employees";

    // Verifies token and returns FirebaseToken object
    public FirebaseToken verifyToken(String idToken) throws FirebaseAuthException {
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
        System.out.println("✅ Verified UID: " + decodedToken.getUid());
        return decodedToken;
    }


    // Checks Firestore for role based on UID
    public String getUserRole(String uid) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        // Check "admins"
        DocumentReference adminRef = db.collection(ADMIN_COLLECTION).document(uid);
        DocumentSnapshot adminDoc = adminRef.get().get();
        if (adminDoc.exists()) {
            return "admin";
        }

        // Check "employees"
        DocumentReference employeeRef = db.collection(EMPLOYEE_COLLECTION).document(uid);
        DocumentSnapshot employeeDoc = employeeRef.get().get();
        if (employeeDoc.exists()) {
            return "employee";
        }

        return null;
    }
}
