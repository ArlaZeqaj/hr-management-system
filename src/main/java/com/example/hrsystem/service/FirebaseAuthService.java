package com.example.hrsystem.service;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

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
    public boolean shouldCheckIn(String uid) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        String date = LocalDate.now().toString(); // e.g. "2025-04-24"
        String docId = uid + "_" + date;

        DocumentReference docRef = db.collection("attendanceLogs").document(docId);
        DocumentSnapshot snapshot = docRef.get().get();

        return !snapshot.exists(); // only allow check-in if not already done today
    }


    public void checkInUser(String uid) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        String date = LocalDate.now().toString();
        String docId = uid + "_" + date;

        String time = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));

        Map<String, Object> data = new HashMap<>();
        data.put("uid", uid);
        data.put("date", date);
        data.put("checkIn", time);
        data.put("checkInType", "auto-login");
        data.put("timestamp", FieldValue.serverTimestamp());

        db.collection("attendanceLogs").document(docId).set(data);
    }

    public String generatePasswordResetLink(String email) throws FirebaseAuthException {
        return FirebaseAuth.getInstance().generatePasswordResetLink(email);
    }


}
